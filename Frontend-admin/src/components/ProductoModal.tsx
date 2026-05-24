import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { createProducto, updateProducto } from '../api/productos'
import { getUnidadesMedida } from '../api/unidades_medida'
import type { Producto, ProductoCreate } from '../types/producto'

interface Props {
  producto: Producto | null
  onClose: () => void
}

export default function ProductoModal({ producto, onClose }: Props) {
  const queryClient = useQueryClient()
  const esEdicion = producto !== null

  const { data: unidades } = useQuery({
    queryKey: ['unidades-medida'],
    queryFn: getUnidadesMedida,
  })

  const [form, setForm] = useState<ProductoCreate>({
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio_base: producto?.precio_base ?? 0,
    imagenes_url: producto?.imagenes_url ?? '',
    stock_cantidad: producto?.stock_cantidad ?? 0,
    disponible: producto?.disponible ?? true,
    unidad_venta_id: producto?.unidad_venta_id ?? undefined,
  })

  const mutation = useMutation({
    mutationFn: esEdicion
      ? (data: ProductoCreate) => updateProducto(producto!.id, data)
      : createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0 placeholder:text-gray-300"
              placeholder="ej: Hamburguesa Clásica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Descripción</label>
            <textarea
              value={form.descripcion ?? ''}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0 placeholder:text-gray-300 resize-none"
              rows={3}
              placeholder="Descripción opcional..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Precio base <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.precio_base}
                onChange={e => setForm({ ...form, precio_base: Number(e.target.value) })}
                className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock_cantidad}
                onChange={e => setForm({ ...form, stock_cantidad: Number(e.target.value) })}
                className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Unidad de venta</label>
            <select
              value={form.unidad_venta_id ?? ''}
              onChange={e => setForm({ ...form, unidad_venta_id: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
            >
              <option value="">— Sin unidad —</option>
              {unidades?.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">URL de imagen</label>
            <input
              type="text"
              value={form.imagenes_url ?? ''}
              onChange={e => setForm({ ...form, imagenes_url: e.target.value })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0 placeholder:text-gray-300"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={e => setForm({ ...form, disponible: e.target.checked })}
              className="w-4 h-4 text-[#4D6080] rounded accent-[#4D6080]"
            />
            <span className="text-sm text-gray-700">Disponible</span>
          </label>
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm mt-4 bg-red-50 px-4 py-2.5 rounded-xl">
            Ocurrió un error. Verificá los datos ingresados.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-gray-400 hover:text-gray-600 font-medium rounded-xl hover:bg-[#FFF2E2] transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.nombre.trim() || form.precio_base <= 0}
            className="bg-[#4D6080] text-white px-6 py-2.5 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
