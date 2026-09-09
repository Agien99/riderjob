from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RiderSession

from app.schemas.session import (
    EndSessionRequest,
    SessionDetailResponse,
    SessionResponse,
)
from app.services.session_calculations import (
    build_session_metrics,
    calculate_distance,
)


def get_active_session(
    db: Session,
    user_id: UUID,
) -> RiderSession | None:
    statement = (
        select(RiderSession)
        .where(
            RiderSession.user_id
            == user_id,
            RiderSession.status
            == "active",
        )
        .order_by(
            RiderSession.start_time.desc()
        )
    )

    return db.scalar(statement)


def create_session(
    db: Session,
    user_id: UUID,
    platform: str,
    start_mileage: Decimal,
    notes: str | None = None,
) -> RiderSession:
    now = datetime.now(
        timezone.utc
    )

    session = RiderSession(
        user_id=user_id,
        platform=platform,
        session_date=now.date(),
        start_time=now,
        start_mileage=start_mileage,
        notes=(
            notes.strip()
            if notes
            else None
        ),
        status="active",
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session

def get_session_by_id(
    db: Session,
    session_id: UUID,
    user_id: UUID,
) -> RiderSession | None:
    statement = (
        select(RiderSession)
        .where(
            RiderSession.id
            == session_id,
            RiderSession.user_id
            == user_id,
        )
    )

    return db.scalar(statement)

def end_session(
    db: Session,
    rider_session: RiderSession,
    request: EndSessionRequest,
) -> SessionDetailResponse:
    if rider_session.status != "active":
        raise ValueError(
            "Rider session is already completed."
        )

    calculate_distance(
        rider_session.start_mileage,
        request.end_mileage,
    )

    now = datetime.now(
        timezone.utc
    )

    rider_session.end_time = now
    rider_session.end_mileage = (
        request.end_mileage
    )
    rider_session.total_orders = (
        request.total_orders
    )
    rider_session.gross_income = (
        request.gross_income
    )
    rider_session.fuel_cost = (
        request.fuel_cost
    )
    rider_session.other_expenses = (
        request.other_expenses
    )

    if request.notes is not None:
        rider_session.notes = (
            request.notes.strip()
            or None
        )

    rider_session.status = "completed"

    db.commit()
    db.refresh(rider_session)

    return build_session_detail(
        rider_session
    )


def get_completed_sessions(
    db: Session,
    user_id: UUID,
) -> list[RiderSession]:
    statement = (
        select(RiderSession)
        .where(
            RiderSession.user_id
            == user_id,
            RiderSession.status
            == "completed",
        )
        .order_by(
            RiderSession.start_time.desc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


def build_session_detail(
    rider_session: RiderSession,
) -> SessionDetailResponse:
    if (
        rider_session.end_time
        is None
        or rider_session.end_mileage
        is None
    ):
        raise ValueError(
            "Rider session is not completed."
        )

    metrics = build_session_metrics(
        start_mileage=(
            rider_session.start_mileage
        ),
        end_mileage=(
            rider_session.end_mileage
        ),
        start_time=(
            rider_session.start_time
        ),
        end_time=(
            rider_session.end_time
        ),
        total_orders=(
            rider_session.total_orders
        ),
        gross_income=(
            rider_session.gross_income
        ),
        fuel_cost=(
            rider_session.fuel_cost
        ),
        other_expenses=(
            rider_session.other_expenses
        ),
    )

    session_data = (
        SessionResponse.model_validate(
            rider_session
        )
    )

    return SessionDetailResponse(
        **session_data.model_dump(),
        metrics=metrics,
    )