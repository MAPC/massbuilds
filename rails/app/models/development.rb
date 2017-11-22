class Development < ApplicationRecord
  include PgSearch
  pg_search_scope :search_by_name, against: [:name], using: { tsearch: { any_word: true } }
end
