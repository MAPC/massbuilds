class DevelopmentPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    !user&.disabled? && (user&.admin? || user&.verified? || (user&.municipal? && (record.municipal == user.municipality)))
  end

  def update?
    !user&.disabled? && (user&.admin? || (user&.verified? && user.developments.include?(record)) || (user&.municipal? && user.developments.include?(record)))
  end

  def destroy?
    !user&.disabled? && (user&.admin? || (user&.municipal? && (record.municipal == user.municipality)))
  end
end
