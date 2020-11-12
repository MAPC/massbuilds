# frozen_string_literal: true

FactoryBot.define do
  factory :flag do
    user
    development
    sequence(:reason) { |n| "Wrong Reason #{n}" }
    is_resolved { false }
  end
end
