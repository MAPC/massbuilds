class EditSerializer < ActiveModel::Serializer
  attributes :id, :proposed_changes, :approved, :created_at

  belongs_to :user
  belongs_to :development
end
