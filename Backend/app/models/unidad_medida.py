from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .producto import Producto
    from .producto_ingrediente import ProductoIngrediente


class UnidadMedida(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50, unique=True)
    simbolo: str = Field(max_length=10)
    tipo: str = Field(max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    productos: list["Producto"] = Relationship(back_populates="unidad_venta")
    ingrediente_links: list["ProductoIngrediente"] = Relationship(back_populates="unidad_medida")
