from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .usuario import Usuario
    from .pedido import Pedido


class DireccionEntrega(SQLModel, table=True):
    __tablename__ = "direccionentrega"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    alias: str = Field(max_length=50)
    calle: str = Field(max_length=150)
    numero: str = Field(max_length=10)
    ciudad: str = Field(max_length=80)
    provincia: str = Field(max_length=80)
    codigo_postal: Optional[str] = Field(default=None, max_length=10)
    es_principal: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    usuario: Optional["Usuario"] = Relationship(back_populates="direcciones")
    pedidos: list["Pedido"] = Relationship(back_populates="direccion")
