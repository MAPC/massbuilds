class EditSerializer < ActiveModel::Serializer
  attributes :id, :proposed_changes, :approved, :created_at

  belongs_to :user
  belongs_to :development

  attribute :created_at do |object|
    object.created_at.iso8601
  end

end
