import type { Ingrediente } from './ingrediente'
import type { Categoria } from './categoria'
import type { UnidadMedida } from './unidad_medida'

export interface ProductoIngredienteLink {
  ingrediente_id: number
  cantidad: number
  unidad_medida_id: number
  es_removible: boolean
  ingrediente?: Ingrediente
}

export interface ProductoCategoriaLink {
  categoria_id: number
  es_principal: boolean
  categoria?: Categoria
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string | null
  stock_cantidad: number
  disponible: boolean
  unidad_venta_id: number | null
  unidad_venta?: UnidadMedida
}

export interface ProductoDetalle extends Producto {
  ingrediente_links: ProductoIngredienteLink[]
  categoria_links: ProductoCategoriaLink[]
}

export interface ProductoCategoriaLinkCreate {
  categoria_id: number
  es_principal: boolean
}

export interface ProductoIngredienteLinkCreate {
  ingrediente_id: number
  cantidad: number
  unidad_medida_id: number
  es_removible: boolean
}

export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio_base: number
  imagenes_url?: string
  stock_cantidad?: number
  disponible?: boolean
  unidad_venta_id?: number
}

export interface ProductoUpdate {
  nombre?: string
  descripcion?: string
  precio_base?: number
  imagenes_url?: string
  stock_cantidad?: number
  disponible?: boolean
  unidad_venta_id?: number
}
