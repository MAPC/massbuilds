class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :role, :municipality, :request_verified_status, :created_at

  has_many :developments
  has_many :edits

  # attribute :created_at do |object|
  #   object.created_at.iso8601
  # end
end
