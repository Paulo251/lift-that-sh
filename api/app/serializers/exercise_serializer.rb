class ExerciseSerializer
  def self.render(exercise)
    {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      primary_muscle_group: exercise.primary_muscle_group,
      secondary_muscle_groups: exercise.secondary_muscle_groups,
      equipment: exercise.equipment,
      category: exercise.category
    }
  end
end
