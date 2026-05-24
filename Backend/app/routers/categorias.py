from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import require_rol
from app.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.services import categoria_service

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.get("/", response_model=list[CategoriaRead])
def listar_categorias(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return categoria_service.get_all(session, skip, limit)


@router.post("/", response_model=CategoriaRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def crear_categoria(data: CategoriaCreate, session: Session = Depends(get_session)):
    return categoria_service.create(session, data)


@router.get("/{item_id}", response_model=CategoriaRead)
def obtener_categoria(item_id: int, session: Session = Depends(get_session)):
    item = categoria_service.get_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return item


@router.patch("/{item_id}", response_model=CategoriaRead, dependencies=[Depends(require_rol("ADMIN"))])
def actualizar_categoria(
    item_id: int,
    data: CategoriaUpdate,
    session: Session = Depends(get_session),
):
    item = categoria_service.update(session, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_categoria(item_id: int, session: Session = Depends(get_session)):
    ok = categoria_service.delete(session, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
