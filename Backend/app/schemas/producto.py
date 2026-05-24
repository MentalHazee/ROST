from pydantic import BaseModel, Field
from typing import Optional

from .ingrediente import IngredienteRead
from .categoria import CategoriaRead
from .unidad_medida import UnidadMedidaRead


class ProductoIngredienteLinkRead(BaseModel):
    ingrediente_id: int
    cantidad: float
    unidad_medida_id: int
    es_removible: bool
    ingrediente: Optional[IngredienteRead] = None

    model_config = {"from_attributes": True}


class ProductoCategoriaLinkRead(BaseModel):
    categoria_id: int
    es_principal: bool
    categoria: Optional[CategoriaRead] = None

    model_config = {"from_attributes": True}


class ProductoCategoriaLinkCreate(BaseModel):
    categoria_id: int
    es_principal: bool = False


class ProductoIngredienteLinkCreate(BaseModel):
    ingrediente_id: int
    cantidad: float = Field(gt=0)
    unidad_medida_id: int
    es_removible: bool = False


class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(ge=0)
    imagenes_url: Optional[str] = None
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = True
    unidad_venta_id: Optional[int] = None


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=150)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0)
    imagenes_url: Optional[str] = None
    stock_cantidad: Optional[int] = Field(default=None, ge=0)
    disponible: Optional[bool] = None
    unidad_venta_id: Optional[int] = None


class ProductoRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio_base: float
    imagenes_url: Optional[str]
    stock_cantidad: int
    disponible: bool
    unidad_venta_id: Optional[int]
    unidad_venta: Optional[UnidadMedidaRead] = None

    model_config = {"from_attributes": True}


class ProductoReadDetalle(ProductoRead):
    ingrediente_links: list[ProductoIngredienteLinkRead] = []
    categoria_links: list[ProductoCategoriaLinkRead] = []
