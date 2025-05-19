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
