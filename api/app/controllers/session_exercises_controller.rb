class SessionExercisesController < ApplicationController
  # Adiciona um exercício a uma sessão em andamento (sessões vazias ou extras).
  def create
    session = current_user.workout_sessions.find(params[:id])
    position = session.session_exercises.maximum(:position).to_i + 1

    session_exercise = session.session_exercises.create!(
      exercise_id: params[:exercise_id],
      position: position
    )

    render json: SessionExerciseSerializer.render(session_exercise), status: :created
  end
end
