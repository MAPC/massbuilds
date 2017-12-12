# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def edit_approved_email
    UserMailer.edit_approved_email(Edit.last)
  end
end
