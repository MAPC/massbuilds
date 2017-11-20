require 'rails_helper'

RSpec.describe "Developments", type: :request do
  let(:valid_session) {
    user = FactoryBot.create(:user)
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  describe "GET /developments" do
    it "works! (now write some real specs)" do
      get developments_path, headers: valid_session
      expect(response).to have_http_status(200)
    end
  end
end
