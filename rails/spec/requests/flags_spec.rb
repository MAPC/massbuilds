# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Flags', type: :request do
  let(:valid_jsonapi_params) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'flag'
    hash['data']['attributes'] = FactoryBot.attributes_for(:flag)
    hash.to_json
  end

  let(:valid_jsonapi_params_flag_update) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'development'
    hash['data']['attributes'] = { is_resolved: true }
    hash.to_json
  end

  describe 'creating flags' do
    it 'works as a verified user' do
      post flags_path, params: valid_jsonapi_params, headers: verified_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a municipal user' do
      post flags_path, params: valid_jsonapi_params, headers: municipal_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as an admin' do
      post flags_path, params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a registered user' do
      post flags_path, params: valid_jsonapi_params, headers: registered_user_session
      expect(response).to have_http_status(:success)
    end

    it 'fails as a guest user' do
      post flags_path, params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'listings flags' do
    it 'works as an admin' do
      create_list(:flag, 3)
      get flags_path, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'lets us filter to see only unresolved flags' do
      create(:flag)
      create(:flag, is_resolved: true)

      get flags_path, params: { filter: { is_resolved: false } }, headers: admin_user_session
      expect(JSON.parse(response.body)['data'].count).to eq(1)
    end
  end

  describe 'editing/patching flag' do
    it 'updates a flag property (is_resolved) for admins' do
      flag = create(:flag)
      put flag_path(flag.id), params: valid_jsonapi_params_flag_update, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not update for guests' do
      flag = create(:flag)
      put flag_path(flag.id), params: valid_jsonapi_params_flag_update, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not update for non-admin-level users' do
      flag = create(:flag)
      put flag_path(flag.id), params: valid_jsonapi_params_flag_update, headers: registered_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
