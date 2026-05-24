from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables

from app.models import unidad_medida, categoria, ingrediente, producto
from app.models import producto_categoria, producto_ingrediente

from app.routers import unidades_medida, categorias, ingredientes, productos


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(unidades_medida.router)
app.include_router(categorias.router)
app.include_router(ingredientes.router)
app.include_router(productos.router)
