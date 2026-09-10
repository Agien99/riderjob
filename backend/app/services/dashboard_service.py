from datetime import (
    date,
    datetime,
    timedelta,
    timezone,
)
from decimal import (
    Decimal,
    ROUND_HALF_UP,
)
from typing import Iterable
from uuid import UUID
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.rider_session import (
    RiderSession,
)


MALAYSIA_TIMEZONE = ZoneInfo(
    "Asia/Kuala_Lumpur"
)

TWO_DECIMAL_PLACES = Decimal(
    "0.01"
)


def round_decimal(
    value: Decimal,
) -> Decimal:
    return value.quantize(
        TWO_DECIMAL_PLACES,
        rounding=ROUND_HALF_UP,
    )


def get_malaysia_today() -> date:
    return datetime.now(
        MALAYSIA_TIMEZONE
    ).date()


def get_period_range(
    period: str,
    reference_date: date,
) -> tuple[date, date]:
    if period == "today":
        return (
            reference_date,
            reference_date,
        )

    if period == "week":
        start_date = (
            reference_date
            - timedelta(
                days=reference_date.weekday(),
            )
        )

        end_date = (
            start_date
            + timedelta(days=6)
        )

        return (
            start_date,
            end_date,
        )

    if period == "month":
        start_date = (
            reference_date.replace(
                day=1,
            )
        )

        if reference_date.month == 12:
            next_month = date(
                reference_date.year + 1,
                1,
                1,
            )
        else:
            next_month = date(
                reference_date.year,
                reference_date.month + 1,
                1,
            )

        end_date = (
            next_month
            - timedelta(days=1)
        )

        return (
            start_date,
            end_date,
        )

    raise ValueError(
        "Invalid dashboard period."
    )


def calculate_session_distance(
    rider_session: RiderSession,
) -> Decimal:
    if (
        rider_session.start_mileage
        is None
        or rider_session.end_mileage
        is None
    ):
        return Decimal("0")

    distance = (
        Decimal(
            str(
                rider_session.end_mileage
            )
        )
        - Decimal(
            str(
                rider_session.start_mileage
            )
        )
    )

    if distance < 0:
        return Decimal("0")

    return distance


def calculate_session_duration_hours(
    rider_session: RiderSession,
) -> Decimal:
    if (
        rider_session.start_time
        is None
        or rider_session.end_time
        is None
    ):
        return Decimal("0")

    duration = (
        rider_session.end_time
        - rider_session.start_time
    )

    seconds = Decimal(
        str(
            duration.total_seconds()
        )
    )

    if seconds <= 0:
        return Decimal("0")

    return (
        seconds
        / Decimal("3600")
    )


def calculate_session_net_income(
    rider_session: RiderSession,
) -> Decimal:
    gross_income = Decimal(
        str(
            rider_session.gross_income
            or 0
        )
    )

    fuel_cost = Decimal(
        str(
            rider_session.fuel_cost
            or 0
        )
    )

    other_expenses = Decimal(
        str(
            rider_session.other_expenses
            or 0
        )
    )

    return (
        gross_income
        - fuel_cost
        - other_expenses
    )


def calculate_dashboard_metrics(
    sessions: Iterable[
        RiderSession
    ],
) -> dict:
    sessions = list(sessions)

    gross_income = sum(
        (
            Decimal(
                str(
                    session.gross_income
                    or 0
                )
            )
            for session in sessions
        ),
        Decimal("0"),
    )

    fuel_cost = sum(
        (
            Decimal(
                str(
                    session.fuel_cost
                    or 0
                )
            )
            for session in sessions
        ),
        Decimal("0"),
    )

    other_expenses = sum(
        (
            Decimal(
                str(
                    session.other_expenses
                    or 0
                )
            )
            for session in sessions
        ),
        Decimal("0"),
    )

    net_income = (
        gross_income
        - fuel_cost
        - other_expenses
    )

    total_orders = sum(
        int(
            session.total_orders
            or 0
        )
        for session in sessions
    )

    total_distance = sum(
        (
            calculate_session_distance(
                session
            )
            for session in sessions
        ),
        Decimal("0"),
    )

    total_hours = sum(
        (
            calculate_session_duration_hours(
                session
            )
            for session in sessions
        ),
        Decimal("0"),
    )

    income_per_hour = None

    if total_hours > 0:
        income_per_hour = (
            net_income
            / total_hours
        )

    income_per_order = None

    if total_orders > 0:
        income_per_order = (
            net_income
            / Decimal(total_orders)
        )

    income_per_km = None

    if total_distance > 0:
        income_per_km = (
            net_income
            / total_distance
        )

    return {
        "total_sessions":
            len(sessions),

        "gross_income":
            round_decimal(
                gross_income
            ),

        "fuel_cost":
            round_decimal(
                fuel_cost
            ),

        "other_expenses":
            round_decimal(
                other_expenses
            ),

        "net_income":
            round_decimal(
                net_income
            ),

        "total_orders":
            total_orders,

        "total_distance_km":
            round_decimal(
                total_distance
            ),

        "total_hours":
            round_decimal(
                total_hours
            ),

        "income_per_hour":
            (
                round_decimal(
                    income_per_hour
                )
                if income_per_hour
                is not None
                else None
            ),

        "income_per_order":
            (
                round_decimal(
                    income_per_order
                )
                if income_per_order
                is not None
                else None
            ),

        "income_per_km":
            (
                round_decimal(
                    income_per_km
                )
                if income_per_km
                is not None
                else None
            ),
    }


