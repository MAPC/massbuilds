class PasswordsController < Devise::PasswordsController
  respond_to :html, :json
  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      render jsonapi: { message: 'Successfully updated password.' }
    else
      render jsonapi: { message: 'Please enter a password that meets the requirements.' }
    end
  end

  private

  def resource_params
    ActiveModelSerializers::Deserialization.jsonapi_parse(params)
  end
end