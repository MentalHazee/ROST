# Catálogo de Productos — Parcial UTN TUP

Aplicación fullstack de catálogo de productos con categorías, ingredientes y unidades de medida.

## Tecnologías

**Backend:** FastAPI, SQLModel, PostgreSQL, pg8000, Pydantic, Uvicorn
**Frontend:** React 18, TypeScript, Vite, TanStack Query v5, React Router DOM v6, Tailwind CSS v4, Axios

## Requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL (local)

## Ejecutar Backend

```bash
cd Backend
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac
uvicorn app.main:app --reload
```

API en http://localhost:8000 — Docs: http://localhost:8000/docs

## Ejecutar Frontend

```bash
cd Frontend-admin
pnpm install
pnpm dev
```

Frontend en http://localhost:5173

## Base de Datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE catalogo_productos;
```

La conexión se configura en `Backend/.env`:

```
DATABASE_URL=postgresql+pg8000://postgres:1234@localhost:5432/catalogo_productos

