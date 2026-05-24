from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Annotated
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import require_rol
from app.schemas.producto import (
    ProductoCreate,
    ProductoCategoriaLinkCreate,
    ProductoCategoriaLinkRead,
    ProductoIngredienteLinkCreate,
    ProductoIngredienteLinkRead,
    ProductoRead,
    ProductoReadDetalle,
    ProductoUpdate,
)
from app.services import producto_service

class DisponibilidadUpdate(BaseModel):
    disponible: bool


router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoRead])
def listar_productos(
    session: Session = Depends(get_session),
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    disponible: Annotated[bool | None, Query(description="Filtrar por disponible")] = None,
):
    return producto_service.get_all(session, skip, limit, disponible)


@router.post("/", response_model=ProductoRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def crear_producto(data: ProductoCreate, session: Session = Depends(get_session)):
    return producto_service.create(session, data)


@router.get("/{item_id}", response_model=ProductoReadDetalle)
def obtener_producto(item_id: int, session: Session = Depends(get_session)):
    item = producto_service.get_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return item


@router.patch("/{item_id}", response_model=ProductoRead, dependencies=[Depends(require_rol("ADMIN"))])
def actualizar_producto(
    item_id: int,
    data: ProductoUpdate,
    session: Session = Depends(get_session),
):
    item = producto_service.update(session, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_producto(item_id: int, session: Session = Depends(get_session)):
    ok = producto_service.delete(session, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Producto no encontrado")


@router.patch("/{item_id}/disponibilidad", response_model=ProductoRead, dependencies=[Depends(require_rol("ADMIN", "STOCK"))])
def cambiar_disponibilidad(
    item_id: int,
    data: DisponibilidadUpdate,
    session: Session = Depends(get_session),
):
    item = producto_service.get_by_id(session, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    item.disponible = data.disponible
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.post("/{producto_id}/categorias", response_model=ProductoCategoriaLinkRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def agregar_categoria_a_producto(
    producto_id: int,
    data: ProductoCategoriaLinkCreate,
    session: Session = Depends(get_session),
):
    producto = producto_service.get_by_id(session, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    link = producto_service.add_categoria(session, producto_id, data.categoria_id, data.es_principal)
    if not link:
        raise HTTPException(status_code=409, detail="La categoría ya está vinculada al producto")
    return link


@router.delete("/{producto_id}/categorias/{categoria_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_categoria_de_producto(
    producto_id: int,
    categoria_id: int,
    session: Session = Depends(get_session),
):
    ok = producto_service.remove_categoria(session, producto_id, categoria_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Vínculo producto-categoría no encontrado")


@router.post("/{producto_id}/ingredientes", response_model=ProductoIngredienteLinkRead, status_code=201, dependencies=[Depends(require_rol("ADMIN"))])
def agregar_ingrediente_a_producto(
    producto_id: int,
    data: ProductoIngredienteLinkCreate,
    session: Session = Depends(get_session),
):
    producto = producto_service.get_by_id(session, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    link = producto_service.add_ingrediente(
        session, producto_id, data.ingrediente_id, data.cantidad, data.unidad_medida_id, data.es_removible
    )
    if not link:
        raise HTTPException(status_code=409, detail="El ingrediente ya está vinculado al producto")
    return link


@router.delete("/{producto_id}/ingredientes/{ingrediente_id}", status_code=204, dependencies=[Depends(require_rol("ADMIN"))])
def eliminar_ingrediente_de_producto(
    producto_id: int,
    ingrediente_id: int,
    session: Session = Depends(get_session),
):
    ok = producto_service.remove_ingrediente(session, producto_id, ingrediente_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Vínculo producto-ingrediente no encontrado")
