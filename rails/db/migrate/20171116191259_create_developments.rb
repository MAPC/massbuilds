class CreateDevelopments < ActiveRecord::Migration[5.1]
  def change
    create_table :developments do |t|
      t.integer :creator_id
      t.boolean :rdv
      t.boolean :asofright
      t.boolean :ovr55
      t.boolean :clusteros
      t.boolean :phased
      t.boolean :stalled
      t.string :name
      t.string :status
      t.text :desc
      t.string :project_url
      t.text :mapc_notes
      t.string :tagline
      t.string :address
      t.string :state, default: 'MA'
      t.string :zip_code
      t.integer :height
      t.integer :stories
      t.integer :year_compl
      t.integer :prjarea
      t.integer :singfamhu
      t.integer :twnhsmmult
      t.integer :lgmultifam
      t.integer :tothu
      t.integer :gqpop
      t.integer :rptdemp
      t.integer :emploss
      t.integer :estemp
      t.integer :commsf
      t.integer :hotelrms
      t.integer :onsitepark
      t.integer :total_cost
      t.integer :team_membership_count
      t.boolean :cancelled, default: false
      t.boolean :private, default: false
      t.float :fa_ret
      t.float :fa_ofcmd
      t.float :fa_indmf
      t.float :fa_whs
      t.float :fa_rnd
      t.float :fa_edinst
      t.float :fa_other
      t.float :fa_hotel
      t.float :other_rate
      t.float :affordable
      t.decimal :latitude
      t.decimal :longitude
      t.string :parcel_id
      t.boolean :mixed_use
      t.st_point :point
      t.string :programs
      t.boolean :forty_b
      t.boolean :residential
      t.boolean :commercial

      t.timestamps
    end
  end
end
