# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_07_03_000008) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "exercises", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "primary_muscle_group", null: false
    t.string "secondary_muscle_groups", default: [], null: false, array: true
    t.string "equipment", null: false
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_exercises_on_category"
    t.index ["equipment"], name: "index_exercises_on_equipment"
    t.index ["name"], name: "index_exercises_on_name", unique: true
    t.index ["primary_muscle_group"], name: "index_exercises_on_primary_muscle_group"
  end

  create_table "session_exercises", force: :cascade do |t|
    t.bigint "workout_session_id", null: false
    t.bigint "exercise_id", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_session_exercises_on_exercise_id"
    t.index ["workout_session_id", "position"], name: "index_session_exercises_on_workout_session_id_and_position"
    t.index ["workout_session_id"], name: "index_session_exercises_on_workout_session_id"
  end

  create_table "set_logs", force: :cascade do |t|
    t.bigint "session_exercise_id", null: false
    t.integer "set_number", null: false
    t.decimal "weight", precision: 6, scale: 2, default: "0.0", null: false
    t.integer "reps", default: 0, null: false
    t.string "set_type", default: "normal", null: false
    t.decimal "rpe", precision: 3, scale: 1
    t.boolean "completed", default: true, null: false
    t.integer "rest_seconds"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_exercise_id", "set_number"], name: "index_set_logs_on_session_exercise_id_and_set_number"
    t.index ["session_exercise_id"], name: "index_set_logs_on_session_exercise_id"
    t.index ["set_type"], name: "index_set_logs_on_set_type"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
  end

  create_table "workout_exercises", force: :cascade do |t|
    t.bigint "workout_id", null: false
    t.bigint "exercise_id", null: false
    t.integer "position", null: false
    t.integer "target_sets"
    t.integer "target_reps"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_workout_exercises_on_exercise_id"
    t.index ["workout_id", "position"], name: "index_workout_exercises_on_workout_id_and_position"
    t.index ["workout_id"], name: "index_workout_exercises_on_workout_id"
  end

  create_table "workout_sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "workout_id"
    t.datetime "performed_at", null: false
    t.integer "duration_seconds"
    t.text "notes"
    t.string "status", default: "in_progress", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_workout_sessions_on_status"
    t.index ["user_id", "performed_at"], name: "index_workout_sessions_on_user_id_and_performed_at"
    t.index ["user_id"], name: "index_workout_sessions_on_user_id"
    t.index ["workout_id"], name: "index_workout_sessions_on_workout_id"
  end

  create_table "workouts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.text "description"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_workouts_on_user_id"
  end

  add_foreign_key "session_exercises", "exercises"
  add_foreign_key "session_exercises", "workout_sessions"
  add_foreign_key "set_logs", "session_exercises"
  add_foreign_key "workout_exercises", "exercises"
  add_foreign_key "workout_exercises", "workouts"
  add_foreign_key "workout_sessions", "users"
  add_foreign_key "workout_sessions", "workouts", on_delete: :nullify
  add_foreign_key "workouts", "users"
end
