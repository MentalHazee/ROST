from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .producto import Producto
    from .ingrediente import Ingrediente
    from .unidad_medida import UnidadMedida


class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "productoingrediente"

    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    cantidad: float = Field(gt=0)
    unidad_medida_id: int = Field(foreign_key="unidadmedida.id")
    es_removible: bool = Field(default=False)

    producto: Optional["Producto"] = Relationship(back_populates="ingrediente_links")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="producto_links")
    unidad_medida: Optional["UnidadMedida"] = Relationship(back_populates="ingrediente_links")
