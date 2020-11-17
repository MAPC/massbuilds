class PasswordResetsController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_default_request_format

  def create
    user = User.find_by_email(password_reset_params[:email])
    if user.try(:send_reset_password_instructions)
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

  def set_default_request_format
    request.format = :json unless params[:format]
  end
end
