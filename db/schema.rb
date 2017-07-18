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

  create_table "contracts", force: :cascade do |t|
    t.integer "position_id"
    t.integer "applicant_id"
    t.text "hash"
    t.boolean "accepted"
    t.boolean "withdrawn"
    t.boolean "printed"
    t.integer "nag_count"
    t.datetime "email_date"
    t.datetime "deadline"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applicant_id"], name: "index_contracts_on_applicant_id"
    t.index ["hash"], name: "index_contracts_on_hash"
    t.index ["position_id"], name: "index_contracts_on_position_id"
  end

  create_table "offers", force: :cascade do |t|
    t.integer "position_id"
    t.integer "instructor_id"
    t.integer "applicant_id"
    t.boolean "objection"
    t.boolean "sent"
    t.boolean "accepted"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applicant_id"], name: "index_offers_on_applicant_id"
    t.index ["instructor_id"], name: "index_offers_on_instructor_id"
    t.index ["position_id"], name: "index_offers_on_position_id"
  end

end
