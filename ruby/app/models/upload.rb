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
