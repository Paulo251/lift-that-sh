import axios from 'axios'

export const TOKEN_KEY = 'lift-that-sh:token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth')
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; errors?: string[] } | undefined
    if (data?.error) return data.error
    if (data?.errors?.length) return data.errors.join(', ')
  }
  return fallback
}
