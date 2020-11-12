# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:valid_jsonapi_params) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'user'
    hash['data']['attributes'] = FactoryBot.attributes_for(:user, email: 'developer@mapc.org')
    hash.to_json
  end

  let(:valid_jsonapi_params_2) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'user'
    hash['data']['attributes'] = FactoryBot.attributes_for(:user, email: 'manager@mapc.org')
    hash.to_json
  end

  let(:valid_jsonapi_params_role) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'user'
    hash['data']['attributes'] = { role: 'admin' }
    hash.to_json
  end

  describe 'GET /users' do
    it 'works for admins' do
      get users_path, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not work for guest users' do
      get users_path, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /users' do
    it 'lets an administrator create a new user' do
      post users_path, params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:created)
    end

    it 'lets a member of the public create a new user' do
      post users_path, params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PATCH /users' do
    it 'lets a user update their own registration' do
      user = FactoryBot.create(:user, role: 'user')
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      patch "/users/#{user.id}", params: valid_jsonapi_params_2, headers: user_session
      expect(response).to have_http_status(:ok)
    end

    it 'lets an administrator update a users registration' do
      user = FactoryBot.create(:user)
      patch "/users/#{user.id}", params: valid_jsonapi_params_2, headers: admin_user_session
      expect(response).to have_http_status(:ok)
    end

    it 'lets an administrator change a user role' do
      user = FactoryBot.create(:user)
      patch "/users/#{user.id}", params: valid_jsonapi_params_role, headers: admin_user_session
      expect(response).to have_http_status(:ok)
    end

    it 'does not let a user change their own role' do
      user = FactoryBot.create(:user, role: 'user')
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      patch "/users/#{user.id}", params: valid_jsonapi_params_role, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /users' do
    it 'lets a user delete their own account' do
      user = FactoryBot.create(:user, role: 'user')
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      delete "/users/#{user.id}", headers: user_session
      expect(response).to have_http_status(:ok)
    end

    it 'lets an administrator delete a user account' do
      user = FactoryBot.create(:user)
      delete "/users/#{user.id}", headers: admin_user_session
      expect(response).to have_http_status(:ok)
    end

    it 'does not let a user delete another user account' do
      user = FactoryBot.create(:user, role: 'user')
      delete "/users/#{user.id}", headers: registered_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
