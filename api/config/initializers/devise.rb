Devise.setup do |config|
  require "devise/orm/active_record"

  config.mailer_sender = "no-reply@liftthatsh.local"
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth, :params_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.sign_out_via = :delete
  config.navigational_formats = []

  config.jwt do |jwt|
    jwt.secret = ENV.fetch("JWT_SECRET") { Rails.application.secret_key_base }
    jwt.dispatch_requests = [
      ["POST", %r{^/auth/login$}],
      ["POST", %r{^/auth/register$}]
    ]
    jwt.revocation_requests = [
      ["DELETE", %r{^/auth/logout$}]
    ]
    jwt.expiration_time = 30.days.to_i
  end
end
