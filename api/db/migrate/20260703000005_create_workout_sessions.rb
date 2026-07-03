class CreateWorkoutSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :workout, null: true, foreign_key: { on_delete: :nullify }
      t.datetime :performed_at, null: false
      t.integer :duration_seconds
      t.text :notes
      t.string :status, null: false, default: "in_progress"

      t.timestamps
    end

    add_index :workout_sessions, [:user_id, :performed_at]
    add_index :workout_sessions, :status
  end
end
