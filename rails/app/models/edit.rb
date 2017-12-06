class Edit < ApplicationRecord
  belongs_to :user
  belongs_to :development
  before_save :update_development, if: :approved?

  private

  def update_development
    development.update(proposed_changes)
  end
end
