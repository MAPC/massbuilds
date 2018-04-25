class ApplicationMailer < ActionMailer::Base
  default from: 'admin@mailgun2.mapc.org'
  layout 'mailer'
end
