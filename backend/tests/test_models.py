from app.models import RiderSession, User


def test_user_model_table_name():
    assert User.__tablename__ == "users"


def test_rider_session_model_table_name():
    assert RiderSession.__tablename__ == "rider_sessions"