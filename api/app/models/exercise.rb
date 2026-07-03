class Exercise < ApplicationRecord
  MUSCLE_GROUPS = %w[chest back legs shoulders biceps triceps core glutes calves forearms].freeze
  EQUIPMENT = %w[barbell dumbbell machine cable bodyweight kettlebell band].freeze
  CATEGORIES = %w[compound isolation].freeze

  has_many :workout_exercises, dependent: :destroy
  has_many :session_exercises, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :primary_muscle_group, inclusion: { in: MUSCLE_GROUPS }
  validates :equipment, inclusion: { in: EQUIPMENT }
  validates :category, inclusion: { in: CATEGORIES }
end
