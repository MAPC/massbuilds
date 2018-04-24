class PasswordResetsController < ApplicationController
  skip_after_action :verify_authorized
  skip_before_action :authenticate_user!
  def create
    password = Devise.friendly_token.first(8)
    user = User.find_by_email(password_reset_params[:email])
    if user.try(:reset_password, password, password)
      email_password_to(user, password)
      respond_to do |format|
        format.jsonapi { head :created }
      end
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
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
end
