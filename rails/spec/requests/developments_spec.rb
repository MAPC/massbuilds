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

  let(:jsonapi_session) {
    { 'Content-Type' => 'application/vnd.api+json', 'Accept' => 'application/vnd.api+json' }
  }

  let(:valid_params) {
    { "development" => FactoryBot.attributes_for(:development) }
  }

  let(:valid_jsonapi_params) {
    hash = Hash.new {|h,k| h[k] = Hash.new(&h.default_proc) }
    hash["data"]["type"] = "development"
    hash["data"]["attributes"] = FactoryBot.attributes_for(:development)
    hash.to_json
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

    it "works without logging in" do
      get developments_path
      expect(response).to have_http_status(:success)
    end

    it "works with JSONAPI" do
      get developments_path, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
    end

    it "can search for developments by name" do
      FactoryBot.create(:development)
      FactoryBot.create(:development, name: "MAPC")
      get developments_path, params: { term: 'Seaport' }, headers: jsonapi_session
      expect(response.body).to include('Seaport')
    end

    it "can search for developments by street address" do
      FactoryBot.create(:development)
      get developments_path, params: { term: '123 Main Street' }, headers: jsonapi_session
      expect(response.body).to include('123 Main Street')
    end

    it "can search for developments by municipality name" do
      FactoryBot.create(:development)
      get developments_path, params: { term: 'Boston' }, headers: jsonapi_session
      expect(response.body).to include('Boston')
    end
  end

  describe "POST /developments" do
    it "works as an admin" do
      post developments_path, params: valid_params, headers: admin_session
      expect(response).to have_http_status(:found)
    end

    it "works as an admin via JSONAPI" do
      post developments_path, params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
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
