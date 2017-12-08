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
      get developments_path, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
    end

    it "works as a user" do
      get developments_path, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
    end

    it "works without logging in" do
      get developments_path, headers: jsonapi_session
      expect(response).to have_http_status(:success)
    end

    it "returns only truncated data when using trunc param" do
      FactoryBot.create(:development)
      get developments_path, params: { trunc: true }, headers: jsonapi_session
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['data'][0]['attributes']['name']).to eq('Seaport')
      expect(parsed_body['data'][0]['attributes']['status']).to eq('MyString')
      expect(parsed_body['data'][0]['attributes']['longitude']).to eq(-71.3940804)
      expect(parsed_body['data'][0]['attributes']['latitude']).to eq(42.1845218)
    end

    it "returns results within the bounding box" do
      FactoryBot.create(:development)
      get developments_path, params: { minLng: '-75', minLat: '0', maxLng: '0', maxLat: '45' }, headers: jsonapi_session
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['data'][0]['attributes']['name']).to eq('Seaport')
    end

    it "does not return results outside the bounding box" do
      FactoryBot.create(:development)
      get developments_path, params: { minLng: '-5', minLat: '0', maxLng: '0', maxLat: '5' }, headers: jsonapi_session
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['data'][0]).to be_nil
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

    it "can search for developments by hotel rooms" do
      FactoryBot.create(:development)
      get developments_path, params: { hotelrms: 1 }, headers: jsonapi_session
      expect(response.body).to include('Boston')
    end

    it "can export developments as a CSV" do
      FactoryBot.create(:development)
      get '/developments.csv', params: { term: 'Boston' }, headers: jsonapi_session
      expect(response.content_type).to eq('text/csv')
      expect(response.body).to include('Seaport')
    end
  end

  describe "POST /developments" do
    it "works as an admin via JSONAPI" do
      post developments_path, params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
    end

    it "does not work as a user" do
      post developments_path, params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "PUT /developments/:id" do
    it "works as an admin" do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:found)
    end

    it "does not work as a user" do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /developments/:id" do
    it "works as an admin" do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:no_content)
    end

    it "does not work as a user" do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
