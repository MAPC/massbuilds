# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Edits', type: :request do
  let(:valid_jsonapi_params) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'edit'
    hash['data']['attributes'] = FactoryBot.attributes_for(:edit)
    hash.to_json
  end

  let(:valid_filter_not_approved_params) do
    { filter: { approved: false } }
  end

  let(:valid_filter_approved_params) do
    { filter: { approved: true } }
  end

  describe 'listing all the edits' do
    it 'works as an admin' do
      get edits_path, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'lets me filter by not approved' do
      create(:edit)
      get edits_path, params: valid_filter_not_approved_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['data'].count).to eq(1)
    end

    it 'lets me filter by approved' do
      create(:edit)
      get edits_path, params: valid_filter_approved_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['data'].count).to eq(0)
    end

    it 'does not work as a user' do
      get edits_path, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'creating edits' do
    it 'works as a verified user' do
      post edits_path, params: valid_jsonapi_params, headers: verified_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a municipal user' do
      post edits_path, params: valid_jsonapi_params, headers: municipal_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as an admin' do
      post edits_path, params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a registered user' do
      post edits_path, params: valid_jsonapi_params, headers: registered_user_session
      expect(response).to have_http_status(:success)
    end

    it 'fails as a guest user' do
      post edits_path, params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'updating edits' do
    it 'works as an admin' do
      edit = FactoryBot.create(:edit)
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not work as a guest user' do
      edit = FactoryBot.create(:edit)
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'works on edits within the same geography for municipal users' do
      development = FactoryBot.create(:development)
      edit = FactoryBot.create(:edit, development: development)
      user = FactoryBot.create(:user, role: 'municipal')
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: user_session
      expect(response).to have_http_status(:success)
    end

    it 'fails on edits outside the covered geography for municipal users' do
      development = FactoryBot.create(:development, municipal: 'Worcester', latitude: 42.2626, longitude: -71.8023, point: nil)
      user = FactoryBot.create(:user, role: 'municipal')
      edit = FactoryBot.create(:edit, user: user, development: development)
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      put "/edits/#{edit.id}", params: valid_jsonapi_params, headers: user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'deleting edits' do
    it 'works as an admin' do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: admin_user_session
      expect(response).to have_http_status(:no_content)
    end

    it 'works for your own edit if it was not approved yet' do
      user = FactoryBot.create(:user, role: 'user')
      edit = FactoryBot.create(:edit, user: user)
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      delete "/edits/#{edit.id}", headers: user_session
      expect(response).to have_http_status(:no_content)
    end

    it 'works as a verified user' do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: verified_user_session
      expect(response).to have_http_status(:no_content)
    end

    it 'does not work as a guest user' do
      edit = FactoryBot.create(:edit)
      delete "/edits/#{edit.id}", headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
