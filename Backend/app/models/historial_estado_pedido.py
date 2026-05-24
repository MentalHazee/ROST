from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .pedido import Pedido


class HistorialEstadoPedido(SQLModel, table=True):
    __tablename__ = "historialestadopedido"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    estado: str = Field(max_length=20)
    cambiado_por: int = Field(foreign_key="usuario.id")
    notas: Optional[str] = None
    fecha: datetime = Field(default_factory=datetime.utcnow)

    pedido: Optional["Pedido"] = Relationship(back_populates="historial")
