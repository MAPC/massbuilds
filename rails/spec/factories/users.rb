# frozen_string_literal: true
FactoryBot.define do
  sequence :email do |n|
    "email#{n}@factory.com"
  end
  factory :user do
    email
    password { 'P@sswordT3st' }
    role { 'admin' }
    municipality { 'Boston' }
    request_verified_status { false }
  end
end
