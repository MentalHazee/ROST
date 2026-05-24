import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

interface Pedido {
  id: number
  usuario_id: number
  direccion_id: number
  forma_pago_id: number
  estado_actual: string
  total: number
  notas: string | null
  created_at: string
}

const SIGUIENTES: Record<string, string[]> = {
  PENDIENTE:  ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['EN_PREP',    'CANCELADO'],
  EN_PREP:    ['EN_CAMINO'],
  EN_CAMINO:  ['ENTREGADO'],
  ENTREGADO:  [],
  CANCELADO:  [],
}

const COLOR_ESTADO: Record<string, string> = {
  PENDIENTE:  'bg-yellow-100 text-yellow-800',
  CONFIRMADO: 'bg-blue-100 text-blue-800',
  EN_PREP:    'bg-orange-100 text-orange-800',
  EN_CAMINO:  'bg-purple-100 text-purple-800',
  ENTREGADO:  'bg-green-100 text-green-800',
  CANCELADO:  'bg-red-100 text-red-800',
}

export default function CajeroPedidosPage() {
  const queryClient = useQueryClient()

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => client.get<Pedido[]>('/api/v1/pedidos').then(r => r.data),
    refetchInterval: 30_000,
  })

  const avanzarMutation = useMutation({
    mutationFn: ({ pedidoId, estado }: { pedidoId: number; estado: string }) =>
      client.patch(`/api/v1/pedidos/${pedidoId}/estado`, { estado, notas: null }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  })

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-lg">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Pedidos</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Actualiza cada 30s
        </span>
      </div>

      <div className="space-y-3">
        {pedidos?.length === 0 && (
          <div className="text-center py-12 text-gray-400">No hay pedidos todavia.</div>
        )}
        {pedidos?.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-[#FFF2E2] p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800 text-lg">#{pedido.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${COLOR_ESTADO[pedido.estado_actual] || 'bg-gray-100 text-gray-600'}`}>
                  {pedido.estado_actual}
                </span>
                <span className="text-gray-500 font-medium">${pedido.total.toFixed(2)}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(pedido.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                {SIGUIENTES[pedido.estado_actual]?.map(siguiente => (
                  <button
                    key={siguiente}
                    onClick={() => avanzarMutation.mutate({ pedidoId: pedido.id, estado: siguiente })}
                    disabled={avanzarMutation.isPending}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 ${
                      siguiente === 'CANCELADO'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {siguiente}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
