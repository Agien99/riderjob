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
    EndSessionRequest,
    SessionDetailResponse,
    SessionResponse,
    StartSessionRequest,
)
from app.services.session_service import (
    create_session,
    end_session,
    get_active_session,
    get_session_by_id,
)

from uuid import UUID

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

@router.get(
    "/active",
    response_model=SessionResponse,
)
def read_active_session(
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

    if active_session is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "No active rider session "
                "found."
            ),
        )

    return active_session

@router.post(
    "/{session_id}/end",
    response_model=SessionDetailResponse,
)
def complete_session(
    session_id: UUID,
    request: EndSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    rider_session = (
        get_session_by_id(
            db,
            session_id,
            current_user.id,
        )
    )

    if rider_session is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail=(
                "Rider session not found."
            ),
        )

    try:
        return end_session(
            db=db,
            rider_session=rider_session,
            request=request,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=str(error),
        ) from error