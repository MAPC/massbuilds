class UpdateAndAddDevelopmentFields < ActiveRecord::Migration[5.1]
  def change
    add_column :developments, :yrcomp_est, :string
    add_column :developments, :units_1bd, :integer
    add_column :developments, :units_2bd, :integer
    add_column :developments, :units_3bd, :integer
    add_column :developments, :affrd_unit, :integer
    add_column :developments, :aff_u30, :integer
    add_column :developments, :aff_30_50, :integer
    add_column :developments, :aff_50_80, :integer
    add_column :developments, :aff_80p, :integer
    add_column :developments, :headqtrs, :boolean
    add_column :developments, :park_type, :string
    add_column :developments, :publicsqft, :integer
    add_column :developments, :devlper, :string
    rename_column :developments, :tothu, :hu
    rename_column :developments, :twnhsmmult, :smmultifam
    rename_column :developments, :fa_ret, :ret_sqft
    rename_column :developments, :fa_ofcmd, :ofcmd_sqft
    rename_column :developments, :fa_indmf, :indmf_sqft
    rename_column :developments, :fa_whs, :whs_sqft
    rename_column :developments, :fa_rnd, :rnd_sqft
    rename_column :developments, :fa_edinst, :ei_sqft
    rename_column :developments, :fa_other, :other_sqft
    rename_column :developments, :fa_hotel, :hotel_sqft
    rename_column :developments, :project_url, :prj_url
  end
end
