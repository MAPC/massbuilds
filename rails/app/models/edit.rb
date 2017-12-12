class Edit < ApplicationRecord
  belongs_to :user
  belongs_to :development
  before_save :update_development, if: :approved?

  private

  def update_development
    if development
      development.update(proposed_changes)
    else
      proposed_changes.merge(user_id: user.id)
      Development.create(proposed_changes)
    end
    UserMailer.edit_approved_email(self)
  end
end
