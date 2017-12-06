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

  it "does not update the development when not approved" do
    development = FactoryBot.create(:development)
    edit = FactoryBot.create(:edit, development: development)
    edit.update(approved: false)
    development.reload
    expect(development.state).to eq('MA')
  end
end
