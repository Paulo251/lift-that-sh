class SetLogsController < ApplicationController
  def create
    session = current_user.workout_sessions.find(params[:id])
    session_exercise = session.session_exercises.find(params[:session_exercise_id])

    attrs = set_log_params
    attrs[:set_number] ||= session_exercise.set_logs.maximum(:set_number).to_i + 1

    set_log = session_exercise.set_logs.create!(attrs)
    render json: SetLogSerializer.render(set_log), status: :created
  end

  def update
    set_log = find_set_log
    set_log.update!(set_log_params)
    render json: SetLogSerializer.render(set_log)
  end

  def destroy
    find_set_log.destroy!
    head :no_content
  end

  private

  def find_set_log
    SetLog.joins(session_exercise: :workout_session)
          .where(workout_sessions: { user_id: current_user.id })
          .find(params[:id])
  end

  def set_log_params
    params.permit(:set_number, :weight, :reps, :set_type, :rpe, :completed, :rest_seconds)
  end
end
