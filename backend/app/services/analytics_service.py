from collections import defaultdict
from datetime import (
    date,
    timedelta,
)
from decimal import Decimal
from typing import Iterable
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.rider_session import (
    RiderSession,
)
from app.services.dashboard_service import (
    calculate_dashboard_metrics,
    calculate_session_distance,
    calculate_session_duration_hours,
    calculate_session_net_income,
    get_malaysia_today,
    round_decimal,
)


PLATFORMS = [
    "shopeefood",
    "grabfood",
    "lalamove",
]

WEEKDAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]


def get_analytics_period_range(
    period: str,
    reference_date: date,
) -> tuple[
    date | None,
    date,
]:
    if period == "7d":
        return (
            reference_date
            - timedelta(days=6),
            reference_date,
        )

    if period == "30d":
        return (
            reference_date
            - timedelta(days=29),
            reference_date,
        )

    if period == "month":
        return (
            reference_date.replace(
                day=1,
            ),
            reference_date,
        )

    if period == "3m":
        return (
            reference_date
            - timedelta(days=89),
            reference_date,
        )

    if period == "all":
        return (
            None,
            reference_date,
        )

    raise ValueError(
        "Invalid analytics period."
    )


def get_analytics_sessions(
    db: Session,
    user_id: UUID,
    start_date: date | None,
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
            <= end_date,
        )
        .order_by(
            RiderSession.session_date.asc(),
            RiderSession.start_time.asc(),
        )
    )

    if start_date is not None:
        statement = statement.where(
            RiderSession.session_date
            >= start_date
        )

    return list(
        db.scalars(statement).all()
    )


def calculate_analytics_summary(
    sessions: Iterable[
        RiderSession
    ],
) -> dict:
    sessions = list(sessions)

    metrics = (
        calculate_dashboard_metrics(
            sessions
        )
    )

    total_expenses = (
        metrics["fuel_cost"]
        + metrics["other_expenses"]
    )

    expense_ratio = None

    if metrics["gross_income"] > 0:
        expense_ratio = (
            total_expenses
            / metrics["gross_income"]
            * Decimal("100")
        )

    return {
        **metrics,

        "total_expenses":
            round_decimal(
                total_expenses
            ),

        "expense_ratio":
            (
                round_decimal(
                    expense_ratio
                )
                if expense_ratio
                is not None
                else None
            ),
    }


def build_daily_trend(
    sessions: Iterable[
        RiderSession
    ],
) -> list[dict]:
    sessions = list(sessions)

    grouped = defaultdict(
        lambda: {
            "gross_income":
                Decimal("0"),

            "net_income":
                Decimal("0"),

            "orders":
                0,

            "hours":
                Decimal("0"),
        }
    )

    for rider_session in sessions:
        session_date = (
            rider_session.session_date
        )

        gross_income = Decimal(
            str(
                rider_session.gross_income
                or 0
            )
        )

        net_income = (
            calculate_session_net_income(
                rider_session
            )
        )

        duration_hours = (
            calculate_session_duration_hours(
                rider_session
            )
        )

        grouped[
            session_date
        ]["gross_income"] += (
            gross_income
        )

        grouped[
            session_date
        ]["net_income"] += (
            net_income
        )

        grouped[
            session_date
        ]["orders"] += int(
            rider_session.total_orders
            or 0
        )

        grouped[
            session_date
        ]["hours"] += (
            duration_hours
        )

    result = []

    for session_date in sorted(
        grouped.keys()
    ):
        values = grouped[
            session_date
        ]

        result.append({
            "date":
                session_date,

            "gross_income":
                round_decimal(
                    values[
                        "gross_income"
                    ]
                ),

            "net_income":
                round_decimal(
                    values[
                        "net_income"
                    ]
                ),

            "orders":
                values["orders"],

            "total_hours":
                round_decimal(
                    values["hours"]
                ),
        })

    return result


def build_platform_summary(
    sessions: Iterable[
        RiderSession
    ],
) -> list[dict]:
    sessions = list(sessions)

    result = []

    for platform in PLATFORMS:
        platform_sessions = [
            rider_session
            for rider_session
            in sessions
            if (
                rider_session.platform
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

            "fuel_cost":
                metrics[
                    "fuel_cost"
                ],

            "other_expenses":
                metrics[
                    "other_expenses"
                ],

            "net_income":
                metrics[
                    "net_income"
                ],

            "total_distance_km":
                metrics[
                    "total_distance_km"
                ],

            "total_hours":
                metrics[
                    "total_hours"
                ],

            "income_per_hour":
                metrics[
                    "income_per_hour"
                ],

            "income_per_order":
                metrics[
                    "income_per_order"
                ],

            "income_per_km":
                metrics[
                    "income_per_km"
                ],
        })

    return result


