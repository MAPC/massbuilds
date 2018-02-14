RSpec.shared_context 'example users' do
  let(:registered_user_session) do
    user = FactoryBot.create(:user, role: 'user')
    {
      Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  end

  let(:verified_user_session) do
    user = FactoryBot.create(:user, role: 'verified')
    {
      Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  end

  let(:municipal_user_session) do
    user = FactoryBot.create(:user, role: 'municipal')
    {
      Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  end

  let(:admin_user_session) do
    user = FactoryBot.create(:user, role: 'admin')
    {
      Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  end

  let(:guest_user_session) do
    {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  end
end
