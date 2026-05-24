from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UsuarioCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=80)
    apellido: str = Field(min_length=1, max_length=80)
    email: str = Field(max_length=254)
    celular: Optional[str] = Field(default=None, max_length=20)
    password: str = Field(min_length=6)


class UsuarioRead(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    celular: Optional[str]
    activo: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
