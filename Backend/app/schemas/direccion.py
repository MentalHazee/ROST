from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DireccionCreate(BaseModel):
    alias: str = Field(min_length=1, max_length=50)
    calle: str = Field(min_length=1, max_length=150)
    numero: str = Field(min_length=1, max_length=10)
    ciudad: str = Field(min_length=1, max_length=80)
    provincia: str = Field(min_length=1, max_length=80)
    codigo_postal: Optional[str] = Field(default=None, max_length=10)


class DireccionUpdate(BaseModel):
    alias: Optional[str] = Field(default=None, min_length=1, max_length=50)
    calle: Optional[str] = Field(default=None, min_length=1, max_length=150)
    numero: Optional[str] = Field(default=None, min_length=1, max_length=10)
    ciudad: Optional[str] = Field(default=None, min_length=1, max_length=80)
    provincia: Optional[str] = Field(default=None, min_length=1, max_length=80)
    codigo_postal: Optional[str] = Field(default=None, max_length=10)


class DireccionRead(BaseModel):
    id: int
    usuario_id: int
    alias: str
    calle: str
    numero: str
    ciudad: str
    provincia: str
    codigo_postal: Optional[str]
    es_principal: bool
    created_at: datetime

    model_config = {"from_attributes": True}
