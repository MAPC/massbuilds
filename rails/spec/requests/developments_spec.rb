require 'rails_helper'

RSpec.describe "Developments", type: :request do
  let(:admin_session) {
    user = FactoryBot.create(:user)
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:user_session) {
    user = FactoryBot.create(:user, role: 'user')
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:valid_params) {
    { "development" => FactoryBot.attributes_for(:development) }
  }

  describe "GET /developments" do
    it "works as an admin" do
      get developments_path, headers: admin_session
      expect(response).to have_http_status(:success)
    end

    it "works as a user" do
      get developments_path, headers: user_session
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /developments" do
    it "works as an admin" do
      post developments_path, params: valid_params, headers: admin_session
      expect(response).to have_http_status(:found)
    end

    it "does not work as a user" do
      post developments_path, params: valid_params, headers: user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "PUT /developments/:id" do
    it "works as an admin" do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_params, headers: admin_session
      expect(response).to have_http_status(:found)
    end

    it "does not work as a user" do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_params, headers: user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /developments/:id" do
    it "works as an admin" do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: admin_session
      expect(response).to have_http_status(:found)
    end

    it "does not work as a user" do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
