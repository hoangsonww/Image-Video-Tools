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
