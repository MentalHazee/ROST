import client from './client'
import type { Producto, ProductoDetalle, ProductoCreate, ProductoUpdate, ProductoCategoriaLinkCreate, ProductoIngredienteLinkCreate, ProductoCategoriaLink, ProductoIngredienteLink } from '../types/producto'

export async function getProductos(): Promise<Producto[]> {
  const { data } = await client.get<Producto[]>('/productos')
  return data
}

export async function getProducto(id: number): Promise<ProductoDetalle> {
  const { data } = await client.get<ProductoDetalle>(`/productos/${id}`)
  return data
}

export async function createProducto(payload: ProductoCreate): Promise<Producto> {
  const { data } = await client.post<Producto>('/productos', payload)
  return data
}

export async function updateProducto(id: number, payload: ProductoUpdate): Promise<Producto> {
  const { data } = await client.patch<Producto>(`/productos/${id}`, payload)
  return data
}

export async function deleteProducto(id: number): Promise<void> {
  await client.delete(`/productos/${id}`)
}

export async function addCategoriaAProducto(productoId: number, payload: ProductoCategoriaLinkCreate): Promise<ProductoCategoriaLink> {
  const { data } = await client.post<ProductoCategoriaLink>(`/productos/${productoId}/categorias`, payload)
  return data
}

export async function removeCategoriaDeProducto(productoId: number, categoriaId: number): Promise<void> {
  await client.delete(`/productos/${productoId}/categorias/${categoriaId}`)
}

export async function addIngredienteAProducto(productoId: number, payload: ProductoIngredienteLinkCreate): Promise<ProductoIngredienteLink> {
  const { data } = await client.post<ProductoIngredienteLink>(`/productos/${productoId}/ingredientes`, payload)
  return data
}

export async function removeIngredienteDeProducto(productoId: number, ingredienteId: number): Promise<void> {
  await client.delete(`/productos/${productoId}/ingredientes/${ingredienteId}`)
}
