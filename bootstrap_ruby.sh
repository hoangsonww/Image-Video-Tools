#!/usr/bin/env bash
set -e

# 1) Create base dir
mkdir -p ruby
cd ruby

# 2) Gemfile
cat > Gemfile << 'EOF'
source 'https://rubygems.org'

ruby '2.7.0'

gem 'sinatra',           '~> 2.1'
gem 'mongoid',           '~> 7.3'
gem 'jwt',               '~> 2.6'
gem 'bcrypt',            '~> 3.1'
gem 'rack-cors',         '~> 1.1'
gem 'mini_magick',       '~> 4.11'
gem 'streamio-ffmpeg',   '~> 3.0'
gem 'sidekiq',           '~> 6.5'
gem 'swagger-blocks',    '~> 3.0'
gem 'sinatra-namespace', '~> 1.3'
gem 'dotenv',            '~> 3.0'
gem 'rack-contrib',      '~> 2.0'  # for JSON body parser
EOF

# 3) config.ru
cat > config.ru << 'EOF'
require 'dotenv/load'
require './app'
run App
EOF

# 4) Mongoid config
mkdir -p config
cat > config/mongoid.yml << 'EOF'
development:
  clients:
    default:
      database: image_video_tools_dev
      hosts:
        - localhost:27017
      options:
production:
  clients:
    default:
      uri: <%= ENV['MONGODB_URI'] %>
EOF

# 5) Sidekiq config
cat > config/sidekiq.yml << 'EOF'
:concurrency: 5
:queues:
  - default
EOF

# 6) app.rb (boot + middleware + namespaces)
cat > app.rb << 'EOF'
require 'sinatra/base'
require 'sinatra/namespace'
require 'rack/contrib'
require 'mongoid'
require 'rack/cors'
require 'swagger/blocks'
require './initializers/database'
require './initializers/cors'
require './initializers/auth'

class App < Sinatra::Base
  register Sinatra::Namespace
  use Rack::JSONBodyParser
  use Rack::Cors do
    allow do
      origins '*'
      resource '*', headers: :any, methods: %i[get post put delete options]
    end
  end

  before do
    pass if request.path =~ /^\/auth/
    authenticate!
  end

  namespace '/auth' do
    post '/register' do
      Controllers::AuthController.register(params)
    end
    post '/login' do
      Controllers::AuthController.login(params)
    end
  end

  namespace '/api/v1' do
    # image tools
    namespace '/images' do
      post '/resize'         do Controllers::ImagesController.resize(params)        end
      post '/crop'           do Controllers::ImagesController.crop(params)          end
      post '/rotate'         do Controllers::ImagesController.rotate(params)        end
      post '/filter'         do Controllers::ImagesController.filter(params)        end
      post '/convert'        do Controllers::ImagesController.convert(params)       end
      post '/watermark'      do Controllers::ImagesController.watermark(params)     end
      post '/background_remove' do Controllers::ImagesController.remove_background(params) end
    end

    # video tools
    namespace '/videos' do
      post '/thumbnail'      do Controllers::VideosController.thumbnail(params)     end
      post '/thumbnails_random' do Controllers::VideosController.random_thumbnails(params) end
      post '/remove_audio'   do Controllers::VideosController.remove_audio(params)  end
    end

    # user-managed uploads metadata
    namespace '/uploads' do
      get    ''      do Controllers::UploadsController.list     end
      delete '/:id'  do Controllers::UploadsController.destroy  params[:id]  end
    end
  end

  # Swagger docs endpoint
  get '/docs.json' do
    content_type :json
    Swagger::Blocks.build_root_json([Controllers::SwaggerController])
  end

  run! if app_file == $0
end
EOF

# 7) initializers
mkdir -p initializers
# database
cat > initializers/database.rb << 'EOF'
Mongoid.load!('config/mongoid.yml', ENV['RACK_ENV'] || :development)
EOF
# CORS already in app.rb
# auth
cat > initializers/auth.rb << 'EOF'
require 'jwt'
module AuthHelper
  SECRET = ENV.fetch('JWT_SECRET') { 'supersecret' }

  def authenticate!
    token = request.env['HTTP_AUTHORIZATION']&.slice(7..)
    payload, _ = JWT.decode(token, SECRET, true, algorithm: 'HS256')
    @current_user = Models::User.find(payload['user_id'])
  rescue
    halt 401, { error: 'Unauthorized' }.to_json
  end

  def issue_token(user)
    payload = { user_id: user.id.to_s, exp: Time.now.to_i + 3600 }
    JWT.encode(payload, SECRET, 'HS256')
  end
