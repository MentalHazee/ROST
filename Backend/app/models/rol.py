from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .usuario_rol import UsuarioRol


class Rol(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=20)
    nombre: str = Field(max_length=50, unique=True)
    descripcion: Optional[str] = None

    usuario_links: list["UsuarioRol"] = Relationship(back_populates="rol")
