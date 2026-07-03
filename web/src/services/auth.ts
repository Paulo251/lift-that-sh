import { api } from './api'
import type { AuthResponse, User } from './types'

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    user: { name, email, password },
  })
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    user: { email, password },
  })
  return data
}

export async function logout() {
  await api.delete('/auth/logout')
}

export async function fetchMe() {
  const { data } = await api.get<User>('/me')
  return data
}
