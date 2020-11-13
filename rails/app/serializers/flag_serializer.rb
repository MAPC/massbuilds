# frozen_string_literal: true
class FlagSerializer < ActiveModel::Serializer
  %i[id reason is_resolved].each { |attr| attribute attr }

  belongs_to :user
  belongs_to :development

  attribute :created_at do
    object.created_at.iso8601
  end

  attribute :updated_at do
    object.updated_at.iso8601
  end
end
