from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies.auth import get_current_user, require_rol
from app.models.usuario import Usuario
from app.models.pedido import Pedido
from app.uow import UnitOfWork
from app.services.pedido_service import crear_pedido, avanzar_estado, get_by_id
from app.schemas.pedido import PedidoCreate, PedidoRead, EstadoUpdate

router = APIRouter(prefix="/api/v1/pedidos", tags=["Pedidos"])


@router.post("/", response_model=PedidoRead, status_code=201)
def crear_nuevo_pedido(
    data: PedidoCreate,
    usuario: Usuario = Depends(get_current_user),
):
    with UnitOfWork() as uow:
        pedido = crear_pedido(
            uow, usuario.id, data.direccion_id, data.forma_pago_id,
            [item.model_dump() for item in data.items],
        )
        uow.session.refresh(pedido)
        return pedido


@router.get("/", response_model=list[PedidoRead])
def listar_pedidos(
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    codigos = {ur.rol_codigo for ur in usuario.roles}
    if codigos.intersection({"ADMIN", "PEDIDOS"}):
        pedidos = session.exec(select(Pedido)).all()
    else:
        pedidos = session.exec(
            select(Pedido).where(Pedido.usuario_id == usuario.id)
        ).all()
    return pedidos


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int,
    data: EstadoUpdate,
    usuario: Usuario = Depends(get_current_user),
):
    with UnitOfWork() as uow:
        pedido = avanzar_estado(
            uow, pedido_id, data.estado, usuario.id, data.notas,
        )
        uow.session.refresh(pedido)
        return pedido
