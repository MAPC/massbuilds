class FullDevelopmentSerializer
  include FastJsonapi::ObjectSerializer
  set_type :development

  belongs_to :user

  [:id, :name, :status, :address, :year_compl, :yrcomp_est, :nhood, :municipal,
    :devlper, :user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled,
    :descr, :prj_url, :state, :zip_code, :height, :stories, :prjarea,
    :singfamhu, :smmultifam, :lgmultifam, :hu, :gqpop, :rptdemp,
    :commsf, :hotelrms, :onsitepark, :total_cost, :ret_sqft, :rpa_name,
    :county, :n_transit, :ofcmd_sqft, :indmf_sqft, :whs_sqft, :rnd_sqft,
    :ei_sqft, :other_sqft, :hotel_sqft, :other_rate, :affordable, :parcel_id,
    :mixed_use, :point, :programs, :forty_b, :residential, :commercial,
    :units_1bd, :units_2bd, :units_3bd, :affrd_unit, :aff_u30, :aff_30_50,
    :aff_50_80, :aff_80p, :headqtrs, :park_type, :publicsqft, :unknownhu,
    :unk_sqft, :aff_unknown, :updated_at, :flag, :mepa_id, :traffic_count_data].each { |attr| attribute attr }

  attribute :latitude do |object|
    object.point.try :y
  end

  attribute :longitude do |object|
    object.point.try :x
  end

  attribute :updated_at do |object|
    object.updated_at.iso8601
  end

end
