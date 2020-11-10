class FlagPolicy < ApplicationPolicy
  def index?
    !user&.disabled? && (user&.admin? || user&.verified?)
  end

  def create?
    !user&.disabled?
  end

  def update?
    !user&.disabled? && (user&.admin? || (user.municipal? && (record.development.municipal == user.municipality)))
  end

  def destroy?
    !user&.disabled? && (user&.admin? || user&.verified? || (user&.edits&.include?(record) && record.approved == false))
  end
end
