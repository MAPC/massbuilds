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

ActiveRecord::Schema.define(version: 20171117204740) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "developments", force: :cascade do |t|
    t.integer "creator_id"
    t.boolean "rdv"
    t.boolean "asofright"
    t.boolean "ovr55"
    t.boolean "clusteros"
    t.boolean "phased"
    t.boolean "stalled"
    t.string "name"
    t.string "status"
    t.text "desc"
    t.string "project_url"
    t.text "mapc_notes"
    t.string "tagline"
    t.string "address"
    t.string "state", default: "MA"
    t.string "zip_code"
    t.integer "height"
    t.integer "stories"
    t.integer "year_compl"
    t.integer "prjarea"
    t.integer "singfamhu"
    t.integer "twnhsmmult"
    t.integer "lgmultifam"
    t.integer "tothu"
    t.integer "gqpop"
    t.integer "rptdemp"
    t.integer "emploss"
    t.integer "estemp"
    t.integer "commsf"
    t.integer "hotelrms"
    t.integer "onsitepark"
    t.integer "total_cost"
    t.integer "team_membership_count"
    t.boolean "cancelled", default: false
    t.boolean "private", default: false
    t.float "fa_ret"
    t.float "fa_ofcmd"
    t.float "fa_indmf"
    t.float "fa_whs"
    t.float "fa_rnd"
    t.float "fa_edinst"
    t.float "fa_other"
    t.float "fa_hotel"
    t.float "other_rate"
    t.float "affordable"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "parcel_id"
    t.boolean "mixed_use"
    t.geometry "point", limit: {:srid=>0, :type=>"st_point"}
    t.string "programs"
    t.boolean "forty_b"
    t.boolean "residential"
    t.boolean "commercial"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.integer "role"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
