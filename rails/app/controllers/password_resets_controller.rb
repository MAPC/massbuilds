class PasswordResetsController < ApplicationController
  skip_after_action :verify_authorized
  def create
    password = Devise.friendly_token.first(8)
    user = User.find_by_id(password_reset_params[:id])
    if user.try(:reset_password, password, password)
      email_password_to(user, password)
      respond_to do |format|
        format.jsonapi { head :created }
        format.html { redirect_to @outgoing_message, notice: 'Check your email for your new password.' }
      end
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
      end
    end
  end

  private

  def password_reset_params
    ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:id])
  end

  def email_password_to(user, password)
    UserMailer.password_reset_email(user, password).deliver_later
  end
end
