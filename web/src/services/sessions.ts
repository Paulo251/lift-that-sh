import { api } from './api'
import type { SessionExercise, SetLog, SetLogInput, WorkoutSession } from './types'

export async function fetchSessions() {
  const { data } = await api.get<WorkoutSession[]>('/sessions')
  return data
}

export async function fetchSession(id: number) {
  const { data } = await api.get<WorkoutSession>(`/sessions/${id}`)
  return data
}

export async function startSession(workoutId?: number) {
  const { data } = await api.post<WorkoutSession>('/sessions', workoutId ? { workout_id: workoutId } : {})
  return data
}

export async function updateSession(
  id: number,
  input: { status?: string; duration_seconds?: number; notes?: string },
) {
  const { data } = await api.patch<WorkoutSession>(`/sessions/${id}`, input)
  return data
}

export async function addSessionExercise(sessionId: number, exerciseId: number) {
  const { data } = await api.post<SessionExercise>(`/sessions/${sessionId}/exercises`, {
    exercise_id: exerciseId,
  })
  return data
}

export async function createSetLog(sessionId: number, input: SetLogInput) {
  const { data } = await api.post<SetLog>(`/sessions/${sessionId}/set_logs`, input)
  return data
}

export async function updateSetLog(id: number, input: Partial<SetLogInput>) {
  const { data } = await api.patch<SetLog>(`/set_logs/${id}`, input)
  return data
}

export async function deleteSetLog(id: number) {
  await api.delete(`/set_logs/${id}`)
}
