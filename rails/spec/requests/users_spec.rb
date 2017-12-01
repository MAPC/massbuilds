require 'rails_helper'

RSpec.describe "Users", type: :request do
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
    hash["data"]["type"] = "user"
    hash["data"]["attributes"] = FactoryBot.attributes_for(:user, email: 'developer@mapc.org')
    hash.to_json
  }

  let(:valid_jsonapi_params_2) {
    hash = Hash.new {|h,k| h[k] = Hash.new(&h.default_proc) }
    hash["data"]["type"] = "user"
    hash["data"]["attributes"] = FactoryBot.attributes_for(:user, email: 'manager@mapc.org')
    hash.to_json
  }

  let(:valid_jsonapi_params_role) {
    hash = Hash.new {|h,k| h[k] = Hash.new(&h.default_proc) }
    hash["data"]["type"] = "user"
    hash["data"]["attributes"] = { role: 'admin' }
    hash.to_json
  }

  describe "GET /users" do
    it "works with JSONAPI for admins" do
      get users_path, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:success)
      expect(response.header['Content-Type']).to include('application/vnd.api+json')
    end

    it "does not work for users" do
      get users_path, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /users" do
    it "lets an administrator create a new user" do
      post users_path, params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:created)
    end

    it "lets a member of the public create a new user" do
      post users_path, params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH /users" do
    it "lets a user update their own registration" do
      user = FactoryBot.create(:user, email: 'test1@mapc.org', role: 'user')
      user_session = { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
      patch "/users/#{user.id}", params: valid_jsonapi_params_2, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:ok)
    end

    it "lets an administrator update a users registration" do
      user = FactoryBot.create(:user, email: 'test2@mapc.org')
      patch "/users/#{user.id}", params: valid_jsonapi_params_2, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:ok)
    end

    it "lets an administrator change a user role" do
      user = FactoryBot.create(:user, email: 'test3@mapc.org')
      patch "/users/#{user.id}", params: valid_jsonapi_params_role, headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:ok)
    end

    it "does not let a user change their own role" do
      user = FactoryBot.create(:user, email: 'test4@mapc.org', role: 'user')
      user_session = { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
      patch "/users/#{user.id}", params: valid_jsonapi_params_role, headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /users" do
    it "lets a user delete their own account" do
      user = FactoryBot.create(:user, email: 'test8@mapc.org', role: 'user')
      user_session = { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
      delete "/users/#{user.id}", headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:ok)
    end

    it "lets an administrator delete a user account" do
      user = FactoryBot.create(:user, email: 'test6@mapc.org')
      delete "/users/#{user.id}", headers: admin_session.merge(jsonapi_session)
      expect(response).to have_http_status(:ok)
    end

    it "does not let a user delete another user account" do
      user = FactoryBot.create(:user, email: 'test7@mapc.org', role: 'user')
      delete "/users/#{user.id}", headers: user_session.merge(jsonapi_session)
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
