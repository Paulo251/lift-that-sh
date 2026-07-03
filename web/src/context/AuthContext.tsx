import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { TOKEN_KEY } from '@/services/api'
import * as authService from '@/services/auth'
import type { User } from '@/services/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    authService
      .fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { token, user } = await authService.login(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
  }

  async function register(name: string, email: string, password: string) {
    const { token, user } = await authService.register(name, email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
  }

  function logout() {
    authService.logout().catch(() => {})
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
