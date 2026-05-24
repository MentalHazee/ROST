import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UtensilsCrossed } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => navigate('/'),
  })

  return (
    <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#4D6080] p-4 rounded-2xl mb-4">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ROST</h1>
          <p className="text-sm text-gray-400 mt-1">Panel de administracion</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D6080] focus:border-transparent bg-[#FFF8F3]"
              placeholder="admin@store.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D6080] focus:border-transparent bg-[#FFF8F3]"
              placeholder="••••••••"
            />
          </div>
        </div>

        {loginMutation.isError && (
          <p className="text-red-500 text-sm mt-4 bg-red-50 px-3 py-2 rounded-xl">
            Credenciales incorrectas
          </p>
        )}

        <button
          onClick={() => loginMutation.mutate()}
          disabled={loginMutation.isPending || !email || !password}
          className="w-full mt-6 bg-[#4D6080] text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  )
}
