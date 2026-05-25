# ROST Specialty Coffee

## Backend

```powershell
cd Backend

# Primera vez
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Ejecutar
uvicorn app.main:app --reload
```

Backend: http://localhost:8000  
Docs: http://localhost:8000/docs

---

## Frontend

```powershell
cd Frontend-admin

# Primera vez
pnpm install

# Ejecutar
pnpm run dev
```

Frontend: http://localhost:5173

---

## Base de datos

Verificar PostgreSQL activo:

```powershell
Get-Service postgresql*
```

Crear base:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE parcial_db;"
```

---

## Ejecutar todo

Terminal 1:

```powershell
cd Backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

Terminal 2:

```powershell
cd Frontend-admin
pnpm run dev
```
