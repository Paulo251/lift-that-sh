class SessionExerciseSerializer
  def self.render(session_exercise)
    {
      id: session_exercise.id,
      position: session_exercise.position,
      exercise: ExerciseSerializer.render(session_exercise.exercise),
      set_logs: session_exercise.set_logs.map { |s| SetLogSerializer.render(s) }
    }
  end
end
