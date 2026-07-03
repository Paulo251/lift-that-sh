class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :workouts, dependent: :destroy
  has_many :workout_sessions, dependent: :destroy

  validates :name, presence: true
end
