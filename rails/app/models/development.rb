class Development < ApplicationRecord
  include PgSearch
  pg_search_scope :search_by_name_and_location, against: [:name, :municipality, :address], using: { tsearch: { any_word: true } }
  validates :name, presence: true
end
