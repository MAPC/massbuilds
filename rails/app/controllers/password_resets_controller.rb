class PasswordResetsController < ApplicationController
  skip_after_action :verify_authorized
  skip_before_action :authenticate_user!
  before_action :set_default_request_format

  def create
    password = Devise.friendly_token.first(8)
    user = User.find_by_email(password_reset_params[:email])
    if user.try(:reset_password, password, password)
      email_password_to(user, password)
      respond_to do |format|
        format.json { render json: {}, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: {}, status: :unprocessable_entity }
      end
    end
  end

  private

  def password_reset_params
    params.permit(:email)
  end

  def email_password_to(user, password)
    UserMailer.password_reset_email(user, password).deliver_later
  end

  def set_default_request_format
    request.format = :json unless params[:format]
  end
end
