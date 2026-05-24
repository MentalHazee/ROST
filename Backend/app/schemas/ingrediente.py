from pydantic import BaseModel, Field
from typing import Optional


class IngredienteCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: Optional[str] = None
    es_alergeno: bool = False


class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=100)
    descripcion: Optional[str] = None
    es_alergeno: Optional[bool] = None


class IngredienteRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    es_alergeno: bool

    model_config = {"from_attributes": True}
