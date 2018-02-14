class EditPolicy < ApplicationPolicy
  def index?
    user&.admin? || user&.verified?
  end

  def create?
    user&.admin? || user&.verified? || user&.user? || user&.municipal?
  end

  def update?
    user&.admin? || (user.municipal? && (record.development.municipal == user.municipality))
  end

  def destroy?
    user&.admin? || user&.verified? || (user&.edits&.include?(record) && record.approved == false)
  end
end
