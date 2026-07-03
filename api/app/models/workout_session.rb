class WorkoutSession < ApplicationRecord
  STATUSES = %w[in_progress completed].freeze

  belongs_to :user
  belongs_to :workout, optional: true

  has_many :session_exercises, -> { order(:position) }, dependent: :destroy
  has_many :set_logs, through: :session_exercises

  validates :performed_at, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :duration_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true

  def total_volume
    session_exercises.flat_map(&:set_logs)
                     .select { |s| s.completed && s.set_type != "warmup" }
                     .sum { |s| s.weight * s.reps }
  end

  def total_sets
    session_exercises.sum { |se| se.set_logs.size }
  end
end
