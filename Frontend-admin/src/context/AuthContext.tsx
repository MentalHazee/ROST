import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import client from '../api/client'
import type { Usuario } from '../types/usuario'

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (rol: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    client.get('/api/v1/auth/me')
      .then(res => setUsuario(res.data))
      .catch(() => setUsuario(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    await client.post('/api/v1/auth/login', { email, password })
    const { data } = await client.get('/api/v1/auth/me')
    setUsuario(data)
  }

  const logout = async () => {
    await client.post('/api/v1/auth/logout')
    setUsuario(null)
  }

  const hasRole = (rol: string) =>
    usuario?.roles?.some(ur => ur.rol_codigo === rol) ?? false

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
