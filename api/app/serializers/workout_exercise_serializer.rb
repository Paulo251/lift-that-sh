class WorkoutExerciseSerializer
  def self.render(workout_exercise)
    {
      id: workout_exercise.id,
      position: workout_exercise.position,
      target_sets: workout_exercise.target_sets,
      target_reps: workout_exercise.target_reps,
      notes: workout_exercise.notes,
      exercise: ExerciseSerializer.render(workout_exercise.exercise)
    }
  end
end
