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

ActiveRecord::Schema.define(version: 20170909221736) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "allocations", force: :cascade do |t|
    t.integer "num_unit"
    t.string "type"
    t.integer "minutes"
    t.bigint "duty_id"
    t.bigint "ddah_id"
    t.bigint "template_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ddah_id"], name: "index_allocations_on_ddah_id"
    t.index ["duty_id"], name: "index_allocations_on_duty_id"
    t.index ["template_id"], name: "index_allocations_on_template_id"
  end

  create_table "applicants", force: :cascade do |t|
    t.string "utorid", null: false
    t.string "app_id", null: false
    t.string "student_number"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.text "address"
    t.text "commentary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "dept"
    t.integer "yip"
    t.string "program_id"
    t.string "full_time"
    t.index ["utorid"], name: "index_applicants_on_utorid", unique: true
  end

  create_table "applications", force: :cascade do |t|
    t.bigint "applicant_id"
    t.text "ta_training"
    t.string "access_acad_history"
    t.text "ta_experience"
    t.text "academic_qualifications"
    t.text "technical_skills"
    t.text "availability"
    t.text "other_info"
    t.text "special_needs"
    t.text "raw_prefs"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "round_id"
    t.index ["applicant_id"], name: "index_applications_on_applicant_id"
  end

  create_table "assignments", force: :cascade do |t|
    t.bigint "applicant_id"
    t.bigint "position_id"
    t.datetime "export_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "hours"
    t.index ["applicant_id"], name: "index_assignments_on_applicant_id"
    t.index ["position_id"], name: "index_assignments_on_position_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ddahs", force: :cascade do |t|
    t.boolean "optional"
    t.bigint "offer_id"
    t.bigint "template_id"
    t.bigint "instructor_id"
    t.string "tutorial_category", default: "Classroom TA"
    t.string "department", default: "Computer Science"
    t.string "supervisor_signature"
    t.string "ta_coord_signature"
    t.string "student_signature"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "nag_count"
    t.datetime "send_date"
    t.index ["instructor_id"], name: "index_ddahs_on_instructor_id"
    t.index ["offer_id", "id"], name: "index_ddahs_on_offer_id_and_id", unique: true
    t.index ["offer_id"], name: "index_ddahs_on_offer_id"
    t.index ["template_id"], name: "index_ddahs_on_template_id"
  end

  create_table "duties", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "instructors", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "utorid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_instructors_on_email", unique: true
  end

  create_table "instructors_positions", id: false, force: :cascade do |t|
    t.bigint "instructor_id"
    t.bigint "position_id"
    t.index ["instructor_id"], name: "index_instructors_positions_on_instructor_id"
    t.index ["position_id"], name: "index_instructors_positions_on_position_id"
  end

  create_table "offers", force: :cascade do |t|
    t.bigint "position_id"
    t.bigint "applicant_id"
    t.integer "hours", null: false
    t.integer "year"
    t.string "session"
    t.string "status", default: "Unsent"
    t.string "hr_status"
    t.string "ddah_status", default: "None"
    t.text "link"
    t.datetime "print_time"
    t.datetime "send_date"
    t.integer "nag_count", default: 0
    t.string "signature"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "accept_date"
    t.text "commentary"
    t.integer "ddah_nag_count", default: 0
    t.index ["applicant_id"], name: "index_offers_on_applicant_id"
    t.index ["position_id"], name: "index_offers_on_position_id"
  end

  create_table "positions", force: :cascade do |t|
    t.string "position", null: false
    t.integer "round_id", null: false
    t.boolean "open", null: false
    t.integer "campus_code", null: false
    t.text "course_name"
    t.integer "current_enrollment"
    t.text "duties"
    t.text "qualifications"
    t.integer "hours"
    t.integer "estimated_count"
    t.integer "estimated_total_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "session_id"
    t.integer "cap_enrollment"
    t.integer "num_waitlisted"
    t.datetime "start_date"
    t.datetime "end_date"
    t.index ["campus_code"], name: "index_positions_on_campus_code"
    t.index ["open"], name: "index_positions_on_open"
    t.index ["position", "round_id"], name: "index_positions_on_position_and_round_id", unique: true
    t.index ["session_id"], name: "index_positions_on_session_id"
  end

  create_table "preferences", force: :cascade do |t|
    t.bigint "application_id"
    t.bigint "position_id"
    t.integer "rank"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_preferences_on_application_id"
    t.index ["position_id"], name: "index_preferences_on_position_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "year"
    t.string "semester"
    t.float "pay", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "templates", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "optional", default: true
    t.bigint "position_id"
    t.bigint "instructor_id"
    t.string "tutorial_category", default: "Classroom TA"
    t.string "department", default: "Computer Science"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instructor_id"], name: "index_templates_on_instructor_id"
    t.index ["name", "instructor_id", "id"], name: "index_templates_on_name_and_instructor_id_and_id", unique: true
    t.index ["position_id"], name: "index_templates_on_position_id"
  end

  create_table "trainings", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "allocations", "ddahs"
  add_foreign_key "allocations", "duties"
  add_foreign_key "allocations", "templates"
  add_foreign_key "applications", "applicants"
  add_foreign_key "assignments", "applicants"
  add_foreign_key "assignments", "positions"
  add_foreign_key "ddahs", "instructors"
  add_foreign_key "ddahs", "offers"
  add_foreign_key "ddahs", "templates"
  add_foreign_key "positions", "sessions"
  add_foreign_key "preferences", "applications"
  add_foreign_key "preferences", "positions"
  add_foreign_key "templates", "instructors"
  add_foreign_key "templates", "positions"
end
