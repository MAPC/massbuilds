class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :role, :municipality, :request_verified_status

  has_many :developments
end
