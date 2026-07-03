class Workout < ApplicationRecord
  belongs_to :user

  has_many :workout_exercises, -> { order(:position) }, dependent: :destroy
  has_many :exercises, through: :workout_exercises
  has_many :workout_sessions, dependent: :nullify

  validates :name, presence: true
end
