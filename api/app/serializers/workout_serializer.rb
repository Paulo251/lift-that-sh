class WorkoutSerializer
  def self.render(workout, detail: false)
    base = {
      id: workout.id,
      name: workout.name,
      description: workout.description,
      notes: workout.notes,
      exercises_count: workout.workout_exercises.size,
      created_at: workout.created_at
    }

    if detail
      base[:workout_exercises] = workout.workout_exercises.map do |we|
        WorkoutExerciseSerializer.render(we)
      end
    end

    base
  end
end
