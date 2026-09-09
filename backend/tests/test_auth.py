import uuid
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.api.dependencies import get_current_user
from app.database import get_db
from app.main import app
from app.models import User


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


def override_db():
    db = MagicMock()

    try:
        yield db
    finally:
        pass


def test_register_success(monkeypatch):
    user = make_user()

    monkeypatch.setattr(
        "app.api.routers.auth.get_user_by_email",
        MagicMock(return_value=None),
    )

    monkeypatch.setattr(
        "app.api.routers.auth.create_user",
        MagicMock(return_value=user),
    )

    app.dependency_overrides[get_db] = override_db

    response = client.post(
        "/api/auth/register",
        json={
            "email": "rider@example.com",
            "password": "Password123!",
            "display_name": "Test Rider",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201

    data = response.json()

    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "rider@example.com"
    assert data["user"]["display_name"] == "Test Rider"


def test_register_duplicate_email(monkeypatch):
    user = make_user()

    monkeypatch.setattr(
        "app.api.routers.auth.get_user_by_email",
        MagicMock(return_value=user),
    )

    app.dependency_overrides[get_db] = override_db

    response = client.post(
        "/api/auth/register",
        json={
            "email": "rider@example.com",
            "password": "Password123!",
            "display_name": "Test Rider",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 409

    assert response.json()["detail"] == (
        "An account with this email already exists."
    )


def test_login_success(monkeypatch):
    user = make_user()

    monkeypatch.setattr(
        "app.api.routers.auth.authenticate_user",
        MagicMock(return_value=user),
    )

    app.dependency_overrides[get_db] = override_db

    response = client.post(
        "/api/auth/login",
        json={
            "email": "rider@example.com",
            "password": "Password123!",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "rider@example.com"


def test_login_invalid_credentials(monkeypatch):
    monkeypatch.setattr(
        "app.api.routers.auth.authenticate_user",
        MagicMock(return_value=None),
    )

    app.dependency_overrides[get_db] = override_db

    response = client.post(
        "/api/auth/login",
        json={
            "email": "rider@example.com",
            "password": "WrongPassword",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 401

    assert response.json()["detail"] == (
        "Invalid email or password."
    )


def test_get_me():
    user = make_user()

    app.dependency_overrides[
        get_current_user
    ] = lambda: user

    response = client.get(
        "/api/auth/me"
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(user.id)
    assert data["email"] == user.email
    assert data["display_name"] == user.display_name
    assert data["is_active"] is True