def build_weekday_summary(
    sessions: Iterable[
        RiderSession
    ],
) -> list[dict]:
    sessions = list(sessions)

    grouped = {
        weekday: []
        for weekday in WEEKDAYS
    }

    for rider_session in sessions:
        weekday = (
            rider_session
            .session_date
            .strftime("%A")
        )

        grouped[
            weekday
        ].append(
            rider_session
        )

    result = []

    for weekday in WEEKDAYS:
        weekday_sessions = (
            grouped[weekday]
        )

        metrics = (
            calculate_dashboard_metrics(
                weekday_sessions
            )
        )

        average_net_income = None

        if (
            metrics[
                "total_sessions"
            ]
            > 0
        ):
            average_net_income = (
                metrics[
                    "net_income"
                ]
                / Decimal(
                    metrics[
                        "total_sessions"
                    ]
                )
            )

        result.append({
            "weekday":
                weekday,

            "total_sessions":
                metrics[
                    "total_sessions"
                ],

            "total_orders":
                metrics[
                    "total_orders"
                ],

            "net_income":
                metrics[
                    "net_income"
                ],

            "average_net_income":
                (
                    round_decimal(
                        average_net_income
                    )
                    if average_net_income
                    is not None
                    else None
                ),

            "total_hours":
                metrics[
                    "total_hours"
                ],

            "income_per_hour":
                metrics[
                    "income_per_hour"
                ],
        })

    return result


def find_best_earning_day(
    daily_trend: list[dict],
) -> dict | None:
    if not daily_trend:
        return None

    best_day = max(
        daily_trend,
        key=lambda item: (
            item["net_income"]
        ),
    )

    return {
        "date":
            best_day["date"],

        "value":
            best_day[
                "net_income"
            ],
    }


def find_best_efficiency_day(
    daily_trend: list[dict],
) -> dict | None:
    qualified_days = []

    for item in daily_trend:
        total_hours = item[
            "total_hours"
        ]

        if total_hours < Decimal(
            "1"
        ):
            continue

        income_per_hour = (
            item["net_income"]
            / total_hours
        )

        qualified_days.append({
            "date":
                item["date"],

            "value":
                round_decimal(
                    income_per_hour
                ),
        })

    if not qualified_days:
        return None

    return max(
        qualified_days,
        key=lambda item: (
            item["value"]
        ),
    )


def find_best_platform_net(
    platform_summary: list[dict],
) -> dict | None:
    active_platforms = [
        item
        for item in platform_summary
        if item[
            "total_sessions"
        ] > 0
    ]

    if not active_platforms:
        return None

    best_platform = max(
        active_platforms,
        key=lambda item: (
            item["net_income"]
        ),
    )

    return {
        "platform":
            best_platform[
                "platform"
            ],

        "value":
            best_platform[
                "net_income"
            ],
    }


def find_best_platform_efficiency(
    platform_summary: list[dict],
) -> dict | None:
    qualified_platforms = [
        item
        for item in platform_summary
        if (
            item[
                "income_per_hour"
            ]
            is not None
        )
    ]

    if not qualified_platforms:
        return None

    best_platform = max(
        qualified_platforms,
        key=lambda item: (
            item[
                "income_per_hour"
            ]
        ),
    )

    return {
        "platform":
            best_platform[
                "platform"
            ],

        "value":
            best_platform[
                "income_per_hour"
            ],
    }


def build_analytics(
    db: Session,
    user_id: UUID,
    period: str,
    reference_date: date | None = None,
) -> dict:
    if reference_date is None:
        reference_date = (
            get_malaysia_today()
        )

    (
        query_start_date,
        end_date,
    ) = get_analytics_period_range(
        period,
        reference_date,
    )

    sessions = (
        get_analytics_sessions(
            db=db,
            user_id=user_id,
            start_date=query_start_date,
            end_date=end_date,
        )
    )

    response_start_date = (
        query_start_date
    )

    if (
        period == "all"
        and sessions
    ):
        response_start_date = min(
            rider_session.session_date
            for rider_session
            in sessions
        )

    if response_start_date is None:
        response_start_date = (
            reference_date
        )

    summary = (
        calculate_analytics_summary(
            sessions
        )
    )

    daily_trend = (
        build_daily_trend(
            sessions
        )
    )

    platform_summary = (
        build_platform_summary(
            sessions
        )
    )

    weekday_summary = (
        build_weekday_summary(
            sessions
        )
    )

    return {
        "period":
            period,

        "start_date":
            response_start_date,

        "end_date":
            end_date,

        "summary":
            summary,

        "earnings_trend": [
            {
                "date":
                    item["date"],

                "gross_income":
                    item[
                        "gross_income"
                    ],

                "net_income":
                    item[
                        "net_income"
                    ],
            }
            for item in daily_trend
        ],

        "orders_trend": [
            {
                "date":
                    item["date"],

                "orders":
                    item["orders"],
            }
            for item in daily_trend
        ],

        "platform_summary":
            platform_summary,

        "weekday_summary":
            weekday_summary,

        "highlights": {
            "best_earning_day":
                find_best_earning_day(
                    daily_trend
                ),

            "best_efficiency_day":
                find_best_efficiency_day(
                    daily_trend
                ),

            "best_platform_net":
                find_best_platform_net(
                    platform_summary
                ),

            "best_platform_efficiency":
                find_best_platform_efficiency(
                    platform_summary
                ),
        },
    }