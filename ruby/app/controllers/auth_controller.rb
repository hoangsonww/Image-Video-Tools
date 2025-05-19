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
