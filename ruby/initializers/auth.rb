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
