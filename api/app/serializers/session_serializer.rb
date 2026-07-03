class SessionSerializer
  def self.render(session, detail: false)
    base = {
      id: session.id,
      workout_id: session.workout_id,
      workout_name: session.workout&.name,
      performed_at: session.performed_at,
      duration_seconds: session.duration_seconds,
      status: session.status,
      notes: session.notes,
      total_volume: session.total_volume.to_f,
      total_sets: session.total_sets,
      exercises_count: session.session_exercises.size
    }

    if detail
      base[:session_exercises] = session.session_exercises.map do |se|
        SessionExerciseSerializer.render(se)
      end
    end

    base
  end
end
