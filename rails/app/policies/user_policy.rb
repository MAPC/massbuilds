class UserPolicy < ApplicationPolicy
  def index?
    user&.admin?
  end

  def create?
    true
  end

  def update?
    user&.admin? || (record == user)
  end

  def destroy?
    user&.admin? || (record == user)
  end
end
