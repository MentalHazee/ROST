import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, Plus, Pencil, Trash2 } from 'lucide-react'
import { getCategorias, deleteCategoria } from '../api/categorias'
import type { Categoria } from '../types/categoria'
import CategoriaModal from '../components/CategoriaModal'

export default function CategoriasPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  })

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-lg">Cargando...</div>
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
          </div>
        </div>
        <button
          onClick={() => { setEditando(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-[#4D6080] text-white px-6 py-3 rounded-2xl hover:opacity-90 transition font-medium shadow-sm"
        >
          <Plus size={18} />
          Nueva
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFF2E2] text-gray-500 uppercase text-xs tracking-wider">
              <th className="text-left px-6 py-4 font-medium">Nombre</th>
              <th className="text-left px-6 py-4 font-medium">Descripción</th>
              <th className="text-left px-6 py-4 font-medium">Categoría Padre</th>
              <th className="px-6 py-4 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFF2E2]">
            {categorias?.map(cat => (
              <tr key={cat.id} className="hover:bg-[#FFF8F3] transition">
                <td className="px-6 py-4 font-medium text-gray-800">{cat.nombre}</td>
                <td className="px-6 py-4 text-gray-400">{cat.descripcion ?? '—'}</td>
                <td className="px-6 py-4 text-gray-400">{cat.parent_id ?? '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { setEditando(cat); setModalOpen(true) }}
                      className="flex items-center gap-1.5 bg-[#FFF2E2] text-[#4D6080] px-4 py-2 rounded-xl hover:opacity-80 transition text-sm font-medium"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(cat.id)}
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
        <CategoriaModal
          categoria={editando}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
