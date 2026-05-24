# Backend — Catálogo de Productos

API REST construida con **FastAPI** + **SQLModel** + **PostgreSQL**.

## Requisitos

- Python 3.11+
- PostgreSQL (local)
- `pip`

## Setup

```bash
# 1. Crear y activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar base de datos
# Crear la base de datos en PostgreSQL:
#   psql -U postgres -c "CREATE DATABASE catalogo_productos;"

# 4. Configurar .env (ya existe en el repo, ajustar si es necesario)
#    DATABASE_URL=postgresql+pg8000://postgres:1234@localhost:5432/catalogo_productos
```

## Ejecutar

```bash
uvicorn app.main:app --reload
```

La API se levanta en `http://localhost:8000`.

Documentación interactiva:
- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ingredientes` | Listar ingredientes |
| POST | `/ingredientes` | Crear ingrediente |
| GET | `/ingredientes/{id}` | Obtener ingrediente |
| PATCH | `/ingredientes/{id}` | Actualizar ingrediente |
| DELETE | `/ingredientes/{id}` | Eliminar ingrediente |
| GET | `/categorias` | Listar categorías |
| POST | `/categorias` | Crear categoría |
| GET | `/categorias/{id}` | Obtener categoría |
| PATCH | `/categorias/{id}` | Actualizar categoría |
| DELETE | `/categorias/{id}` | Eliminar categoría |
| GET | `/productos` | Listar productos |
| POST | `/productos` | Crear producto |
| GET | `/productos/{id}` | Obtener detalle del producto |
| PATCH | `/productos/{id}` | Actualizar producto |
| DELETE | `/productos/{id}` | Eliminar producto |
| GET | `/unidades-medida` | Listar unidades de medida |
| POST | `/unidades-medida` | Crear unidad de medida |
| GET | `/unidades-medida/{id}` | Obtener unidad de medida |
| PATCH | `/unidades-medida/{id}` | Actualizar unidad de medida |
| DELETE | `/unidades-medida/{id}` | Eliminar unidad de medida |

## Tecnologías

- **FastAPI** — Framework web
- **SQLModel** — ORM (SQLAlchemy + Pydantic)
- **pg8000** — Driver PostgreSQL (compatible con acentos en Windows)
- **Uvicorn** — Servidor ASGI
