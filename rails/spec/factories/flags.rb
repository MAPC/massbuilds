FactoryBot.define do
  factory :flag do
    user
    development
    reason "Wrong municipality"
    is_resolved false
  end
end
