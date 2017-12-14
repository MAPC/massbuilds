class DevelopmentPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user&.admin? || user&.verified? || (user&.municipal? && (record.municipality == user.municipality))
  end

  def update?
    user&.admin? || (user&.verified? && user.developments.include?(record)) || (user&.municipal? && user.developments.include?(record))
  end

  def destroy?
    user&.admin? || (user&.municipal? && (record.municipality == user.municipality))
  end
end
