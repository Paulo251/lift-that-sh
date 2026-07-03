class CreateSessionExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :session_exercises do |t|
      t.references :workout_session, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :position, null: false

      t.timestamps
    end

    add_index :session_exercises, [:workout_session_id, :position]
  end
end
