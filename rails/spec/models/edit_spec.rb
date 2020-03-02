require 'rails_helper'

RSpec.describe Edit, type: :model do
  it "updates the development when approved" do
    development = FactoryBot.create(:development)
    edit = FactoryBot.create(:edit, development: development, proposed_changes: { state: 'CT' })
    edit.update(approved: true)
    development.reload
    expect(development.state).to eq('CT')
  end

  it "validates against JSON schema for new developments" do
    edit = FactoryBot.build(:edit, proposed_changes: {})
    edit.valid?
    expect(edit.errors.messages[:"#/"][0]).to include("The property '#/' did not contain a required property of 'name' in schema")
  end

  it "creates a new development when approved if one does not exist" do
    edit1 = FactoryBot.create(:edit)
    user = FactoryBot.create(:user)
    edit1.update(user: user)
    edit1.update(approved: true)
    development = Development.last
    expect(development.descr).to eq('A sample edited development')
  end

  it "does not update the development when not approved" do
    development = FactoryBot.create(:development)
    edit = FactoryBot.create(:edit, development: development)
    edit.update(approved: false)
    development.reload
    expect(development.descr).to eq('A sample development')
  end
end
