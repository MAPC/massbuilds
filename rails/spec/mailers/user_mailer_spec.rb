require "rails_helper"

RSpec.describe "UserMailer", type: :mailer do
  describe "email password" do
    let(:user) { FactoryBot.create(:user) }
    let(:mail) { UserMailer.password_reset_email(user, user.password) }

    it "renders the headers" do
      expect(mail.subject).to eq("Your Massbuilds Password")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["admin@massbuilds.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to include(user.password)
    end
  end
end
