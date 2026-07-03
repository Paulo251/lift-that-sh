import { api } from './api'
import type { Workout, WorkoutExerciseInput } from './types'

export interface WorkoutInput {
  name: string
  description?: string
  notes?: string
}

export async function fetchWorkouts() {
  const { data } = await api.get<Workout[]>('/workouts')
  return data
}

export async function fetchWorkout(id: number) {
  const { data } = await api.get<Workout>(`/workouts/${id}`)
  return data
}

export async function createWorkout(input: WorkoutInput) {
  const { data } = await api.post<Workout>('/workouts', input)
  return data
}

export async function updateWorkout(id: number, input: Partial<WorkoutInput>) {
  const { data } = await api.patch<Workout>(`/workouts/${id}`, input)
  return data
}

export async function deleteWorkout(id: number) {
  await api.delete(`/workouts/${id}`)
}

export async function syncWorkoutExercises(id: number, exercises: WorkoutExerciseInput[]) {
  const { data } = await api.post<Workout>(`/workouts/${id}/exercises`, { exercises })
  return data
}
