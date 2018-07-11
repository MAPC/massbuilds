class SessionsController < Devise::SessionsController
  respond_to :html, :json

  def create
    skip_authorization

    user_from_email = User.where(email: params[:user][:email])
    if user_from_email.length > 0
      disabled_user = user_from_email.first.role == 'disabled'
      if disabled_user
        if request.format.json?
          data = {
            message: 'Disabled user',
          }
          render json: data, status: 401 and return
        end
      end
    end


    super do |user|
      if request.format.json?
        data = {
          token: user.authentication_token,
          email: user.email,
        }
        render json: data, status: 201 and return
      end
    end
  end

  def new
    skip_authorization
    super
  end

end
