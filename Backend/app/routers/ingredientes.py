from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import require_rol
from app.schemas.ingrediente import IngredienteCreate, IngredienteRead, IngredienteUpdate
from app.services import ingrediente_service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.get("/", response_model=list[IngredienteRead])
def listar_ingredientes(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0, description="Registros a omitir")] = 0,
    limit: Annotated[int, Query(ge=1, le=100, description="Max registros")] = 20,
    es_alergeno: Annotated[bool | None, Query(description="Filtrar por alergeno")] = None,
):
    return ingrediente_service.get_all(session, skip, limit, es_alergeno)


@router.post("/", response_model=IngredienteRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def crear_ingrediente(data: IngredienteCreate, session: Session = Depends(get_session)):
    return ingrediente_service.create(session, data)


@router.get("/{item_id}", response_model=IngredienteRead)
def obtener_ingrediente(item_id: int, session: Session = Depends(get_session)):
    item = ingrediente_service.get_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return item


@router.patch("/{item_id}", response_model=IngredienteRead, dependencies=[Depends(require_rol("ADMIN"))])
def actualizar_ingrediente(
    item_id: int,
    data: IngredienteUpdate,
    session: Session = Depends(get_session),
):
    item = ingrediente_service.update(session, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_ingrediente(item_id: int, session: Session = Depends(get_session)):
    ok = ingrediente_service.delete(session, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
