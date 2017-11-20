require 'rails_helper'

RSpec.describe "Developments", type: :request do
  let(:valid_session) {
    user = FactoryBot.create(:user)
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:valid_params) {
    { "development" => FactoryBot.attributes_for(:development) }
  }

  describe "GET /developments" do
    it "works! (now write some real specs)" do
      get developments_path, headers: valid_session
      expect(response).to have_http_status(200)
    end
  end

  describe "POST /developments" do
    it "works!" do
      post developments_path, params: valid_params, headers: valid_session
    end
  end

  describe "PUT /developments/:id" do
    it "works!" do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_params, headers: valid_session
    end
  end

  describe "DELETE /developments/:id" do
    it "works!" do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: valid_session
    end
  end
end
