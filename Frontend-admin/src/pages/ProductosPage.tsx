import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Coffee, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { getProductos, deleteProducto } from '../api/productos'
import type { Producto } from '../types/producto'
import ProductoModal from '../components/ProductoModal'

export default function ProductosPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-lg">Cargando...</div>
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
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
              <th className="text-right px-6 py-4 font-medium">Precio</th>
              <th className="text-right px-6 py-4 font-medium">Stock</th>
              <th className="text-center px-6 py-4 font-medium">Disponible</th>
              <th className="px-6 py-4 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFF2E2]">
            {productos?.map(p => (
              <tr key={p.id} className="hover:bg-[#FFF8F3] transition">
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/productos/${p.id}`)}
                    className="font-medium text-[#4D6080] hover:underline text-left"
                  >
                    {p.nombre}
                  </button>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  ${p.precio_base.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-400">{p.stock_cantidad}</td>
                <td className="px-6 py-4 text-center">
                  {p.disponible
                    ? <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Sí</span>
                    : <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">No</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/productos/${p.id}`)}
                      className="flex items-center gap-1.5 bg-[#FFF2E2] text-[#4D6080] px-3 py-2 rounded-xl hover:opacity-80 transition text-sm font-medium"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                    <button
                      onClick={() => { setEditando(p); setModalOpen(true) }}
                      className="flex items-center gap-1.5 text-[#4D6080] px-3 py-2 rounded-xl hover:bg-[#FFF2E2] transition text-sm font-medium"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(p.id)}
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
        <ProductoModal
          producto={editando}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
