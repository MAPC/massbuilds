class EditSerializer < ActiveModel::Serializer
  attributes :id, :proposed_changes
  has_one :user
  has_one :development
end
