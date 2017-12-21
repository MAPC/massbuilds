require 'rails_helper'

RSpec.describe Edit, type: :model do
  it "updates the development when approved" do
    development = FactoryBot.create(:development)
    edit = FactoryBot.create(:edit, development: development)
    edit.update(approved: true)
    development.reload
    expect(development.state).to eq('CT')
    expect(development.tagline).to eq('new tagline')
    expect(development.hotelrms).to eq(2)
  end

  it "creates a new development when approved if one does not exist" do
    pending 'A new development saved as an edit needs to also validate'
    edit1 = FactoryBot.create(:edit)
    user = FactoryBot.create(:user)
    edit1.update(user: user)
    edit1.update(approved: true)
    development = Development.last
    expect(development.state).to eq('CT')
    expect(development.tagline).to eq('new tagline')
    expect(development.hotelrms).to eq(2)
  end

  it "does not update the development when not approved" do
    development = FactoryBot.create(:development)
    edit = FactoryBot.create(:edit, development: development)
    edit.update(approved: false)
    development.reload
    expect(development.state).to eq('MA')
  end
end
