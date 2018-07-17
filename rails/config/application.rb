require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Massbuilds
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.generators.javscript_engine :js
    config.middleware.use ActionDispatch::Flash
    config.middleware.use Rack::MethodOverride

    known_hosts = [
      'http://localhost:4200',
      'https://staging.massbuilds.com',
      'https://massbuilds.com',
      'https://www.massbuilds.com',
    ]

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins known_hosts
        resource '*', :headers => :any, :methods => [:get, :post, :options, :put, :patch, :delete]
      end
    end
  end
end
