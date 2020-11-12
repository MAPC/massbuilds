# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Flags', type: :request do
  let(:valid_jsonapi_params) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'flag'
    hash['data']['attributes'] = FactoryBot.attributes_for(:flag)
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
end
