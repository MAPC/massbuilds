require 'csv'
require 'zip'
class Development < ApplicationRecord
  has_many :edits
  belongs_to :user
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

  def self.to_shp(sql)
    database = Rails.configuration.database_configuration[Rails.env]
    file_name = "export-#{Time.now.to_i}"
    arguments = []
    arguments << "-f #{Rails.root.join('public', file_name)}"
    arguments << "-h #{database['host']}" if database['host']
    arguments << "-u #{database['username']}" if database['username']
    arguments << "-P #{database['password']}" if database['password']
    arguments << database['database']
    arguments << %("#{sql}") # %Q["SELECT * FROM developments;"]

    `pgsql2shp #{arguments.join(" ")}`

    zip(file_name)
  end

  private

  def self.zip(file_name)
    Zip::File.open(Rails.root.join('public', "#{file_name}.zip").to_s, Zip::File::CREATE) do |zipfile|
      zipfile.add("#{file_name}.shp", Rails.root.join('public', "#{file_name}.shp"))
      zipfile.add("#{file_name}.shx", Rails.root.join('public', "#{file_name}.shx"))
      zipfile.add("#{file_name}.dbf", Rails.root.join('public', "#{file_name}.dbf"))
      zipfile.add("#{file_name}.cpg", Rails.root.join('public', "#{file_name}.cpg"))
    end
    return file_name
  end
end
