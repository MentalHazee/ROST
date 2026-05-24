from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate


def get_all(session: Session, skip: int, limit: int) -> list[Categoria]:
    query = select(Categoria)
    return session.exec(query.offset(skip).limit(limit)).all()


def get_by_id(session: Session, item_id: int) -> Optional[Categoria]:
    return session.get(Categoria, item_id)


def create(session: Session, data: CategoriaCreate) -> Categoria:
    item = Categoria.model_validate(data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update(session: Session, item_id: int, data: CategoriaUpdate) -> Optional[Categoria]:
    item = session.get(Categoria, item_id)
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
    item = session.get(Categoria, item_id)
    if not item:
        return False
    session.delete(item)
    session.commit()
    return True
