class EditPolicy < ApplicationPolicy
  def index?
    user&.admin? || user&.verified?
  end

  def create?
    user&.admin? || user&.verified?
  end

  def update?
    user&.admin?
  end

  def destroy?
    user&.admin? || user&.verified?
  end
end
