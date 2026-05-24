import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Coffee, ShoppingBag, Package, Plus, X, Star } from 'lucide-react'
import { getProducto, addCategoriaAProducto, removeCategoriaDeProducto, addIngredienteAProducto, removeIngredienteDeProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'
import { getIngredientes } from '../api/ingredientes'
import { getUnidadesMedida } from '../api/unidades_medida'

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const productoId = Number(id)

  const [catId, setCatId] = useState('')
  const [esPrincipal, setEsPrincipal] = useState(false)
  const [ingId, setIngId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [unidadId, setUnidadId] = useState('')
  const [esRemovible, setEsRemovible] = useState(false)

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['productos', id],
    queryFn: () => getProducto(productoId),
    enabled: !!id,
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const { data: ingredientes } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })

  const { data: unidades } = useQuery({
    queryKey: ['unidades-medida'],
    queryFn: getUnidadesMedida,
  })

  const addCatMutation = useMutation({
    mutationFn: () => addCategoriaAProducto(productoId, { categoria_id: Number(catId), es_principal: esPrincipal }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', id] })
      setCatId('')
      setEsPrincipal(false)
    },
  })

  const removeCatMutation = useMutation({
    mutationFn: (categoriaId: number) => removeCategoriaDeProducto(productoId, categoriaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos', id] }),
  })

  const addIngMutation = useMutation({
    mutationFn: () => addIngredienteAProducto(productoId, {
      ingrediente_id: Number(ingId),
      cantidad: Number(cantidad),
      unidad_medida_id: Number(unidadId),
      es_removible: esRemovible,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', id] })
      setIngId('')
      setCantidad('')
      setUnidadId('')
      setEsRemovible(false)
    },
  })

  const removeIngMutation = useMutation({
    mutationFn: (ingredienteId: number) => removeIngredienteDeProducto(productoId, ingredienteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos', id] }),
  })

  const categoriasDisponibles = categorias?.filter(
    c => !producto?.categoria_links.some(l => l.categoria_id === c.id)
  ) ?? []

  const ingredientesDisponibles = ingredientes?.filter(
    i => !producto?.ingrediente_links.some(l => l.ingrediente_id === i.id)
  ) ?? []

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-lg">Cargando...</div>
  if (isError || !producto) return (
    <div className="p-8 text-center text-red-500">Producto no encontrado.</div>
  )

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-[#4D6080] transition text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#FFF2E2] rounded-2xl p-4 shrink-0">
            <Coffee size={32} className="text-[#4D6080]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{producto.nombre}</h1>
            <p className="text-gray-400 mb-4">{producto.descripcion ?? 'Sin descripción'}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[#4D6080]">${producto.precio_base.toFixed(2)}</span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                producto.disponible ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {producto.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag size={20} className="text-[#4D6080]" />
          <h2 className="text-lg font-semibold text-gray-700">Categorías</h2>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {producto.categoria_links.map(link => (
            <div
              key={link.categoria_id}
              className="flex items-center gap-1.5 bg-[#FFF2E2] text-[#4D6080] px-4 py-2 rounded-xl text-sm font-medium"
            >
              <span>{link.categoria?.nombre ?? `ID ${link.categoria_id}`}</span>
              {link.es_principal && <Star size={12} className="fill-current" />}
              <button
                onClick={() => removeCatMutation.mutate(link.categoria_id)}
                className="ml-1 text-gray-400 hover:text-red-500 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {producto.categoria_links.length === 0 && (
            <span className="text-gray-300 text-sm">Sin categorías asignadas</span>
          )}
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Agregar categoría</label>
            <select
              value={catId}
              onChange={e => setCatId(e.target.value)}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
            >
              <option value="">— Seleccionar —</option>
              {categoriasDisponibles.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 pb-2">
            <input
              id="esPrincipal"
              type="checkbox"
              checked={esPrincipal}
              onChange={e => setEsPrincipal(e.target.checked)}
              className="w-4 h-4 text-[#4D6080] rounded accent-[#4D6080]"
            />
            <label htmlFor="esPrincipal" className="text-xs text-gray-500">Principal</label>
          </div>
          <button
            onClick={() => addCatMutation.mutate()}
            disabled={!catId || addCatMutation.isPending}
            className="flex items-center gap-1.5 bg-[#4D6080] text-white px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Plus size={16} />
            {addCatMutation.isPending ? '...' : 'Agregar'}
          </button>
        </div>
        {addCatMutation.isError && (
          <p className="text-red-500 text-xs mt-2">Error al agregar categoría</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <Package size={20} className="text-[#4D6080]" />
          <h2 className="text-lg font-semibold text-gray-700">Ingredientes</h2>
        </div>

        <ul className="space-y-3 mb-6">
          {producto.ingrediente_links.map(link => (
            <li key={link.ingrediente_id} className="flex items-center gap-3 bg-[#FFF8F3] rounded-xl px-4 py-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#4D6080] shrink-0" />
              <span className="font-medium text-gray-700">{link.ingrediente?.nombre ?? `ID ${link.ingrediente_id}`}</span>
              <span className="text-gray-400">— {link.cantidad}</span>
              {link.unidad_medida && (
                <span className="text-gray-400">{link.unidad_medida.simbolo}</span>
              )}
              {link.es_removible && (
                <span className="bg-yellow-50 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-medium">removible</span>
              )}
              <button
                onClick={() => removeIngMutation.mutate(link.ingrediente_id)}
                className="ml-auto text-gray-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            </li>
          ))}
          {producto.ingrediente_links.length === 0 && (
            <span className="text-gray-300 text-sm">Sin ingredientes asignados</span>
          )}
        </ul>

        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Ingrediente</label>
            <select
              value={ingId}
              onChange={e => setIngId(e.target.value)}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
            >
              <option value="">— Seleccionar —</option>
              {ingredientesDisponibles.map(i => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Cantidad</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
              placeholder="ej: 0.5"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Unidad</label>
            <select
              value={unidadId}
              onChange={e => setUnidadId(e.target.value)}
              className="w-full bg-[#FFF2E2] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4D6080] focus:outline-none border-0"
            >
              <option value="">— Seleccionar —</option>
              {unidades?.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1.5 pb-1">
              <div className="flex items-center gap-1.5">
                <input
                  id="esRemovible"
                  type="checkbox"
                  checked={esRemovible}
                  onChange={e => setEsRemovible(e.target.checked)}
                  className="w-4 h-4 text-[#4D6080] rounded accent-[#4D6080]"
                />
                <label htmlFor="esRemovible" className="text-xs text-gray-500">Removible</label>
              </div>
              <button
                onClick={() => addIngMutation.mutate()}
                disabled={!ingId || !cantidad || !unidadId || addIngMutation.isPending}
                className="flex items-center gap-1.5 bg-[#4D6080] text-white px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                <Plus size={16} />
                {addIngMutation.isPending ? '...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
        {addIngMutation.isError && (
          <p className="text-red-500 text-xs mt-2">Error al agregar ingrediente</p>
        )}
      </div>
    </div>
  )
}
