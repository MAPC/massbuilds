require 'csv'
require 'zip'
class Development < ApplicationRecord
  has_many :edits
  belongs_to :user
  include PgSearch
  pg_search_scope :search_by_name_and_location, against: [:name, :municipal, :address], using: { tsearch: { any_word: true } }
  validates :name, :status, :address, :yrcomp_est, :year_compl, :zip_code, :hu,
            :commsf, :descr, presence: true
  validates_inclusion_of :rdv, :asofright, :clusteros, :phased, :stalled, :mixed_use,
                         :headqtrs, :ovr55, in: [true, false]
  with_options if: :proposed?, presence: true do |proposed|
    proposed.validates :singfamhu
    proposed.validates :smmultifam
    proposed.validates :lgmultifam
    proposed.validates :onsitepark
    proposed.validates :park_type
  end
  with_options if: :groundbroken?, presence: :true do |groundbroken|
    groundbroken.validates :singfamhu
    groundbroken.validates :smmultifam
    groundbroken.validates :lgmultifam
    groundbroken.validates :units_1bd
    groundbroken.validates :units_2bd
    groundbroken.validates :units_3bd
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
    groundbroken.validates :onsitepark
    groundbroken.validates :park_type
    groundbroken.validates :publicsqft
  end


  before_save :geocode
  after_save :update_rpa
  after_save :update_county
  after_save :update_n_transit
  after_save :update_neighborhood

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

  def geocode
    return if point.present?
    result = Faraday.get "http://www.mapquestapi.com/geocoding/v1/address?key=#{Rails.application.secrets.mapquest_api_key}&location=#{address},#{state},#{zip_code}"
    self.point = "POINT (#{JSON.parse(result.body)['results'][0]['locations'][0]['latLng']['lng']} #{JSON.parse(result.body)['results'][0]['locations'][0]['latLng']['lat']})"
  end

  def self.zip(file_name)
    Zip::File.open(Rails.root.join('public', "#{file_name}.zip").to_s, Zip::File::CREATE) do |zipfile|
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
    return if rpa_name.present?
    rpa_query = <<~SQL
      SELECT rpa_name
      FROM
        (SELECT rpa_name, ST_TRANSFORM(rpa_poly.shape, 4326) as shape FROM rpa_poly) rpa,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(point, rpa.shape)
        AND id = #{id};
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(rpa_query).to_hash[0]
    return if sql_result.blank?
    self.rpa_name = sql_result['rpa_name']
    self.save(validate: false)
  end

  def update_county
    return if county.present?
    counties_query = <<~SQL
      SELECT county
      FROM
        (SELECT county, ST_TRANSFORM(counties_polym.shape, 4326) as shape FROM counties_polym) county,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(point, county.shape)
        AND id = #{id};
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(counties_query).to_hash[0]
    return if sql_result.blank?
    self.county = sql_result['county']
    self.save(validate: false)
  end

  def update_municipality
    return if municipal.present?
    municipalities_query = <<~SQL
      SELECT municipal
      FROM
        (SELECT municipal, ST_TRANSFORM(ma_municipalities.shape, 4326) as shape FROM ma_municipalities) municipality,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(point, municipality.shape)
        AND id = #{id};
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(municipalities_query).to_hash[0]
    return if sql_result.blank?
    self.municipal = sql_result['municipal']
    self.save(validate: false)
  end

  def update_n_transit
    return if n_transit.present?
    n_transit_query = <<~SQL
      SELECT srvc_name
      FROM
        (SELECT srvc_name, ST_TRANSFORM(tod_service_area_poly.shape, 4326) as shape FROM tod_service_area_poly) service_area,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(point, service_area.shape)
        AND id = #{id};
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(n_transit_query).to_hash
    return if sql_result.blank?
    transit_stops = []
    sql_result.each do |result|
      transit_stops << result['srvc_name']
    end
    self.n_transit = transit_stops
    self.save(validate: false)
  end

  def update_neighborhood
    return if nhood.present?
    nhood_query = <<~SQL
      SELECT nhood_name
      FROM
        (SELECT nhood_name, ST_TRANSFORM(neighborhoods_poly.shape, 4326) as shape FROM neighborhoods_poly) nhood,
        (SELECT id, name, point FROM developments) development
        WHERE ST_Intersects(point, nhood.shape)
        AND id = #{id};
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(nhood_query).to_hash[0]
    return if sql_result.blank?
    self.nhood = sql_result['nhood_name']
    self.save(validate: false)
  end
end
