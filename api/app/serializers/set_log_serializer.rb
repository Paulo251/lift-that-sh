class SetLogSerializer
  def self.render(set_log)
    {
      id: set_log.id,
      session_exercise_id: set_log.session_exercise_id,
      set_number: set_log.set_number,
      weight: set_log.weight.to_f,
      reps: set_log.reps,
      set_type: set_log.set_type,
      rpe: set_log.rpe&.to_f,
      completed: set_log.completed,
      rest_seconds: set_log.rest_seconds
    }
  end
end
