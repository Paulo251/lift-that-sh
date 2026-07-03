class CreateExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :exercises do |t|
      t.string :name, null: false
      t.text :description
      t.string :primary_muscle_group, null: false
      t.string :secondary_muscle_groups, array: true, default: [], null: false
      t.string :equipment, null: false
      t.string :category, null: false

      t.timestamps
    end

    add_index :exercises, :name, unique: true
    add_index :exercises, :primary_muscle_group
    add_index :exercises, :equipment
    add_index :exercises, :category
  end
end
