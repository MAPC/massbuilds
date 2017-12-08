class DevelopmentSerializer < ActiveModel::Serializer
[:id, :name, :status, :address, :municipality, :developer_name, :latitude, :longitude].each { |attr| attribute attr }
[:user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled, :project_url, :mapc_notes, :tagline, :state, :zip_code, :height, :stories, :year_compl, :prjarea, :singfamhu, :twnhsmmult, :lgmultifam, :tothu, :gqpop, :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark, :total_cost, :team_membership_count, :cancelled, :private, :fa_ret, :fa_ofcmd, :fa_indmf, :fa_whs, :fa_rnd, :fa_edinst, :fa_other, :fa_hotel, :other_rate, :affordable, :parcel_id, :mixed_use, :point, :programs, :forty_b, :residential, :commercial, :desc].each { |attr| attribute attr, unless: :truncated? }

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
