from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.models.producto import Producto
from app.models.producto_categoria import ProductoCategoria
from app.models.producto_ingrediente import ProductoIngrediente
from app.schemas.producto import ProductoCreate, ProductoUpdate


def get_all(session: Session, skip: int, limit: int,
            disponible: Optional[bool] = None) -> list[Producto]:
    query = select(Producto).where(Producto.deleted_at.is_(None))
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)
    return session.exec(query.offset(skip).limit(limit)).all()


def get_by_id(session: Session, item_id: int) -> Optional[Producto]:
    return session.get(Producto, item_id)


def create(session: Session, data: ProductoCreate) -> Producto:
    item = Producto.model_validate(data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update(session: Session, item_id: int, data: ProductoUpdate) -> Optional[Producto]:
    item = session.get(Producto, item_id)
    if not item:
        return None
    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(item, key, value)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def delete(session: Session, item_id: int) -> bool:
    item = session.get(Producto, item_id)
    if not item:
        return False
    item.deleted_at = datetime.utcnow()
    item.updated_at = datetime.utcnow()
    session.add(item)
    session.commit()
    return True


def add_categoria(session: Session, producto_id: int, categoria_id: int,
                  es_principal: bool = False) -> Optional[ProductoCategoria]:
    existing = session.get(ProductoCategoria, (producto_id, categoria_id))
    if existing:
        return None
    link = ProductoCategoria(
        producto_id=producto_id,
        categoria_id=categoria_id,
        es_principal=es_principal,
    )
    session.add(link)
    session.commit()
    session.refresh(link)
    return link


def remove_categoria(session: Session, producto_id: int, categoria_id: int) -> bool:
    link = session.get(ProductoCategoria, (producto_id, categoria_id))
    if not link:
        return False
    session.delete(link)
    session.commit()
    return True


def add_ingrediente(session: Session, producto_id: int, ingrediente_id: int,
                    cantidad: float, unidad_medida_id: int,
                    es_removible: bool = False) -> Optional[ProductoIngrediente]:
    existing = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if existing:
        return None
    link = ProductoIngrediente(
        producto_id=producto_id,
        ingrediente_id=ingrediente_id,
        cantidad=cantidad,
        unidad_medida_id=unidad_medida_id,
        es_removible=es_removible,
    )
    session.add(link)
    session.commit()
    session.refresh(link)
    return link


def remove_ingrediente(session: Session, producto_id: int, ingrediente_id: int) -> bool:
    link = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if not link:
        return False
    session.delete(link)
    session.commit()
    return True
