class WorkoutsController < ApplicationController
  def index
    workouts = current_user.workouts.includes(workout_exercises: :exercise).order(created_at: :desc)
    render json: workouts.map { |w| WorkoutSerializer.render(w) }
  end

  def show
    render json: WorkoutSerializer.render(find_workout, detail: true)
  end

  def create
    workout = current_user.workouts.create!(workout_params)
    render json: WorkoutSerializer.render(workout, detail: true), status: :created
  end

  def update
    workout = find_workout
    workout.update!(workout_params)
    render json: WorkoutSerializer.render(workout, detail: true)
  end

  def destroy
    find_workout.destroy!
    head :no_content
  end

  private

  def find_workout
    current_user.workouts.find(params[:id])
  end

  def workout_params
    params.permit(:name, :description, :notes)
  end
end
