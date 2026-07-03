class ExercisesController < ApplicationController
  def index
    exercises = Exercise.order(:name)
    exercises = exercises.where(primary_muscle_group: params[:muscle_group]) if params[:muscle_group].present?
    exercises = exercises.where(equipment: params[:equipment]) if params[:equipment].present?
    exercises = exercises.where(category: params[:category]) if params[:category].present?
    exercises = exercises.where("exercises.name ILIKE ?", "%#{Exercise.sanitize_sql_like(params[:q])}%") if params[:q].present?

    render json: exercises.map { |e| ExerciseSerializer.render(e) }
  end

  def show
    render json: ExerciseSerializer.render(Exercise.find(params[:id]))
  end

  def progress
    exercise = Exercise.find(params[:id])

    logs = SetLog.joins(session_exercise: :workout_session)
                 .where(completed: true)
                 .where.not(set_type: "warmup")
                 .where(session_exercises: { exercise_id: exercise.id },
                        workout_sessions: { user_id: current_user.id })
                 .includes(session_exercise: :workout_session)

    points = logs.group_by { |log| log.session_exercise.workout_session.performed_at.to_date }
                 .sort_by { |date, _| date }
                 .map do |date, sets|
      {
        date: date.iso8601,
        max_weight: sets.map(&:weight).max.to_f,
        total_volume: sets.sum { |s| s.weight * s.reps }.to_f
      }
    end

    render json: { exercise: ExerciseSerializer.render(exercise), points: points }
  end
end
