from fastapi import HTTPException

from app.uow import UnitOfWork
from app.models.pedido import Pedido
from app.models.detalle_pedido import DetallePedido
from app.models.historial_estado_pedido import HistorialEstadoPedido
from app.models.producto import Producto

TRANSICIONES_VALIDAS: dict[str, list[str]] = {
    "PENDIENTE":  ["CONFIRMADO", "CANCELADO"],
    "CONFIRMADO": ["EN_PREP",    "CANCELADO"],
    "EN_PREP":    ["EN_CAMINO"],
    "EN_CAMINO":  ["ENTREGADO"],
    "ENTREGADO":  [],
    "CANCELADO":  [],
}


def crear_pedido(uow: UnitOfWork, usuario_id: int, direccion_id: int,
                 forma_pago_id: int, items: list[dict]) -> Pedido:
    total = 0.0
    detalles_data = []

    for item in items:
        producto = uow.session.get(Producto, item["producto_id"])
        if not producto or not producto.disponible:
            raise HTTPException(400, f"Producto {item['producto_id']} no disponible")
        subtotal = producto.precio_base * item["cantidad"]
        total += subtotal
        detalles_data.append({
            "producto_id": producto.id,
            "cantidad": item["cantidad"],
            "precio_snapshot": producto.precio_base,
            "nombre_snapshot": producto.nombre,
        })

    pedido = Pedido(
        usuario_id=usuario_id,
        direccion_id=direccion_id,
        forma_pago_id=forma_pago_id,
        total=total,
        estado_actual="PENDIENTE",
    )
    uow.session.add(pedido)
    uow.session.flush()

    for d in detalles_data:
        uow.session.add(DetallePedido(pedido_id=pedido.id, **d))

    uow.session.add(HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado="PENDIENTE",
        cambiado_por=usuario_id,
    ))

    uow.session.refresh(pedido)
    return pedido


def avanzar_estado(uow: UnitOfWork, pedido_id: int,
                   nuevo_estado: str, usuario_id: int,
                   notas: str | None = None) -> Pedido:
    pedido = uow.session.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(404, "Pedido no encontrado")

    estado_actual = pedido.estado_actual
    if nuevo_estado not in TRANSICIONES_VALIDAS.get(estado_actual, []):
        raise HTTPException(422,
                            f"No se puede pasar de {estado_actual} a {nuevo_estado}")

    pedido.estado_actual = nuevo_estado
    uow.session.add(pedido)

    uow.session.add(HistorialEstadoPedido(
        pedido_id=pedido_id,
        estado=nuevo_estado,
        cambiado_por=usuario_id,
        notas=notas,
    ))
    uow.session.refresh(pedido)
    return pedido


def get_by_id(session, pedido_id: int) -> Pedido | None:
    return session.get(Pedido, pedido_id)
