# ruby/image_video_tools_api.gemspec
Gem::Specification.new do |s|
  s.name          = "image_video_tools_api"
  s.version       = "1.0.0"
  s.summary       = "Image & Video Tools backend API (Sinatra + Mongoid + JWT + MiniMagick + FFMPEG)"
  s.description   = "A comprehensive media‐processing API: image resizing, cropping, rotating, filtering, watermarking & background removal, plus video thumbnails and audio stripping."
  s.authors       = ["Son Nguyen"]
  s.email         = ["hoangson091104@gmail.com"]
  s.homepage      = "https://github.com/hoangsonww/image-video-tools"
  s.license       = "MIT"

  s.files         = Dir.chdir(File.expand_path(__dir__)) do
    Dir[
      "app/**/*.rb",
      "config/**/*.yml",
      "initializers/**/*.rb",
      "app.rb",
      "config.ru",
      "Gemfile*",
      "README.md",
      ".env.example"
    ]
  end

  s.required_ruby_version = ">= 2.7.0"
  s.add_dependency "sinatra",           "~> 2.1"
  s.add_dependency "mongoid",           "~> 7.3"
  s.add_dependency "jwt",               "~> 2.6"
  s.add_dependency "bcrypt",            "~> 3.1"
  s.add_dependency "rack-cors",         "~> 1.1"
  s.add_dependency "mini_magick",       "~> 4.11"
  s.add_dependency "streamio-ffmpeg",   "~> 3.0"
  s.add_dependency "sidekiq",           "~> 6.5"
  s.add_dependency "swagger-blocks",    "~> 3.0"
  s.add_dependency "sinatra-namespace", "~> 1.3"
  s.add_dependency "dotenv",            "~> 3.0"
  s.add_dependency "rack-contrib",      "~> 2.0"

  s.metadata = {
    "github_repo" => "https://github.com/hoangsonww/image-video-tools"
  }
end
