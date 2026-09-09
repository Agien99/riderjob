import uuid
from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from app.models import RiderSession
from app.schemas.session import (
    EndSessionRequest,
)
from app.services.session_service import (
    build_session_detail,
    create_session,
    end_session,
    get_active_session,
    get_completed_sessions,
    get_session_by_id,
)


def make_db():
    db = MagicMock()
    db.scalar.return_value = None
    return db


def make_active_session():
    now = datetime.now(
        timezone.utc
    )

    return RiderSession(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        platform="shopeefood",
        session_date=now.date(),
        start_time=now,
        start_mileage=Decimal(
            "5234.00"
        ),
        total_orders=0,
        gross_income=Decimal(
            "0.00"
        ),
        fuel_cost=Decimal(
            "0.00"
        ),
        other_expenses=Decimal(
            "0.00"
        ),
        status="active",
        created_at=now,
        updated_at=now,
    )


def test_create_session():
    db = make_db()
    user_id = uuid.uuid4()

    created = RiderSession(
        id=uuid.uuid4(),
        user_id=user_id,
        platform="grabfood",
        session_date=datetime.now(
            timezone.utc
        ).date(),
        start_time=datetime.now(
            timezone.utc
        ),
        start_mileage=Decimal(
            "1000.00"
        ),
        total_orders=0,
        gross_income=Decimal(
            "0.00"
        ),
        fuel_cost=Decimal(
            "0.00"
        ),
        other_expenses=Decimal(
            "0.00"
        ),
        notes="Evening ride",
        status="active",
        created_at=datetime.now(
            timezone.utc
        ),
        updated_at=datetime.now(
            timezone.utc
        ),
    )

    def refresh_side_effect(obj):
        obj.id = created.id
        obj.created_at = (
            created.created_at
        )
        obj.updated_at = (
            created.updated_at
        )

    db.refresh.side_effect = (
        refresh_side_effect
    )

    result = create_session(
        db=db,
        user_id=user_id,
        platform="grabfood",
        start_mileage=Decimal(
            "1000.00"
        ),
        notes="  Evening ride  ",
    )

    assert result.user_id == user_id

    assert (
        result.platform
        == "grabfood"
    )

    assert (
        result.start_mileage
        == Decimal("1000.00")
    )

    assert result.status == "active"

    assert (
        result.notes
        == "Evening ride"
    )

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


def test_get_active_session_returns_scalar():
    db = make_db()
    user_id = uuid.uuid4()

    rider_session = (
        make_active_session()
    )

    rider_session.user_id = (
        user_id
    )

    db.scalar.return_value = (
        rider_session
    )

    result = get_active_session(
        db,
        user_id,
    )

    assert result is rider_session

    db.scalar.assert_called_once()


def test_get_session_by_id_returns_scalar():
    db = make_db()

    rider_session = (
        make_active_session()
    )

    db.scalar.return_value = (
        rider_session
    )

    result = get_session_by_id(
        db=db,
        session_id=(
            rider_session.id
        ),
        user_id=(
            rider_session.user_id
        ),
    )

    assert result is rider_session

    db.scalar.assert_called_once()


def test_get_completed_sessions():
    db = make_db()
    user_id = uuid.uuid4()

    first_session = (
        make_active_session()
    )

    second_session = (
        make_active_session()
    )

    first_session.user_id = user_id
    second_session.user_id = user_id

    first_session.status = (
        "completed"
    )

    second_session.status = (
        "completed"
    )

    db.scalars.return_value.all.return_value = [
        first_session,
        second_session,
    ]

    result = get_completed_sessions(
        db,
        user_id,
    )

    assert result == [
        first_session,
        second_session,
    ]

    db.scalars.assert_called_once()


