from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from app.database import get_session
from app.dependencies.auth import get_current_user
from app.models.usuario import Usuario
from app.models.direccion_entrega import DireccionEntrega
from app.schemas.direccion import DireccionCreate, DireccionUpdate, DireccionRead

router = APIRouter(prefix="/api/v1/direcciones", tags=["Direcciones"])


@router.get("/", response_model=list[DireccionRead])
def listar_direcciones(
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(
        select(DireccionEntrega)
        .where(DireccionEntrega.usuario_id == usuario.id)
        .where(DireccionEntrega.deleted_at.is_(None))
    ).all()


@router.post("/", response_model=DireccionRead, status_code=201)
def crear_direccion(
    data: DireccionCreate,
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    existe_principal = session.exec(
        select(DireccionEntrega)
        .where(DireccionEntrega.usuario_id == usuario.id)
        .where(DireccionEntrega.es_principal == True)
        .where(DireccionEntrega.deleted_at.is_(None))
    ).first()

    direccion = DireccionEntrega(
        usuario_id=usuario.id,
        alias=data.alias,
        calle=data.calle,
        numero=data.numero,
        ciudad=data.ciudad,
        provincia=data.provincia,
        codigo_postal=data.codigo_postal,
        es_principal=not existe_principal,
    )
    session.add(direccion)
    session.commit()
    session.refresh(direccion)
    return direccion


@router.patch("/{direccion_id}/principal", response_model=DireccionRead)
def marcar_principal(
    direccion_id: int,
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    direccion = session.get(DireccionEntrega, direccion_id)
    if not direccion or direccion.usuario_id != usuario.id or direccion.deleted_at:
        raise HTTPException(404, "Direccion no encontrada")

    anteriores = session.exec(
        select(DireccionEntrega)
        .where(DireccionEntrega.usuario_id == usuario.id)
        .where(DireccionEntrega.es_principal == True)
        .where(DireccionEntrega.deleted_at.is_(None))
    ).all()
    for d in anteriores:
        d.es_principal = False
        session.add(d)

    direccion.es_principal = True
    session.add(direccion)
    session.commit()
    session.refresh(direccion)
    return direccion


@router.patch("/{direccion_id}", response_model=DireccionRead)
def actualizar_direccion(
    direccion_id: int,
    data: DireccionUpdate,
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    direccion = session.get(DireccionEntrega, direccion_id)
    if not direccion or direccion.usuario_id != usuario.id or direccion.deleted_at:
        raise HTTPException(404, "Direccion no encontrada")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(direccion, key, value)
    session.add(direccion)
    session.commit()
    session.refresh(direccion)
    return direccion


@router.delete("/{direccion_id}", status_code=204)
def eliminar_direccion(
    direccion_id: int,
    usuario: Usuario = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    direccion = session.get(DireccionEntrega, direccion_id)
    if not direccion or direccion.usuario_id != usuario.id or direccion.deleted_at:
        raise HTTPException(404, "Direccion no encontrada")

    direccion.deleted_at = datetime.utcnow()
    session.add(direccion)
    session.commit()
