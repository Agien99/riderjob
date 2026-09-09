from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_current_user,
)
from app.database import get_db
from app.models import User
from app.schemas.session import (
    SessionResponse,
    StartSessionRequest,
)
from app.services.session_service import (
    create_session,
    get_active_session,
)


router = APIRouter(
    prefix="/api/sessions",
    tags=["Rider Sessions"],
)


@router.post(
    "/start",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_session(
    request: StartSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    active_session = (
        get_active_session(
            db,
            current_user.id,
        )
    )

    if active_session is not None:
        raise HTTPException(
            status_code=(
                status.HTTP_409_CONFLICT
            ),
            detail=(
                "You already have an "
                "active rider session."
            ),
        )

    return create_session(
        db=db,
        user_id=current_user.id,
        platform=request.platform,
        start_mileage=(
            request.start_mileage
        ),
        notes=request.notes,
    )