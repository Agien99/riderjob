import uuid
from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.api.dependencies import (
    get_current_user,
)
from app.database import get_db
from app.main import app
from app.models import (
    RiderSession,
    User,
)
from app.schemas.session import (
    EndSessionRequest,
)


client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    app.dependency_overrides.clear()

    yield

    app.dependency_overrides.clear()


def make_user():
    return User(
        id=uuid.uuid4(),
        email="rider@example.com",
        password_hash="hashed-password",
        display_name="Test Rider",
        is_active=True,
    )


def make_session(
    user_id,
):
    now = datetime.now(
        timezone.utc
    )

    return RiderSession(
        id=uuid.uuid4(),
        user_id=user_id,
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


def override_db():
    yield MagicMock()


def test_start_session_success(
    monkeypatch,
):
    user = make_user()
    rider_session = make_session(
        user.id
    )

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_active_session",
        MagicMock(
            return_value=None
        ),
    )

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "create_session",
        MagicMock(
            return_value=rider_session
        ),
    )

    response = client.post(
        "/api/sessions/start",
        json={
            "platform": "shopeefood",
            "start_mileage": "5234.00",
            "notes": (
                "Morning session"
            ),
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert (
        data["platform"]
        == "shopeefood"
    )

    assert (
        data["status"]
        == "active"
    )

    assert (
        data["start_mileage"]
        == "5234.00"
    )


def test_cannot_start_second_session(
    monkeypatch,
):
    user = make_user()
    rider_session = make_session(
        user.id
    )

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_active_session",
        MagicMock(
            return_value=rider_session
        ),
    )

    response = client.post(
        "/api/sessions/start",
        json={
            "platform": "grabfood",
            "start_mileage": "5234.00",
        },
    )

    assert response.status_code == 409

    assert response.json()[
        "detail"
    ] == (
        "You already have an "
        "active rider session."
    )


def test_invalid_platform():
    user = make_user()

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    response = client.post(
        "/api/sessions/start",
        json={
            "platform": "invalid",
            "start_mileage": "5234.00",
        },
    )

    assert response.status_code == 422


def test_start_session_requires_authentication():
    app.dependency_overrides[
        get_db
    ] = override_db

    response = client.post(
        "/api/sessions/start",
        json={
            "platform": "shopeefood",
            "start_mileage": "5234.00",
        },
    )

    assert response.status_code in (
        401,
        403,
    )

def test_get_active_session_success(
    monkeypatch,
):
    user = make_user()
    rider_session = make_session(
        user.id
    )

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_active_session",
        MagicMock(
            return_value=rider_session
        ),
    )

    response = client.get(
        "/api/sessions/active"
    )

    assert response.status_code == 200

    data = response.json()

    assert (
        data["id"]
        == str(rider_session.id)
    )

    assert (
        data["status"]
        == "active"
    )

    assert (
        data["platform"]
        == "shopeefood"
    )


def test_get_active_session_not_found(
    monkeypatch,
):
    user = make_user()

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_active_session",
        MagicMock(
            return_value=None
        ),
    )

    response = client.get(
        "/api/sessions/active"
    )

    assert response.status_code == 404

    assert response.json()[
        "detail"
    ] == (
        "No active rider session "
        "found."
    )

def test_end_session_success(
    monkeypatch,
):
    user = make_user()
    rider_session = make_session(
        user.id
    )

    completed_session = make_session(
        user.id
    )

    completed_session.id = (
        rider_session.id
    )

    completed_session.status = (
        "completed"
    )

    completed_session.end_time = (
        datetime.now(timezone.utc)
    )

    completed_session.end_mileage = (
        Decimal("5262.00")
    )

    completed_session.total_orders = 2

    completed_session.gross_income = (
        Decimal("11.91")
    )

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_session_by_id",
        MagicMock(
            return_value=rider_session
        ),
    )

    from app.schemas.session import (
        SessionDetailResponse,
        SessionMetrics,
        SessionResponse,
    )

    session_data = (
        SessionResponse.model_validate(
            completed_session
        )
    )

    result = SessionDetailResponse(
        **session_data.model_dump(),
        metrics=SessionMetrics(
            distance_km=Decimal(
                "28.00"
            ),
            duration_minutes=86,
            net_income=Decimal(
                "11.91"
            ),
            income_per_hour=Decimal(
                "8.31"
            ),
            income_per_order=Decimal(
                "5.96"
            ),
            income_per_km=Decimal(
                "0.43"
            ),
        ),
    )

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "end_session",
        MagicMock(
            return_value=result
        ),
    )

    response = client.post(
        (
            f"/api/sessions/"
            f"{rider_session.id}/end"
        ),
        json={
            "end_mileage": "5262.00",
            "total_orders": 2,
            "gross_income": "11.91",
            "fuel_cost": "0.00",
            "other_expenses": "0.00",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "completed"

    assert (
        data["metrics"]["distance_km"]
        == "28.00"
    )

    assert (
        data["metrics"][
            "income_per_hour"
        ]
        == "8.31"
    )


def test_end_session_not_found(
    monkeypatch,
):
    user = make_user()
    session_id = uuid.uuid4()

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_session_by_id",
        MagicMock(
            return_value=None
        ),
    )

    response = client.post(
        f"/api/sessions/{session_id}/end",
        json={
            "end_mileage": "5262.00",
            "total_orders": 2,
            "gross_income": "11.91",
        },
    )

    assert response.status_code == 404


def test_end_session_rejects_invalid_mileage(
    monkeypatch,
):
    user = make_user()
    rider_session = make_session(
        user.id
    )

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    app.dependency_overrides[
        get_db
    ] = override_db

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "get_session_by_id",
        MagicMock(
            return_value=rider_session
        ),
    )

    monkeypatch.setattr(
        "app.api.routers.sessions."
        "end_session",
        MagicMock(
            side_effect=ValueError(
                "End mileage cannot be "
                "lower than start mileage."
            )
        ),
    )

    response = client.post(
        (
            f"/api/sessions/"
            f"{rider_session.id}/end"
        ),
        json={
            "end_mileage": "5200.00",
            "total_orders": 2,
            "gross_income": "11.91",
        },
    )

    assert response.status_code == 400

    assert (
        "End mileage cannot be lower"
        in response.json()["detail"]
    )