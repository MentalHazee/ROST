from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import require_rol
from app.schemas.unidad_medida import UnidadMedidaCreate, UnidadMedidaRead, UnidadMedidaUpdate
from app.services import unidad_medida_service

router = APIRouter(prefix="/unidades-medida", tags=["Unidades de Medida"])


@router.get("/", response_model=list[UnidadMedidaRead])
def listar_unidades(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return unidad_medida_service.get_all(session, skip, limit)


@router.post("/", response_model=UnidadMedidaRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def crear_unidad(data: UnidadMedidaCreate, session: Session = Depends(get_session)):
    return unidad_medida_service.create(session, data)


@router.get("/{item_id}", response_model=UnidadMedidaRead)
def obtener_unidad(item_id: int, session: Session = Depends(get_session)):
    item = unidad_medida_service.get_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Unidad de medida no encontrada")
    return item


@router.patch("/{item_id}", response_model=UnidadMedidaRead, dependencies=[Depends(require_rol("ADMIN"))])
def actualizar_unidad(
    item_id: int,
    data: UnidadMedidaUpdate,
    session: Session = Depends(get_session),
):
    item = unidad_medida_service.update(session, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Unidad de medida no encontrada")
    return item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_unidad(item_id: int, session: Session = Depends(get_session)):
    ok = unidad_medida_service.delete(session, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Unidad de medida no encontrada")