end
EOF

# 8) models
mkdir -p app/models
cat > app/models/user.rb << 'EOF'
module Models
  class User
    include Mongoid::Document
    include Mongoid::Timestamps

    field :email,              type: String
    field :password_digest,    type: String

    has_many :uploads, class_name: 'Models::Upload', dependent: :destroy

    validates :email, presence: true, uniqueness: true
    validates :password_digest, presence: true

    def password=(pwd)
      self.password_digest = BCrypt::Password.create(pwd)
    end

    def authenticate(pwd)
      BCrypt::Password.new(password_digest) == pwd
    end
  end
end
EOF

cat > app/models/upload.rb << 'EOF'
module Models
  class Upload
    include Mongoid::Document
    include Mongoid::Timestamps

    field :user_id,      type: BSON::ObjectId
    field :tool,         type: String
    field :input_path,   type: String
    field :output_path,  type: String
    field :options,      type: Hash

    belongs_to :user, class_name: 'Models::User'
  end
end
EOF

# 9) controllers
mkdir -p app/controllers
cat > app/controllers/auth_controller.rb << 'EOF'
module Controllers
  class AuthController
    extend AuthHelper

    def self.register(params)
      user = Models::User.new(email: params['email'])
      user.password = params['password']
      halt 400, { error: user.errors.full_messages }.to_json unless user.save
      { token: issue_token(user) }.to_json
    end

    def self.login(params)
      user = Models::User.where(email: params['email']).first
      if user&.authenticate(params['password'])
        { token: issue_token(user) }.to_json
      else
        halt 401, { error: 'Invalid credentials' }.to_json
      end
    end
  end
end
EOF

cat > app/controllers/images_controller.rb << 'EOF'
require 'mini_magick'

module Controllers
  class ImagesController
    extend AuthHelper

    UPLOAD_DIR = 'public/uploads'

    def self.store_upload(tool, file, options = {})
      FileUtils.mkdir_p(UPLOAD_DIR)
      fname = "#{SecureRandom.uuid}_\#{file[:filename]}"
      in_path  = File.join(UPLOAD_DIR, "in_#{fname}")
      out_path = File.join(UPLOAD_DIR, "out_#{fname}")
      File.binwrite(in_path, file[:tempfile].read)

      case tool
      when :resize
        img = MiniMagick::Image.open(in_path)
        img.resize "\#{options['width']}x\#{options['height']}"
        img.write out_path
      when :crop
        img = MiniMagick::Image.open(in_path)
        img.crop "#{options['width']}x#{options['height']}+#{options['x']}+#{options['y']}"
        img.write out_path
      when :rotate
        img = MiniMagick::Image.open(in_path)
        img.rotate options['degrees']
        img.write out_path
      when :filter
        img = MiniMagick::Image.open(in_path)
        img.auto_orient
        img.combine_options do |c|
          c.modulate options['brightness'], options['saturation'], options['hue']
          c.blur "0x\#{options['blur']}"
        end
        img.write out_path
      when :convert
        img = MiniMagick::Image.open(in_path)
        img.format options['format']
        img.write out_path
      when :watermark
        img = MiniMagick::Image.open(in_path)
        img.combine_options do |c|
          c.gravity options['gravity'] || 'SouthEast'
          c.draw "text 0,0 '\#{options['text']}'"
          c.fill options['color'] || 'white'
          c.pointsize options['size'] || 32
        end
        img.write out_path
      when :remove_background
        # naive color-based removal (or call external API)
        img = MiniMagick::Image.open(in_path)
        img.transparent options['bg_color'] || 'white'
        img.write out_path
      end

      Models::Upload.create!(
        user_id: @current_user.id,
        tool: tool.to_s,
        input_path: in_path,
        output_path: out_path,
        options: options
      )
      { url: out_path.sub('public/', '/') }
    end

    class << self
      def resize(params);         store_upload(:resize, params['file'], params)  end
      def crop(params);           store_upload(:crop,   params['file'], params)  end
      def rotate(params);         store_upload(:rotate, params['file'], params)  end
      def filter(params);         store_upload(:filter, params['file'], params)  end
      def convert(params);        store_upload(:convert,params['file'], params)  end
      def watermark(params);      store_upload(:watermark,params['file'], params) end
      def remove_background(params); store_upload(:remove_background, params['file'], params) end
    end
  end
end
EOF

