from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .pedido import Pedido


class FormaPago(SQLModel, table=True):
    __tablename__ = "formapago"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50, unique=True)
    activo: bool = Field(default=True)

    pedidos: list["Pedido"] = Relationship(back_populates="forma_pago")
