from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .producto_categoria import ProductoCategoria


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    nombre: str = Field(max_length=100, unique=True)
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    subcategorias: list["Categoria"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Categoria.parent_id == Categoria.id",
            "foreign_keys": "[Categoria.parent_id]",
            "lazy": "selectin",
        }
    )

    producto_links: list["ProductoCategoria"] = Relationship(back_populates="categoria")
