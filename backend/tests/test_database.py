from sqlalchemy import text

from app.database import engine


def test_connection():
    if engine is None:
        raise RuntimeError(
            "DATABASE_URL is not configured."
        )

    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT 1")
        )

        value = result.scalar_one()

    if value != 1:
        raise RuntimeError(
            "Unexpected database response."
        )

    print(
        "RiderJob database connection successful."
    )


if __name__ == "__main__":
    test_connection()