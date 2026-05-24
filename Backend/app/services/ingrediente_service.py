from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.models.ingrediente import Ingrediente
from app.schemas.ingrediente import IngredienteCreate, IngredienteUpdate


def get_all(session: Session, skip: int, limit: int,
            es_alergeno: Optional[bool] = None) -> list[Ingrediente]:
    query = select(Ingrediente)
    if es_alergeno is not None:
        query = query.where(Ingrediente.es_alergeno == es_alergeno)
    return session.exec(query.offset(skip).limit(limit)).all()


def get_by_id(session: Session, item_id: int) -> Optional[Ingrediente]:
    return session.get(Ingrediente, item_id)


def create(session: Session, data: IngredienteCreate) -> Ingrediente:
    item = Ingrediente.model_validate(data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update(session: Session, item_id: int, data: IngredienteUpdate) -> Optional[Ingrediente]:
    item = session.get(Ingrediente, item_id)
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
    item = session.get(Ingrediente, item_id)
    if not item:
        return False
    session.delete(item)
    session.commit()
    return True
