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
    if !user&.disabled? && (user&.admin? || (user&.verified? && user.developments.include?(record)) || (user&.municipal? && user.developments.include?(record)))
      true
    else
      [:flag]
    end
  end

  def destroy?
    !user&.disabled? && (user&.admin? || (user&.municipal? && (record.municipal == user.municipality)))
  end
end
