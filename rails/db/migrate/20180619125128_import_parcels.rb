class ImportParcels < ActiveRecord::Migration[5.1]
  def up
    create_table "parcels", primary_key: "gid", id: :serial, force: :cascade do |t|
      t.decimal "objectid", precision: 10
      t.decimal "mapc_id", precision: 10
      t.integer "muni_id"
      t.string "muni", limit: 18
      t.string "parloc_id", limit: 20
      t.string "poly_typ", limit: 18
      t.string "map_num", limit: 18
      t.string "mappar_id", limit: 50
      t.decimal "loc_id_cnt", precision: 10
      t.decimal "land_value"
      t.decimal "bldg_value"
      t.decimal "othr_value"
      t.decimal "total_valu"
      t.decimal "ls_price"
      t.string "ls_date", limit: 10
      t.decimal "bldg_area"
      t.decimal "res_area"
      t.string "luc_1", limit: 5
      t.string "luc_2", limit: 5
      t.string "luc_adj_1", limit: 5
      t.string "luc_adj_2", limit: 5
      t.decimal "num_units"
      t.decimal "units_est"
      t.string "units_src", limit: 8
      t.decimal "num_rooms"
      t.decimal "yr_built", precision: 10
      t.string "site_addr", limit: 80
      t.string "addr_str", limit: 60
      t.string "addr_num", limit: 12
      t.string "addr_zip", limit: 12
      t.string "owner_name", limit: 80
      t.string "owner_addr", limit: 80
      t.string "owner_city", limit: 25
      t.string "owner_stat", limit: 4
      t.string "owner_zip", limit: 10
      t.decimal "fy", precision: 10
      t.decimal "lot_areaft"
      t.decimal "far"
      t.decimal "pct_imperv"
      t.decimal "pct_bldg"
      t.decimal "pct_pave"
      t.decimal "landv_pac"
      t.decimal "bldgv_psf"
      t.decimal "totv_pac"
      t.decimal "bldlnd_rat"
      t.decimal "sqm_imperv"
      t.decimal "sqm_bldg"
      t.decimal "sqm_pave"
      t.string "realesttyp", limit: 5
      t.decimal "shape_leng"
      t.decimal "shape_area"
      t.geometry "geom", limit: {:srid=>4326, :type=>"multi_polygon"}
      t.json "geojson"
      t.index ["geom"], name: "parcels_geom_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    # pg_restore version must match the DB version
    # system("pg_restore -Fc -a -v -j 8 -t parcels #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/parcels.dump")
  end
  def down
    drop_table :parcels
  end
end