def test_build_session_detail():
    rider_session = (
        make_active_session()
    )

    rider_session.status = (
        "completed"
    )

    rider_session.start_time = (
        datetime(
            2026,
            8,
            16,
            9,
            10,
            tzinfo=timezone.utc,
        )
    )

    rider_session.end_time = (
        datetime(
            2026,
            8,
            16,
            10,
            36,
            tzinfo=timezone.utc,
        )
    )

    rider_session.end_mileage = (
        Decimal("5262.00")
    )

    rider_session.total_orders = 2

    rider_session.gross_income = (
        Decimal("11.91")
    )

    rider_session.fuel_cost = (
        Decimal("0.00")
    )

    rider_session.other_expenses = (
        Decimal("0.00")
    )

    result = build_session_detail(
        rider_session
    )

    assert (
        result.metrics.distance_km
        == Decimal("28.00")
    )

    assert (
        result.metrics.duration_minutes
        == 86
    )

    assert (
        result.metrics.net_income
        == Decimal("11.91")
    )

    assert (
        result.metrics.income_per_hour
        == Decimal("8.31")
    )

    assert (
        result.metrics.income_per_order
        == Decimal("5.96")
    )

    assert (
        result.metrics.income_per_km
        == Decimal("0.43")
    )


def test_build_session_detail_rejects_active_session():
    rider_session = (
        make_active_session()
    )

    with pytest.raises(
        ValueError,
        match=(
            "Rider session is "
            "not completed."
        ),
    ):
        build_session_detail(
            rider_session
        )


def test_end_session_success():
    db = make_db()

    rider_session = (
        make_active_session()
    )

    rider_session.start_time = (
        datetime(
            2026,
            8,
            16,
            9,
            10,
            tzinfo=timezone.utc,
        )
    )

    request = EndSessionRequest(
        end_mileage=Decimal(
            "5262.00"
        ),
        total_orders=2,
        gross_income=Decimal(
            "11.91"
        ),
        fuel_cost=Decimal(
            "0.00"
        ),
        other_expenses=Decimal(
            "0.00"
        ),
        notes="Morning complete",
    )

    result = end_session(
        db=db,
        rider_session=(
            rider_session
        ),
        request=request,
    )

    assert (
        rider_session.status
        == "completed"
    )

    assert (
        rider_session.end_mileage
        == Decimal("5262.00")
    )

    assert (
        rider_session.total_orders
        == 2
    )

    assert (
        rider_session.gross_income
        == Decimal("11.91")
    )

    assert (
        rider_session.notes
        == "Morning complete"
    )

    assert (
        result.metrics.distance_km
        == Decimal("28.00")
    )

    assert (
        result.metrics.net_income
        == Decimal("11.91")
    )

    db.commit.assert_called_once()
    db.refresh.assert_called_once()


def test_end_session_rejects_completed_session():
    db = make_db()

    rider_session = (
        make_active_session()
    )

    rider_session.status = (
        "completed"
    )

    request = EndSessionRequest(
        end_mileage=Decimal(
            "5262.00"
        ),
        total_orders=2,
        gross_income=Decimal(
            "11.91"
        ),
    )

    with pytest.raises(
        ValueError,
        match=(
            "Rider session is "
            "already completed."
        ),
    ):
        end_session(
            db=db,
            rider_session=(
                rider_session
            ),
            request=request,
        )

    db.commit.assert_not_called()


def test_end_session_rejects_lower_mileage():
    db = make_db()

    rider_session = (
        make_active_session()
    )

    request = EndSessionRequest(
        end_mileage=Decimal(
            "5200.00"
        ),
        total_orders=2,
        gross_income=Decimal(
            "11.91"
        ),
    )

    with pytest.raises(
        ValueError,
        match=(
            "End mileage cannot "
            "be lower"
        ),
    ):
        end_session(
            db=db,
            rider_session=(
                rider_session
            ),
            request=request,
        )

    db.commit.assert_not_called()


def test_end_session_preserves_notes_when_missing():
    db = make_db()

    rider_session = (
        make_active_session()
    )

    rider_session.notes = (
        "Started after lunch"
    )

    request = EndSessionRequest(
        end_mileage=Decimal(
            "5262.00"
        ),
        total_orders=2,
        gross_income=Decimal(
            "11.91"
        ),
        notes=None,
    )

    end_session(
        db=db,
        rider_session=(
            rider_session
        ),
        request=request,
    )

    assert (
        rider_session.notes
        == "Started after lunch"
    )