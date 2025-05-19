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
