class SetLog < ApplicationRecord
  SET_TYPES = %w[warmup normal drop_set super_set failure rest_pause negative pyramid].freeze

  belongs_to :session_exercise

  validates :set_number, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :weight, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :reps, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :set_type, inclusion: { in: SET_TYPES }
  validates :rpe, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }, allow_nil: true
  validates :rest_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
end
