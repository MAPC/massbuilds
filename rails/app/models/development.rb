require 'csv'
require 'zip'
class Development < ApplicationRecord
  acts_as_paranoid
  has_many :edits, dependent: :destroy
  has_many :flags, dependent: :destroy
  belongs_to :user
  include PgSearch
  include ActiveModel::Dirty
  pg_search_scope :search_by_name_and_location, against: [:name, :municipal, :address], using: { tsearch: { any_word: true } }
  validates :name, :status, :latitude, :longitude, :year_compl, :hu,
            :commsf, :descr, presence: true
  validates_inclusion_of :rdv, :asofright, :clusteros, :phased, :stalled, :mixed_use,
                         :headqtrs, :ovr55, :yrcomp_est, in: [true, false, nil]
  with_options if: :proposed?, presence: true do |proposed|
    proposed.validates :singfamhu
    proposed.validates :smmultifam
    proposed.validates :lgmultifam
  end
  with_options if: :groundbroken?, presence: :true do |groundbroken|
    groundbroken.validates :singfamhu
    groundbroken.validates :smmultifam
    groundbroken.validates :lgmultifam
    groundbroken.validates :affrd_unit
    groundbroken.validates :aff_u30
    groundbroken.validates :aff_30_50
    groundbroken.validates :aff_50_80
    groundbroken.validates :aff_80p
    groundbroken.validates :gqpop
    groundbroken.validates :ret_sqft
    groundbroken.validates :ofcmd_sqft
    groundbroken.validates :indmf_sqft
    groundbroken.validates :whs_sqft
    groundbroken.validates :rnd_sqft
    groundbroken.validates :ei_sqft
    groundbroken.validates :other_sqft
    groundbroken.validates :hotel_sqft
    groundbroken.validates :hotelrms
  end

  before_save :update_point
  before_save :set_traffic_count_data_present
  before_save :set_mepa_id_present
  after_save :geocode
  after_save :update_rpa
  after_save :update_county
  after_save :update_municipality
  after_save :update_n_transit
  after_save :update_neighborhood
  after_save :update_loc_id

  @@excluded_attrs_from_export = [
    'other_rate',
    'affordable',
    'parcel_id',
    'programs',
    'forty_b',
    'residential',
    'commercial',
    'd_n_trnsit',
    'flag',
    'deleted_at',
    'point' # point must also be excluded here so it can be replaced with the reprojected point in the shapefile
  ]

  def self.to_csv
    attributes = self.column_names.select { |attr| !(@@excluded_attrs_from_export.include? attr) }

    CSV.generate(headers: true) do |csv|
      csv << attributes
      all.each do |development|
        csv << attributes.map do |attr|
          value = development.send(attr)
          (value.is_a? String) ? value.gsub(/\n/,"").gsub(/\;/,",").gsub(/(^\d{5}$)/,"=\"\\1\"") : value
        end
      end
    end
  end

  def self.to_shp
    attributes = self.column_names.select { |attr| !(@@excluded_attrs_from_export.include? attr) }
    sql = all.select(attributes.join(", ") + ", ST_Transform(point, 26986) as point").to_sql

    database = Rails.configuration.database_configuration[Rails.env]
    hash = Digest::SHA1.hexdigest("#{Time.now.to_i}#{rand}")[0,6]
    file_name = "massbuilds-shp-#{Time.now.strftime("%Y%m%d")}-#{hash}"
    arguments = []
    arguments << "-f #{Rails.root.join('public', file_name)}"
    arguments << "-h #{database['host']}" if database['host']
    arguments << "-p #{database['port']}" if database['port']
    arguments << "-u #{database['username']}" if database['username']
    arguments << "-P #{database['password']}" if database['password']
    arguments << database['database']
    arguments << %("#{sql}") # %Q["SELECT * FROM developments;"]

    `pgsql2shp #{arguments.join(" ")}`

    zip(file_name)
  end

  private

  def update_point
    return if !latitude_changed? and !longitude_changed?
    self.point = "POINT (#{longitude} #{latitude})"
  end

  def geocode
    return if !saved_change_to_point?
    result = Faraday.get "https://pelias.mapc.org/v1/reverse?point.lat=#{self.latitude}&point.lon=#{self.longitude}"
    if result && JSON.parse(result.body)['features'].length > 0
      properties = JSON.parse(result.body)['features'][0]['properties']
      self.update_columns(
        municipal: (properties['locality'] || properties['localadmin'] || self.municipal),
        address: (properties['street'] || self.address),
        zip_code: (properties['postalcode'] || self.zip_code)
      )
    end
  end

  def self.zip(file_name)
    Zip::File.open(Rails.root.join('public', "#{file_name}.zip").to_s, Zip::File::CREATE) do |zipfile|
      zipfile.add("#{file_name}.prj", Rails.root.join('public', 'ma_municipalities_NAD83_MassStatePlane.prj'))
      zipfile.add("#{file_name}.shp", Rails.root.join('public', "#{file_name}.shp"))
      zipfile.add("#{file_name}.shx", Rails.root.join('public', "#{file_name}.shx"))
      zipfile.add("#{file_name}.dbf", Rails.root.join('public', "#{file_name}.dbf"))
      zipfile.add("#{file_name}.cpg", Rails.root.join('public', "#{file_name}.cpg"))
    end
    return file_name
  end

  def proposed?
    status == 'proposed'
  end

  def groundbroken?
    status == ('in_construction' || 'completed')
  end

  def update_rpa
    return if !saved_change_to_point?
    rpa_query = <<~SQL
      SELECT rpa_name, shape
      FROM rpa_poly
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 26986), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(rpa_query).to_hash[0]
    return if sql_result.blank?
    self.update_columns(rpa_name: sql_result['rpa_name'])
  end

  def update_county
    return if !saved_change_to_point?
    counties_query = <<~SQL
      SELECT county, shape
      FROM counties_polym
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 26986), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(counties_query).to_hash[0]
    return if sql_result.blank?
    self.update_columns(county: sql_result['county'])
  end

  def update_municipality
    return if !saved_change_to_point?
    municipalities_query = <<~SQL
      SELECT municipal, shape
      FROM ma_municipalities
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 26986), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(municipalities_query).to_hash[0]
    return if sql_result.blank?
    self.update_columns(municipal: sql_result['municipal'])
  end

  def update_n_transit
    return if !saved_change_to_point?
    n_transit_query = <<~SQL
      SELECT srvc_name, shape
      FROM tod_service_area_poly
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 26986), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(n_transit_query).to_hash
    return if sql_result.blank?
    transit_stops = []
    sql_result.each do |result|
      transit_stops << result['srvc_name']
    end
    self.update_columns(n_transit: transit_stops)
  end

  def update_neighborhood
    return if !saved_change_to_point?
    nhood_query = <<~SQL
      SELECT nhood_name, shape
      FROM neighborhoods_poly
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 26986), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(nhood_query).to_hash[0]
    return if sql_result.blank?
    self.update_columns(nhood: sql_result['nhood_name'])
  end

  def update_loc_id
    return if !saved_change_to_point?
    loc_id_query = <<~SQL
      SELECT parloc_id, geom
      FROM parcels
      WHERE ST_Intersects(ST_GeomFromText('#{point}', 4326), geom);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(loc_id_query).to_hash[0]
    return if sql_result.blank?
    self.update_columns(loc_id: sql_result['parloc_id'])
  end
  
  def set_mepa_id_present
    self.mepa_id_present = mepa_id.present?
  end
  
  def set_traffic_count_data_present
    self.traffic_count_data_present = traffic_count_data.present?
  end
end
