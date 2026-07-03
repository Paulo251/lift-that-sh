class WorkoutSessionsController < ApplicationController
  def index
    sessions = current_user.workout_sessions
                           .includes(:workout, session_exercises: :set_logs)
                           .order(performed_at: :desc)
    render json: sessions.map { |s| SessionSerializer.render(s) }
  end

  def show
    render json: SessionSerializer.render(find_session, detail: true)
  end

  # Inicia uma sessão. Se workout_id for enviado, copia os exercícios do treino.
  def create
    session = current_user.workout_sessions.new(
      workout_id: params[:workout_id],
      performed_at: Time.current,
      status: "in_progress",
      notes: params[:notes]
    )

    ActiveRecord::Base.transaction do
      session.save!
      session.workout&.workout_exercises&.each_with_index do |we, index|
        session.session_exercises.create!(exercise_id: we.exercise_id, position: index + 1)
      end
    end

    render json: SessionSerializer.render(session.reload, detail: true), status: :created
  end

  # Finaliza (status/duration) ou atualiza notas.
  def update
    session = find_session
    attrs = params.permit(:status, :duration_seconds, :notes)

    if attrs[:status] == "completed" && attrs[:duration_seconds].blank? && session.duration_seconds.blank?
      attrs[:duration_seconds] = (Time.current - session.performed_at).to_i
    end

    session.update!(attrs)
    render json: SessionSerializer.render(session, detail: true)
  end

  private

  def find_session
    current_user.workout_sessions
                .includes(session_exercises: [:exercise, :set_logs])
                .find(params[:id])
  end
end
