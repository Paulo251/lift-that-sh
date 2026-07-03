class CreateSetLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :set_logs do |t|
      t.references :session_exercise, null: false, foreign_key: true
      t.integer :set_number, null: false
      t.decimal :weight, precision: 6, scale: 2, null: false, default: 0
      t.integer :reps, null: false, default: 0
      t.string :set_type, null: false, default: "normal"
      t.decimal :rpe, precision: 3, scale: 1
      t.boolean :completed, null: false, default: true
      t.integer :rest_seconds

      t.timestamps
    end

    add_index :set_logs, [:session_exercise_id, :set_number]
    add_index :set_logs, :set_type
  end
end
