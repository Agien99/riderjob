from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RiderSession


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