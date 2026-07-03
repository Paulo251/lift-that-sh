import { api } from './api'
import type { Exercise, ExerciseFilters, ExerciseProgress } from './types'

export async function fetchExercises(filters: ExerciseFilters = {}) {
  const { data } = await api.get<Exercise[]>('/exercises', { params: filters })
  return data
}

export async function fetchExerciseProgress(exerciseId: number) {
  const { data } = await api.get<ExerciseProgress>(`/exercises/${exerciseId}/progress`)
  return data
}
