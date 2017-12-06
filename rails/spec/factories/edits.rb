FactoryBot.define do
  factory :edit do
    user
    development
    proposed_changes { { tagline: "new tagline", state: "CT", hotelrms: 2 } }
  end
end
