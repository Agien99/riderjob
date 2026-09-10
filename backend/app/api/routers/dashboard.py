from typing import Literal

from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.api.routers.auth import (
    get_current_user,
)
from app.database import get_db
from app.models.user import User
from app.schemas.dashboard import (
    DashboardResponse,
)
from app.services.dashboard_service import (
    build_dashboard,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    period: Literal[
        "today",
        "week",
        "month",
    ] = Query(default="today"),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return build_dashboard(
        db=db,
        user_id=current_user.id,
        period=period,
    )