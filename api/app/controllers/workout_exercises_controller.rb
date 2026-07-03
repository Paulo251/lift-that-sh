class WorkoutExercisesController < ApplicationController
  # Substitui a lista completa de exercícios do treino (adição, remoção e
  # reordenação em uma única chamada). O frontend envia o array já ordenado.
  def sync
    workout = current_user.workouts.find(params[:id])
    items = params[:exercises] || []

    ActiveRecord::Base.transaction do
      workout.workout_exercises.destroy_all
      items.each_with_index do |item, index|
        workout.workout_exercises.create!(
          exercise_id: item[:exercise_id],
          position: index + 1,
          target_sets: item[:target_sets],
          target_reps: item[:target_reps],
          notes: item[:notes]
        )
      end
    end

    render json: WorkoutSerializer.render(workout.reload, detail: true)
  end
end
