import client from './client'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types/categoria'

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await client.get<Categoria[]>('/categorias')
  return data
}

export async function getCategoria(id: number): Promise<Categoria> {
  const { data } = await client.get<Categoria>(`/categorias/${id}`)
  return data
}

export async function createCategoria(payload: CategoriaCreate): Promise<Categoria> {
  const { data } = await client.post<Categoria>('/categorias', payload)
  return data
}

export async function updateCategoria(id: number, payload: CategoriaUpdate): Promise<Categoria> {
  const { data } = await client.patch<Categoria>(`/categorias/${id}`, payload)
  return data
}

export async function deleteCategoria(id: number): Promise<void> {
  await client.delete(`/categorias/${id}`)
}
