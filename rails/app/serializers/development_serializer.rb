class DevelopmentSerializer < ActiveModel::Serializer
[:id, :name, :status, :address, :municipality, :devlper, :latitude, :longitude].each { |attr| attribute attr }
[:user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled,
  :desc, :prj_url, :mapc_notes, :tagline, :state, :zip_code, :height,
  :stories, :year_compl, :prjarea, :singfamhu, :smmultifam, :lgmultifam,
  :hu, :gqpop, :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark,
  :total_cost, :team_membership_count, :cancelled, :private, :ret_sqft,
  :ofcmd_sqft, :indmf_sqft, :whs_sqft, :rnd_sqft, :ei_sqft, :other_sqft,
  :hotel_sqft, :other_rate, :affordable, :parcel_id, :mixed_use, :point,
  :programs, :forty_b, :residential, :commercial, :yrcomp_est, :units_1bd,
  :units_2bd, :units_3bd, :affrd_unit, :aff_u30, :aff_30_50, :aff_50_80,
  :aff_80p, :headqtrs, :park_type, :publicsqft].each { |attr| attribute attr, unless: :truncated? }

  def truncated?
    scope == 'trunc'
  end

  def latitude
    self.object.point.y
  end

  def longitude
    self.object.point.x
  end
end
