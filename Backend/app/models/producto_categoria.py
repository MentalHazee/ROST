from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .producto import Producto
    from .categoria import Categoria


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "productocategoria"

    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)
    es_principal: bool = Field(default=False)

    producto: Optional["Producto"] = Relationship(back_populates="categoria_links")
    categoria: Optional["Categoria"] = Relationship(back_populates="producto_links")