def calculate_platform_summary(
    sessions: Iterable[
        RiderSession
    ],
) -> list[dict]:
    sessions = list(sessions)

    platforms = [
        "shopeefood",
        "grabfood",
        "lalamove",
    ]

    result = []

    for platform in platforms:
        platform_sessions = [
            session
            for session in sessions
            if (
                session.platform
                == platform
            )
        ]

        metrics = (
            calculate_dashboard_metrics(
                platform_sessions
            )
        )

        result.append({
            "platform":
                platform,

            "total_sessions":
                metrics[
                    "total_sessions"
                ],

            "total_orders":
                metrics[
                    "total_orders"
                ],

            "gross_income":
                metrics[
                    "gross_income"
                ],

            "net_income":
                metrics[
                    "net_income"
                ],
        })

    return result


def serialize_recent_session(
    rider_session: RiderSession,
) -> dict:
    return {
        "id":
            rider_session.id,

        "session_date":
            rider_session.session_date,

        "platform":
            rider_session.platform,

        "start_time":
            rider_session.start_time,

        "end_time":
            rider_session.end_time,

        "total_orders":
            rider_session.total_orders,

        "gross_income":
            round_decimal(
                Decimal(
                    str(
                        rider_session
                        .gross_income
                        or 0
                    )
                )
            ),

        "net_income":
            round_decimal(
                calculate_session_net_income(
                    rider_session
                )
            ),
    }


def get_completed_sessions(
    db: Session,
    user_id: UUID,
    start_date: date,
    end_date: date,
) -> list[RiderSession]:
    statement = (
        select(RiderSession)
        .where(
            RiderSession.user_id
            == user_id,
            RiderSession.status
            == "completed",
            RiderSession.session_date
            >= start_date,
            RiderSession.session_date
            <= end_date,
        )
        .order_by(
            RiderSession.session_date.desc(),
            RiderSession.end_time.desc(),
        )
    )

    return list(
        db.scalars(statement).all()
    )


def get_recent_completed_sessions(
    db: Session,
    user_id: UUID,
    limit: int = 5,
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
            RiderSession.session_date.desc(),
            RiderSession.end_time.desc(),
        )
        .limit(limit)
    )

    return list(
        db.scalars(statement).all()
    )


def build_dashboard(
    db: Session,
    user_id: UUID,
    period: str,
    reference_date: date | None = None,
) -> dict:
    if reference_date is None:
        reference_date = (
            get_malaysia_today()
        )

    start_date, end_date = (
        get_period_range(
            period,
            reference_date,
        )
    )

    period_sessions = (
        get_completed_sessions(
            db=db,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )
    )

    recent_sessions = (
        get_recent_completed_sessions(
            db=db,
            user_id=user_id,
            limit=5,
        )
    )

    metrics = (
        calculate_dashboard_metrics(
            period_sessions
        )
    )

    platform_summary = (
        calculate_platform_summary(
            period_sessions
        )
    )

    return {
        "period":
            period,

        "start_date":
            start_date,

        "end_date":
            end_date,

        "metrics":
            metrics,

        "platform_summary":
            platform_summary,

        "recent_sessions": [
            serialize_recent_session(
                session
            )
            for session
            in recent_sessions
        ],
    }