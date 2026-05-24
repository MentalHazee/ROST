import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: Props) {
  const { usuario, isLoading } = useAuth()

  if (isLoading) return <div className="p-4 text-center text-gray-400">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.some(r => usuario.roles?.some(ur => ur.rol_codigo === r))) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
