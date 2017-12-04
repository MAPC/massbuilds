class UserMailer < ApplicationMailer
  default from: 'admin@massbuilds.com'
  def password_reset_email(user, password)
    @user = user
    @password = password
    @login_url = url_for("#{root_url}login")
    mail(to: @user.email, subject: 'Your Massbuilds Password')
  end
end