cat > app/controllers/videos_controller.rb << 'EOF'
require 'streamio-ffmpeg'

module Controllers
  class VideosController
    extend AuthHelper

    UPLOAD_DIR = 'public/uploads'

    def self.thumbnail(params)
      vid = params['file']
      FileUtils.mkdir_p(UPLOAD_DIR)
      in_path  = File.join(UPLOAD_DIR, SecureRandom.uuid + "_" + vid[:filename])
      File.binwrite(in_path, vid[:tempfile].read)
      movie = FFMPEG::Movie.new(in_path)
      timestamp = params['time'] || (movie.duration / 2).to_i
      out_path = in_path.sub(/\.\w+$/, '') + "_thumb.jpg"
      movie.screenshot(out_path, seek_time: timestamp.to_i)
      Models::Upload.create!(user_id: @current_user.id, tool: 'thumbnail', input_path: in_path, output_path: out_path, options: { time: timestamp })
      { url: out_path.sub('public/', '/') }
    end

    def self.random_thumbnails(params)
      vid = params['file']
      FileUtils.mkdir_p(UPLOAD_DIR)
      in_path  = File.join(UPLOAD_DIR, SecureRandom.uuid + "_" + vid[:filename])
      File.binwrite(in_path, vid[:tempfile].read)
      movie = FFMPEG::Movie.new(in_path)
      thumbs = []
      20.times do
        t = rand(0..movie.duration).to_i
        out = in_path.sub(/\.\w+$/, '') + "_thumb_\#{t}.jpg"
        movie.screenshot(out, seek_time: t)
        thumbs << out.sub('public/', '/')
      end
      Models::Upload.create!(user_id: @current_user.id, tool: 'random_thumbnails', input_path: in_path, output_path: nil, options: { count: 20 })
      { thumbnails: thumbs }
    end

    def self.remove_audio(params)
      vid = params['file']
      FileUtils.mkdir_p(UPLOAD_DIR)
      in_path  = File.join(UPLOAD_DIR, SecureRandom.uuid + "_" + vid[:filename])
      File.binwrite(in_path, vid[:tempfile].read)
      movie = FFMPEG::Movie.new(in_path)
      out_path = in_path.sub(/\.\w+$/, '') + "_silent.mp4"
      movie.transcode(out_path, audio_codec: 'none')
      Models::Upload.create!(user_id: @current_user.id, tool: 'remove_audio', input_path: in_path, output_path: out_path, options: {})
      { url: out_path.sub('public/', '/') }
    end
  end
end
EOF

cat > app/controllers/uploads_controller.rb << 'EOF'
module Controllers
  class UploadsController
    def self.list
      Models::Upload.where(user_id: @current_user.id).map do |u|
        { id: u.id.to_s, tool: u.tool, in: u.input_path, out: u.output_path, at: u.created_at }
      end.to_json
    end

    def self.destroy(id)
      up = Models::Upload.find(id)
      halt 403 unless up.user_id == @current_user.id
      up.destroy
      { success: true }.to_json
    end
  end
end
EOF

# 10) Swagger docs
mkdir -p app/controllers
cat > app/controllers/swagger_controller.rb << 'EOF'
module Controllers
  class SwaggerController
    include Swagger::Blocks

    swagger_root do
      key :swagger, '2.0'
      info do
        key :version, '1.0.0'
        key :title, 'Image & Video Tools API'
        key :description, 'Comprehensive media manipulation endpoints'
      end
      tag do
        key :name, 'images'
        key :description, 'Image tools'
      end
      tag do
        key :name, 'videos'
        key :description, 'Video tools'
      end
    end
  end
end
EOF

# 11) .env.example
cat > .env.example << 'EOF'
MONGODB_URI=mongodb://localhost:27017/image_video_tools
JWT_SECRET=your_jwt_secret_here
EOF

# 12) README stub
cat > README.md << 'EOF'
# Image & Video Tools Backend

This is the Sinatra + Mongoid + JWT backend for the Image & Video Tools app:
https://image-video-tools.onrender.com/

## Setup

1. `cd ruby`
2. Copy `.env.example` to `.env` and fill in your `MONGODB_URI` and `JWT_SECRET`.
3. `bundle install`
4. `bundle exec sidekiq -C config/sidekiq.yml &`
5. `rackup -p 4567`

Your API will be live at `http://localhost:4567`.

EOF

echo "✅ Done! Your Ruby backend scaffold is under ./ruby"
echo "→ cd ruby && bundle install && rackup"
