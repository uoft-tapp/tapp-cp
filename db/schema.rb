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

ActiveRecord::Schema.define(version: 20170718181449) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "contracts", force: :cascade do |t|
    t.bigint "position_id"
    t.bigint "applicant_id"
    t.bigint "offer_id"
    t.text "link", null: false
    t.boolean "accepted", default: false
    t.boolean "withdrawn", default: false
    t.boolean "printed", default: false
    t.integer "nag_count", default: 0
    t.datetime "deadline", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applicant_id"], name: "index_contracts_on_applicant_id"
    t.index ["link"], name: "index_contracts_on_link"
    t.index ["offer_id"], name: "index_contracts_on_offer_id"
    t.index ["position_id"], name: "index_contracts_on_position_id"
  end

  create_table "offers", force: :cascade do |t|
    t.bigint "position_id"
    t.bigint "applicant_id"
    t.boolean "objection", default: false
    t.boolean "sent", default: false
    t.integer "hours", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applicant_id"], name: "index_offers_on_applicant_id"
    t.index ["position_id"], name: "index_offers_on_position_id"
  end

  add_foreign_key "contracts", "offers"
end
