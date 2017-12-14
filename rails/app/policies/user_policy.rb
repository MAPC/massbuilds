class UserPolicy < ApplicationPolicy
  def initialize(user, record)
    @user = user
    @record = record
  end

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
