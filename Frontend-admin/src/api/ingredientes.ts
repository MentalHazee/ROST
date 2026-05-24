import client from './client'
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types/ingrediente'

export async function getIngredientes(): Promise<Ingrediente[]> {
  const { data } = await client.get<Ingrediente[]>('/ingredientes')
  return data
}

export async function getIngrediente(id: number): Promise<Ingrediente> {
  const { data } = await client.get<Ingrediente>(`/ingredientes/${id}`)
  return data
}

export async function createIngrediente(payload: IngredienteCreate): Promise<Ingrediente> {
  const { data } = await client.post<Ingrediente>('/ingredientes', payload)
  return data
}

export async function updateIngrediente(id: number, payload: IngredienteUpdate): Promise<Ingrediente> {
  const { data } = await client.patch<Ingrediente>(`/ingredientes/${id}`, payload)
  return data
}

export async function deleteIngrediente(id: number): Promise<void> {
  await client.delete(`/ingredientes/${id}`)
}
