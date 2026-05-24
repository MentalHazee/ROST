import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, Plus, Pencil, Trash2 } from 'lucide-react'
import { getIngredientes, deleteIngrediente } from '../api/ingredientes'
import type { Ingrediente } from '../types/ingrediente'
import IngredienteModal from '../components/IngredienteModal'

export default function IngredientesPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Ingrediente | null>(null)

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  })

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-lg">Cargando...</div>
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ingredientes</h1>
          </div>
        </div>
        <button
          onClick={() => { setEditando(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-[#4D6080] text-white px-6 py-3 rounded-2xl hover:opacity-90 transition font-medium shadow-sm"
        >
          <Plus size={18} />
          Nuevo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFF2E2] text-gray-500 uppercase text-xs tracking-wider">
              <th className="text-left px-6 py-4 font-medium">Nombre</th>
              <th className="text-left px-6 py-4 font-medium">Descripción</th>
              <th className="text-left px-6 py-4 font-medium">Alérgeno</th>
              <th className="px-6 py-4 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFF2E2]">
            {ingredientes?.map(ing => (
              <tr key={ing.id} className="hover:bg-[#FFF8F3] transition">
                <td className="px-6 py-4 font-medium text-gray-800">{ing.nombre}</td>
                <td className="px-6 py-4 text-gray-400">{ing.descripcion ?? '—'}</td>
                <td className="px-6 py-4">
                  {ing.es_alergeno
                    ? <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Sí</span>
                    : <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">No</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { setEditando(ing); setModalOpen(true) }}
                      className="flex items-center gap-1.5 bg-[#FFF2E2] text-[#4D6080] px-4 py-2 rounded-xl hover:opacity-80 transition text-sm font-medium"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(ing.id)}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition text-sm font-medium"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <IngredienteModal
          ingrediente={editando}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
