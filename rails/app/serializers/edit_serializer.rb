class EditSerializer < ActiveModel::Serializer
  [:id, :proposed_changes, :approved].each { |attr| attribute attr }

  belongs_to :user
  belongs_to :development

  attribute :created_at do |object|
    object.created_at.iso8601
  end
end
