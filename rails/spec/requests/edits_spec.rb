require 'rails_helper'

RSpec.describe "Edits", type: :request do

  let(:admin_session) {
    user = FactoryBot.create(:user)
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:user_session) {
    user = FactoryBot.create(:user, role: 'user')
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:verified_session) {
    user = FactoryBot.create(:user, role: 'verified')
    { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
  }

  let(:jsonapi_session) {
    { 'Content-Type' => 'application/vnd.api+json', 'Accept' => 'application/vnd.api+json' }
  }

  let(:valid_params) {
    { "edit" => FactoryBot.attributes_for(:edit) }
  }

  let(:valid_jsonapi_params) {
    hash = Hash.new {|h,k| h[k] = Hash.new(&h.default_proc) }
    hash["data"]["type"] = "edit"
    hash["data"]["attributes"] = FactoryBot.attributes_for(:edit)
    hash.to_json
  }

  describe "GET /edits" do
    it "works as an admin" do
      get edits_path, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
    end

    it "does not work as a user" do
      get edits_path, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /edits" do
    it "works as a verified user" do
      post edits_path, params: valid_jsonapi_params, headers: verified_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
    end

    it "works as an admin" do
      post edits_path, params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
    end

    it "does not work as a user" do
      post edits_path, params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "PATCH /edits/:id" do
    it "works as an admin" do
      edit = FactoryBot.create(:edit)
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:no_content)
    end

    it "does not work as a user" do
      edit = FactoryBot.create(:edit)
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /edits/:id" do
    it "works as an admin" do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:no_content)
    end

    it "works as a verified user" do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: verified_session.merge(jsonapi_session)
      expect(response).to have_http_status(:no_content)
    end

    it "does not work as a user" do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
