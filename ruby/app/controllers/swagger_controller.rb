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
