from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from .usuario import Usuario
    from .forma_pago import FormaPago
    from .direccion_entrega import DireccionEntrega
    from .detalle_pedido import DetallePedido
    from .historial_estado_pedido import HistorialEstadoPedido


class Pedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    direccion_id: int = Field(foreign_key="direccionentrega.id")
    forma_pago_id: int = Field(foreign_key="formapago.id")
    estado_actual: str = Field(default="PENDIENTE", max_length=20)
    total: float
    notas: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    usuario: Optional["Usuario"] = Relationship(back_populates="pedidos")
    forma_pago: Optional["FormaPago"] = Relationship(back_populates="pedidos")
    direccion: Optional["DireccionEntrega"] = Relationship(back_populates="pedidos")
    detalles: list["DetallePedido"] = Relationship(back_populates="pedido")
    historial: list["HistorialEstadoPedido"] = Relationship(back_populates="pedido")
