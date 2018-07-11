class DevelopmentSerializer < ActiveModel::Serializer
  belongs_to :user
  # WARNING: This serializer exists solely to serialize JSONAPI relationships
  # for other models. Fast_jsonapi serializer serializes the actual development
  # objects in full_development_serializer.rb and
  # truncated_development_serializer.rb.
end
