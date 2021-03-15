class DevelopmentPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    !user&.disabled? && (user&.admin? || user&.verified? || (user&.municipal? && (record.municipal == user.municipality || get_municipality(record) == user.municipality)))
  end

  def update?
    !user&.disabled? && (user&.admin? || (user&.verified? && user.developments.include?(record)) || (user&.municipal? && user.developments.include?(record)))
  end

  def destroy?
    !user&.disabled? && (user&.admin? || (user&.municipal? && (record.municipal == user.municipality || get_municipality(record) == user.municipality)))
  end

  def flag?
    true
  end

  private

  def get_municipality(record)
    result = Faraday.get "https://pelias.mapc.org/v1/reverse?point.lat=#{record.latitude}&point.lon=#{record.longitude}"
    if result && JSON.parse(result.body)['features'].length > 0
      properties = JSON.parse(result.body)['features'][0]['properties']
      return (properties['locality'] || properties['localadmin']).upcase
    end
  end

end
