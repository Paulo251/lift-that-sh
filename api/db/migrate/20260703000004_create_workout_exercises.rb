class CreateWorkoutExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_exercises do |t|
      t.references :workout, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :position, null: false
      t.integer :target_sets
      t.integer :target_reps
      t.text :notes

      t.timestamps
    end

    add_index :workout_exercises, [:workout_id, :position]
  end
end
