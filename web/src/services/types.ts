export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'glutes'
  | 'calves'
  | 'forearms'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'band'

export type Category = 'compound' | 'isolation'

export type SetType =
  | 'warmup'
  | 'normal'
  | 'drop_set'
  | 'super_set'
  | 'failure'
  | 'rest_pause'
  | 'negative'
  | 'pyramid'

export type SessionStatus = 'in_progress' | 'completed'

export interface User {
  id: number
  name: string
  email: string
  admin: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Exercise {
  id: number
  name: string
  description: string | null
  primary_muscle_group: MuscleGroup
  secondary_muscle_groups: string[]
  equipment: Equipment
  category: Category
}

export interface ExerciseFilters {
  muscle_group?: string
  equipment?: string
  category?: string
  q?: string
}

export interface WorkoutExercise {
  id: number
  position: number
  target_sets: number | null
  target_reps: number | null
  notes: string | null
  exercise: Exercise
}

export interface Workout {
  id: number
  name: string
  description: string | null
  notes: string | null
  exercises_count: number
  created_at: string
  workout_exercises?: WorkoutExercise[]
}

export interface WorkoutExerciseInput {
  exercise_id: number
  target_sets?: number | null
  target_reps?: number | null
  notes?: string | null
}

export interface SetLog {
  id: number
  session_exercise_id: number
  set_number: number
  weight: number
  reps: number
  set_type: SetType
  rpe: number | null
  completed: boolean
  rest_seconds: number | null
}

export interface SetLogInput {
  session_exercise_id: number
  weight: number
  reps: number
  set_type: SetType
  rpe?: number | null
  completed?: boolean
  rest_seconds?: number | null
}

export interface SessionExercise {
  id: number
  position: number
  exercise: Exercise
  set_logs: SetLog[]
}

export interface WorkoutSession {
  id: number
  workout_id: number | null
  workout_name: string | null
  performed_at: string
  duration_seconds: number | null
  status: SessionStatus
  notes: string | null
  total_volume: number
  total_sets: number
  exercises_count: number
  session_exercises?: SessionExercise[]
}

export interface ProgressPoint {
  date: string
  max_weight: number
  total_volume: number
}

export interface ExerciseProgress {
  exercise: Exercise
  points: ProgressPoint[]
}
