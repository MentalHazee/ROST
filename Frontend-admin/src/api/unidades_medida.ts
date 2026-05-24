import client from './client'
import type { UnidadMedida, UnidadMedidaCreate, UnidadMedidaUpdate } from '../types/unidad_medida'

export async function getUnidadesMedida(): Promise<UnidadMedida[]> {
  const { data } = await client.get<UnidadMedida[]>('/unidades-medida')
  return data
}

export async function getUnidadMedida(id: number): Promise<UnidadMedida> {
  const { data } = await client.get<UnidadMedida>(`/unidades-medida/${id}`)
  return data
}

export async function createUnidadMedida(payload: UnidadMedidaCreate): Promise<UnidadMedida> {
  const { data } = await client.post<UnidadMedida>('/unidades-medida', payload)
  return data
}

export async function updateUnidadMedida(id: number, payload: UnidadMedidaUpdate): Promise<UnidadMedida> {
  const { data } = await client.patch<UnidadMedida>(`/unidades-medida/${id}`, payload)
  return data
}

export async function deleteUnidadMedida(id: number): Promise<void> {
  await client.delete(`/unidades-medida/${id}`)
}
