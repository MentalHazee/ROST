from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .unidad_medida import UnidadMedida
    from .producto_categoria import ProductoCategoria
    from .producto_ingrediente import ProductoIngrediente


class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    unidad_venta_id: Optional[int] = Field(default=None, foreign_key="unidadmedida.id")
    nombre: str = Field(max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(ge=0)
    imagenes_url: Optional[str] = None
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    unidad_venta: Optional["UnidadMedida"] = Relationship(back_populates="productos")
    categoria_links: list["ProductoCategoria"] = Relationship(back_populates="producto")
    ingrediente_links: list["ProductoIngrediente"] = Relationship(back_populates="producto")
