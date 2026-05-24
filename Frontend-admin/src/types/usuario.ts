export interface UsuarioRol {
  usuario_id: number
  rol_codigo: string
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  celular: string | null
  activo: boolean
  roles: UsuarioRol[]
}
