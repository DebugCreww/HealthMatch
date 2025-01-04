from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# Chiave segreta e algoritmo per la generazione del token JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.security = HTTPBearer()

    async def dispatch(self, request: Request, call_next):
        credentials: HTTPAuthorizationCredentials = await self.security(request)
        if credentials:
            token = credentials.credentials
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                request.state.user = payload
            except JWTError:
                raise HTTPException(status_code=401, detail="Invalid token")
        else:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        
        response = await call_next(request)
        return response