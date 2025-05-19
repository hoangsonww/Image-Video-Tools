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
