class ApplicationController < ActionController::Base
  include Pundit::Authorization
  before_action :authenticate_user_from_token!
  before_action :authenticate_user!
  # protect_from_forgery with: :null_session
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def authenticate_user_from_token!
    authenticate_with_http_token do |token, options|
      user_email = options[:email].presence
      user = user_email && User.find_by_email(user_email)
      if user && Devise.secure_compare(user.authentication_token, token)
        sign_in user, store: false
      end
    end
  end

  def user_not_authorized
    head :unauthorized
  end
end
