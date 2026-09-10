import os
import uuid
from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import engine
from app.models import (
    RiderSession,
    User,
)


MALAYSIA_TZ = ZoneInfo(
    "Asia/Kuala_Lumpur"
)


def malaysia_to_utc(
    year,
    month,
    day,
    hour,
    minute,
):
    local_time = datetime(
        year,
        month,
        day,
        hour,
        minute,
        tzinfo=MALAYSIA_TZ,
    )

    return local_time.astimezone(
        timezone.utc
    )


SESSION_DATA = [
    {
        "platform": "lalamove",
        "session_date": datetime(
            2026, 8, 15
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 8, 15, 8, 15
        ),
        "end_time": malaysia_to_utc(
            2026, 8, 15, 11, 20
        ),
        "start_mileage": Decimal(
            "5086.00"
        ),
        "end_mileage": Decimal(
            "5183.00"
        ),
        "total_orders": 3,
        "gross_income": Decimal(
            "39.76"
        ),
        "fuel_cost": Decimal(
            "0.00"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
    {
        "platform": "shopeefood",
        "session_date": datetime(
            2026, 8, 15
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 8, 15, 19, 30
        ),
        "end_time": malaysia_to_utc(
            2026, 8, 15, 22, 0
        ),
        "start_mileage": Decimal(
            "5183.00"
        ),
        "end_mileage": Decimal(
            "5234.00"
        ),
        "total_orders": 5,
        "gross_income": Decimal(
            "32.65"
        ),
        "fuel_cost": Decimal(
            "14.51"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
    {
        "platform": "shopeefood",
        "session_date": datetime(
            2026, 8, 16
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 8, 16, 9, 10
        ),
        "end_time": malaysia_to_utc(
            2026, 8, 16, 10, 36
        ),
        "start_mileage": Decimal(
            "5234.00"
        ),
        "end_mileage": Decimal(
            "5262.00"
        ),
        "total_orders": 2,
        "gross_income": Decimal(
            "11.91"
        ),
        "fuel_cost": Decimal(
            "0.00"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
    {
        "platform": "shopeefood",
        "session_date": datetime(
            2026, 9, 2
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 9, 2, 18, 45
        ),
        "end_time": malaysia_to_utc(
            2026, 9, 2, 21, 11
        ),
        "start_mileage": Decimal(
            "5426.00"
        ),
        "end_mileage": Decimal(
            "5457.00"
        ),
        "total_orders": 3,
        "gross_income": Decimal(
            "20.47"
        ),
        "fuel_cost": Decimal(
            "0.00"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
    {
        "platform": "shopeefood",
        "session_date": datetime(
            2026, 9, 4
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 9, 4, 19, 15
        ),
        "end_time": malaysia_to_utc(
            2026, 9, 4, 20, 55
        ),
        "start_mileage": Decimal(
            "5519.00"
        ),
        "end_mileage": Decimal(
            "5546.00"
        ),
        "total_orders": 3,
        "gross_income": Decimal(
            "22.69"
        ),
        "fuel_cost": Decimal(
            "0.00"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
    {
        "platform": "shopeefood",
        "session_date": datetime(
            2026, 9, 8
        ).date(),
        "start_time": malaysia_to_utc(
            2026, 9, 8, 19, 20
        ),
        "end_time": malaysia_to_utc(
            2026, 9, 8, 21, 10
        ),
        "start_mileage": Decimal(
            "5647.00"
        ),
        "end_mileage": Decimal(
            "5674.00"
        ),
        "total_orders": 3,
        "gross_income": Decimal(
            "18.21"
        ),
        "fuel_cost": Decimal(
            "0.00"
        ),
        "other_expenses": Decimal(
            "0.00"
        ),
    },
]


def main():
    user_email = os.getenv(
        "IMPORT_USER_EMAIL"
    )

    if not user_email:
        raise ValueError(
            "IMPORT_USER_EMAIL is required."
        )

    now = datetime.now(
        timezone.utc
    )

    with Session(engine) as db:
        user = db.scalar(
            select(User).where(
                User.email == user_email
            )
        )

        if user is None:
            raise ValueError(
                "RiderJob user was not found."
            )

        inserted = 0
        skipped = 0

        for data in SESSION_DATA:
            existing = db.scalar(
                select(
                    RiderSession
                ).where(
                    RiderSession.user_id
                    == user.id,
                    RiderSession.platform
                    == data[
                        "platform"
                    ],
                    RiderSession.session_date
                    == data[
                        "session_date"
                    ],
                    RiderSession.start_time
                    == data[
                        "start_time"
                    ],
                )
            )

            if existing:
                print(
                    "Skipping existing:",
                    data[
                        "session_date"
                    ],
                    data[
                        "platform"
                    ],
                )

                skipped += 1
                continue

            rider_session = RiderSession(
                id=uuid.uuid4(),
                user_id=user.id,
                platform=data[
                    "platform"
                ],
                session_date=data[
                    "session_date"
                ],
                start_time=data[
                    "start_time"
                ],
                end_time=data[
                    "end_time"
                ],
                start_mileage=data[
                    "start_mileage"
                ],
                end_mileage=data[
                    "end_mileage"
                ],
                total_orders=data[
                    "total_orders"
                ],
                gross_income=data[
                    "gross_income"
                ],
                fuel_cost=data[
                    "fuel_cost"
                ],
                other_expenses=data[
                    "other_expenses"
                ],
                notes=(
                    "Historical rider "
                    "record import"
                ),
                status="completed",
                created_at=now,
                updated_at=now,
            )

            db.add(
                rider_session
            )

            inserted += 1

        db.commit()

        print(
            f"Inserted: {inserted}"
        )

        print(
            f"Skipped: {skipped}"
        )


if __name__ == "__main__":
    main()