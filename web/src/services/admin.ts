import { api } from './api'
import type { Category, Equipment, Exercise, MuscleGroup, User } from './types'

export interface AdminUser extends User {
  created_at: string
}

export interface AdminUserInput {
  name: string
  email: string
  password?: string
  admin: boolean
}

export interface AdminExercise extends Exercise {
  workouts_count: number
}

export interface AdminExerciseInput {
  name: string
  description?: string
  primary_muscle_group: MuscleGroup
  equipment: Equipment
  category: Category
  secondary_muscle_groups: string[]
}

export async function fetchAdminUsers() {
  const { data } = await api.get<AdminUser[]>('/admin/users')
  return data
}

export async function createAdminUser(input: AdminUserInput) {
  const { data } = await api.post<AdminUser>('/admin/users', input)
  return data
}

export async function updateAdminUser(id: number, input: AdminUserInput) {
  const { data } = await api.patch<AdminUser>(`/admin/users/${id}`, input)
  return data
}

export async function deleteAdminUser(id: number) {
  await api.delete(`/admin/users/${id}`)
}

export async function fetchAdminExercises() {
  const { data } = await api.get<AdminExercise[]>('/admin/exercises')
  return data
}

export async function createAdminExercise(input: AdminExerciseInput) {
  const { data } = await api.post<AdminExercise>('/admin/exercises', input)
  return data
}

export async function updateAdminExercise(id: number, input: AdminExerciseInput) {
  const { data } = await api.patch<AdminExercise>(`/admin/exercises/${id}`, input)
  return data
}

export async function deleteAdminExercise(id: number) {
  await api.delete(`/admin/exercises/${id}`)
}
