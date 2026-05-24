from fastapi import Depends, HTTPException, Request
from sqlmodel import Session

from app.database import get_session
from app.models.usuario import Usuario
from app.utils.security import decode_token


def get_current_user(request: Request, session: Session = Depends(get_session)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(401, "No autenticado")
    payload = decode_token(token)
    user_id = int(payload["sub"])
    usuario = session.get(Usuario, user_id)
    if not usuario or usuario.deleted_at is not None:
        raise HTTPException(401, "Usuario inactivo o no existe")
    return usuario


def require_rol(*roles: str):
    """Factory: genera una dependencia que verifica el rol del usuario."""
    def checker(usuario: Usuario = Depends(get_current_user)):
        codigos = {ur.rol_codigo for ur in usuario.roles}
        if not codigos.intersection(set(roles)):
            raise HTTPException(403, "Sin permisos para esta accion")
        return usuario
    return checker
