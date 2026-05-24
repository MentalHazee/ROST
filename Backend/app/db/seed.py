from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models.rol import Rol
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol
from app.models.forma_pago import FormaPago
from app.models.estado_pedido import EstadoPedido
from app.utils.security import hash_password


# Importar todos los modelos para que SQLAlchemy los registre antes de
# cualquier operación. El orden de los imports es crítico para resolver
# las relaciones circulares (Usuario↔Pedido, Producto↔Ingrediente, etc.)
from app.models import (
    unidad_medida, categoria, ingrediente, producto,       # noqa: F401, E402
    producto_categoria, producto_ingrediente,              # noqa: F401, E402
    direccion_entrega, pedido, detalle_pedido,              # noqa: F401, E402
    historial_estado_pedido,                                # noqa: F401, E402
)


def seed():
    create_db_and_tables()
    with Session(engine) as session:
        # --- Roles (PK semántica) ---
        roles = [
            ("ADMIN",   "Administrador",       "Acceso total sin restricciones"),
            ("STOCK",   "Gestor de Stock",      "Actualiza stock y disponible"),
            ("PEDIDOS", "Gestor de Pedidos",    "Avanza estados CONFIRMADO→ENTREGADO"),
            ("CLIENT",  "Cliente",              "Opera solo sus propios datos"),
        ]
        for codigo, nombre, desc in roles:
            if not session.get(Rol, codigo):
                session.add(Rol(codigo=codigo, nombre=nombre, descripcion=desc))

        # --- Formas de pago ---
        for nombre in ["Efectivo", "Tarjeta de crédito", "Transferencia", "Mercado Pago"]:
            if not session.exec(select(FormaPago).where(FormaPago.nombre == nombre)).first():
                session.add(FormaPago(nombre=nombre))

        # --- Estados de pedido ---
        for codigo in ["PENDIENTE", "CONFIRMADO", "EN_PREP", "EN_CAMINO", "ENTREGADO", "CANCELADO"]:
            if not session.get(EstadoPedido, codigo):
                session.add(EstadoPedido(codigo=codigo))

        session.commit()

        # --- Usuario admin ---
        if not session.exec(select(Usuario).where(Usuario.email == "admin@store.com")).first():
            admin = Usuario(
                nombre="Admin",
                apellido="Sistema",
                email="admin@store.com",
                password_hash=hash_password("admin1234"),
            )
            session.add(admin)
            session.flush()
            session.add(UsuarioRol(usuario_id=admin.id, rol_codigo="ADMIN"))
            session.commit()

    print("[OK] Seed completado.")


if __name__ == "__main__":
    seed()
