from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlmodel import Session, select
from pydantic import BaseModel

from app.database import get_session
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.models.usuario_rol import UsuarioRol
from app.repositories.usuario_repository import UsuarioRepository
from app.utils.security import hash_password, verify_password, create_access_token
from app.dependencies.auth import get_current_user
from app.schemas.usuario import UsuarioCreate, UsuarioRead

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/registro", status_code=201)
def registro(data: UsuarioCreate, session: Session = Depends(get_session)):
    repo = UsuarioRepository(session)
    if repo.get_by_email(data.email):
        raise HTTPException(409, "Email ya registrado")
    usuario = Usuario(
        nombre=data.nombre,
        apellido=data.apellido,
        email=data.email,
        celular=data.celular,
        password_hash=hash_password(data.password),
    )
    session.add(usuario)
    session.flush()
    session.add(UsuarioRol(usuario_id=usuario.id, rol_codigo="CLIENT"))
    session.commit()
    return {"mensaje": "Usuario creado correctamente"}


@router.post("/login")
def login(data: LoginRequest, response: Response, session: Session = Depends(get_session)):
    repo = UsuarioRepository(session)
    usuario = repo.get_by_email(data.email)
    if not usuario or not verify_password(data.password, usuario.password_hash):
        raise HTTPException(401, "Credenciales incorrectas")
    roles = [ur.rol_codigo for ur in usuario.roles]
    token = create_access_token({"sub": str(usuario.id), "roles": roles})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=1800,
        samesite="lax",
    )
    return {"mensaje": "Login exitoso"}


@router.get("/me", response_model=UsuarioRead)
def get_me(usuario: Usuario = Depends(get_current_user)):
    return usuario


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"mensaje": "Sesion cerrada"}
