class SandboxEmailInterceptor
  def self.delivering_email(message)
    message.to = ['digitalservices@mapc.org']
  end
end

if Rails.env.staging? || Rails.env.development?
  ActionMailer::Base.register_interceptor(SandboxEmailInterceptor)
end
