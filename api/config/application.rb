require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"

Bundler.require(*Rails.groups)

module LiftThatSh
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.time_zone = "America/Sao_Paulo"
    config.i18n.available_locales = [:"pt-BR", :en]
    config.i18n.default_locale = :"pt-BR"
    config.i18n.fallbacks = [:en]
  end
end
