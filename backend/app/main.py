from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers.auth import (
    router as auth_router,
)
from app.api.routers.health import (
    router as health_router,
)
from app.api.routers.dashboard import (
    router as dashboard_router,
)
from app.api.routers.sessions import (
    router as sessions_router,
)
from app.config import settings


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router
)

app.include_router(
    auth_router
)

app.include_router(
    sessions_router
)

app.include_router(
    dashboard_router
)


@app.get("/")
def root():
    return {
        "message": "RiderJob API",
        "docs": "/docs",
    }