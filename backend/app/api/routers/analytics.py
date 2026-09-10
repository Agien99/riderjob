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
from app.schemas.analytics import (
    AnalyticsResponse,
)
from app.services.analytics_service import (
    build_analytics,
)


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get(
    "",
    response_model=AnalyticsResponse,
)
def get_analytics(
    period: Literal[
        "7d",
        "30d",
        "month",
        "3m",
        "all",
    ] = Query(default="30d"),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return build_analytics(
        db=db,
        user_id=current_user.id,
        period=period,
    )