require 'rails_helper'

RSpec.describe "PasswordResets", type: :request do
  let(:jsonapi_session) {
    { 'Content-Type' => 'application/vnd.api+json', 'Accept' => 'application/vnd.api+json' }
  }

  let(:valid_jsonapi_params) {
    hash = Hash.new {|h,k| h[k] = Hash.new(&h.default_proc) }
    hash["email"] = User.last.email
    hash.to_json
  }

  describe "POST /users" do
    it "works as an admin" do
      ActiveJob::Base.queue_adapter = :test
      admin_user = FactoryBot.create(:user)
      admin_session = { Authorization: "Token token=#{admin_user.authentication_token}, email=#{admin_user.email}" }
      expect {
        post password_resets_path, params: valid_jsonapi_params, headers: admin_session.merge(jsonapi_session)
      }.to have_enqueued_job.on_queue('mailers')
      expect(response).to have_http_status(:created)
    end

    it "works as a user" do
      ActiveJob::Base.queue_adapter = :test
      user = FactoryBot.create(:user, role: 'user')
      user_session = { Authorization: "Token token=#{user.authentication_token}, email=#{user.email}" }
      expect {
        post password_resets_path, params: valid_jsonapi_params, headers: user_session.merge(jsonapi_session)
      }.to have_enqueued_job.on_queue('mailers')
      expect(response).to have_http_status(:created)
    end
  end
end
