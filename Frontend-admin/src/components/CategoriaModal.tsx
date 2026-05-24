import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { createCategoria, updateCategoria, getCategorias } from '../api/categorias'
import type { Categoria, CategoriaCreate } from '../types/categoria'

interface Props {
  categoria: Categoria | null
  onClose: () => void
}

export default function CategoriaModal({ categoria, onClose }: Props) {
  const queryClient = useQueryClient()
  const esEdicion = categoria !== null

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const padresDisponibles = categorias?.filter(
    c => c.id !== categoria?.id
  ) ?? []

  const [form, setForm] = useState<CategoriaCreate>({
    nombre: categoria?.nombre ?? '',
    descripcion: categoria?.descripcion ?? '',
    imagen_url: categoria?.imagen_url ?? '',
    parent_id: categoria?.parent_id ?? undefined,
  })

  const mutation = useMutation({
    mutationFn: esEdicion
      ? (data: CategoriaCreate) => updateCategoria(categoria!.id, data)
      : createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {esEdicion ? 'Editar Categoría' : 'Nueva Categoría'}
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
              placeholder="ej: Bebidas"
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">URL de imagen</label>
            <input
              type="text"
              value={form.imagen_url ?? ''}
              onChange={e => setForm({ ...form, imagen_url: e.target.value })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0 placeholder:text-gray-300"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Categoría padre</label>
            <select
              value={form.parent_id ?? ''}
              onChange={e => setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
            >
              <option value="">— Sin padre —</option>
              {padresDisponibles.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
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
            disabled={mutation.isPending || !form.nombre.trim()}
            className="bg-[#4D6080] text-white px-6 py-2.5 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
