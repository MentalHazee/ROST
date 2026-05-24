from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(ge=1)


class PedidoCreate(BaseModel):
    direccion_id: int
    forma_pago_id: int
    items: list[DetallePedidoCreate]


class DetallePedidoRead(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_snapshot: float
    nombre_snapshot: str

    model_config = {"from_attributes": True}


class HistorialEstadoRead(BaseModel):
    id: int
    estado: str
    cambiado_por: int
    notas: Optional[str]
    fecha: datetime

    model_config = {"from_attributes": True}


class PedidoRead(BaseModel):
    id: int
    usuario_id: int
    direccion_id: int
    forma_pago_id: int
    estado_actual: str
    total: float
    notas: Optional[str]
    created_at: datetime
    detalles: list[DetallePedidoRead] = []

    model_config = {"from_attributes": True}


class EstadoUpdate(BaseModel):
    estado: str
    notas: Optional[str] = None
