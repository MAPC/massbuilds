FactoryBot.define do
  factory :edit do
    proposed_changes { { name: 'Test Development', tagline: "new tagline", state: "CT", hotelrms: 2 } }
  end
end
