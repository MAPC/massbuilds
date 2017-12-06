require 'csv'
class Development < ApplicationRecord
  has_many :edits
  include PgSearch
  pg_search_scope :search_by_name_and_location, against: [:name, :municipality, :address], using: { tsearch: { any_word: true } }
  validates :name, presence: true

  def self.to_csv
    attributes = self.column_names
    CSV.generate(headers: true) do |csv|
      csv << self.column_names
      all.each do |development|
        csv << attributes.map{ |attr| development.send(attr) }
      end
    end
  end
end
