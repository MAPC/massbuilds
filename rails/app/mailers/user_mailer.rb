class UserMailer < ApplicationMailer
  default from: 'admin@massbuilds.com'
  def password_reset_email(user, password)
    @user = user
    @password = password
    @login_url = url_for("#{root_url}login")
    mail(to: @user.email, subject: 'Your Massbuilds Password')
  end

  def new_user_email(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome to MassBuilds')
  end

  def edit_approved_email(edit)
    @edit = edit
    mail(to: @edit.user.email, subject: 'Your Edit in MassBuilds Was Approved')
  end
end
