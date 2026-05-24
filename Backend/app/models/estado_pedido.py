from sqlmodel import SQLModel, Field


class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estadopedido"

    codigo: str = Field(primary_key=True, max_length=20)
