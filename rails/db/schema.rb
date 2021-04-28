# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20210319190347) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"
  enable_extension "postgres_fdw"

  create_table "allpoints_final2", primary_key: "gid", id: :integer, default: nil, force: :cascade do |t|
    t.decimal "id"
    t.integer "muni_id"
    t.string "muni", limit: 18
    t.string "parloc_id", limit: 20
    t.decimal "fy", precision: 10
    t.geometry "geom", limit: {:srid=>26986, :type=>"st_point"}
    t.index ["geom"], name: "allpoints_final2_geom_idx", using: :gist
  end

  create_table "developments", force: :cascade do |t|
    t.integer "user_id"
    t.boolean "rdv"
    t.boolean "asofright"
    t.boolean "ovr55"
    t.boolean "clusteros"
    t.boolean "phased"
    t.boolean "stalled"
    t.string "name"
    t.string "status"
    t.text "descr"
    t.string "prj_url"
    t.string "address"
    t.string "state", default: "MA"
    t.string "zip_code"
    t.integer "height"
    t.integer "stories"
    t.integer "year_compl"
    t.integer "prjarea"
    t.integer "singfamhu"
    t.integer "smmultifam"
    t.integer "lgmultifam"
    t.integer "hu"
    t.integer "gqpop"
    t.integer "rptdemp"
    t.integer "commsf"
    t.integer "hotelrms"
    t.integer "onsitepark"
    t.bigint "total_cost"
    t.float "ret_sqft"
    t.float "ofcmd_sqft"
    t.float "indmf_sqft"
    t.float "whs_sqft"
    t.float "rnd_sqft"
    t.float "ei_sqft"
    t.float "other_sqft"
    t.float "hotel_sqft"
    t.float "other_rate"
    t.float "affordable"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "parcel_id"
    t.boolean "mixed_use"
    t.geometry "point", limit: {:srid=>4326, :type=>"st_point"}
    t.string "programs"
    t.boolean "forty_b"
    t.boolean "residential"
    t.boolean "commercial"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "municipal"
    t.string "devlper"
    t.boolean "yrcomp_est"
    t.integer "units_1bd"
    t.integer "units_2bd"
    t.integer "units_3bd"
    t.integer "affrd_unit"
    t.integer "aff_u30"
    t.integer "aff_30_50"
    t.integer "aff_50_80"
    t.integer "aff_80p"
    t.boolean "headqtrs"
    t.string "park_type"
    t.integer "publicsqft"
    t.integer "unknownhu"
    t.integer "aff_unknown"
    t.integer "unk_sqft"
    t.string "loc_id"
    t.integer "parcel_fy"
    t.string "d_n_trnsit"
    t.string "rpa_name"
    t.string "county"
    t.string "nhood"
    t.text "n_transit", default: [], array: true
    t.boolean "flag", default: false, null: false
    t.datetime "deleted_at"
    t.integer "mepa_id"
    t.string "traffic_count_data"
    t.boolean "mepa_id_present"
    t.boolean "traffic_count_data_present"
    t.index ["deleted_at"], name: "index_developments_on_deleted_at"
  end

  create_table "edits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "development_id"
    t.json "proposed_changes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "approved", default: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_edits_on_deleted_at"
    t.index ["development_id"], name: "index_edits_on_development_id"
    t.index ["user_id"], name: "index_edits_on_user_id"
  end

  create_table "flags", force: :cascade do |t|
    t.string "reason"
    t.boolean "is_resolved"
    t.bigint "development_id"
    t.bigint "user_id"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_flags_on_deleted_at"
    t.index ["development_id"], name: "index_flags_on_development_id"
    t.index ["user_id"], name: "index_flags_on_user_id"
  end

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

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 3
    t.string "authentication_token"
    t.string "first_name"
    t.string "last_name"
    t.string "municipality"
    t.boolean "request_verified_status", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "developments", "users"
  add_foreign_key "edits", "developments"
  add_foreign_key "edits", "users"
  add_foreign_key "flags", "developments"
  add_foreign_key "flags", "users"
end
