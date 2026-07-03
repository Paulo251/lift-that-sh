class SessionExercise < ApplicationRecord
  belongs_to :workout_session
  belongs_to :exercise

  has_many :set_logs, -> { order(:set_number, :id) }, dependent: :destroy

  validates :position, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
