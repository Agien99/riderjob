import jwt

from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hashing():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(
        password,
        hashed,
    )


def test_wrong_password_fails():
    hashed = hash_password(
        "CorrectPassword123!"
    )

    assert not verify_password(
        "WrongPassword123!",
        hashed,
    )


def test_access_token():
    user_id = "test-user-id"

    token = create_access_token(
        user_id
    )

    payload = decode_access_token(
        token
    )

    assert payload["sub"] == user_id
    assert "exp" in payload


def test_invalid_token_fails():
    try:
        decode_access_token(
            "this-is-not-a-valid-token"
        )
    except jwt.InvalidTokenError:
        return

    raise AssertionError(
        "Invalid token should not decode."
    )