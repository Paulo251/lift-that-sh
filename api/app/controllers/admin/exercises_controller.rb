class Admin::ExercisesController < Admin::BaseController
  def index
    usage = WorkoutExercise.group(:exercise_id).count
    exercises = Exercise.order(:name)
    render json: exercises.map { |e|
      ExerciseSerializer.render(e).merge(workouts_count: usage.fetch(e.id, 0))
    }
  end

  def create
    exercise = Exercise.new(exercise_params)
    exercise.save!
    render json: ExerciseSerializer.render(exercise), status: :created
  end

  def update
    exercise = Exercise.find(params[:id])
    exercise.update!(exercise_params)
    render json: ExerciseSerializer.render(exercise)
  end

  # Remove o exercício do catálogo. Treinos que o usavam são mantidos:
  # apenas o vínculo (WorkoutExercise) é removido junto.
  def destroy
    Exercise.find(params[:id]).destroy!
    head :no_content
  end

  private

  def exercise_params
    params.permit(:name, :description, :primary_muscle_group, :equipment, :category,
                  secondary_muscle_groups: [])
  end
end
