from datetime import (
    date,
    datetime,
    timezone,
)
from decimal import Decimal
from types import SimpleNamespace

import pytest

from app.services.dashboard_service import (
    calculate_dashboard_metrics,
    calculate_platform_summary,
    calculate_session_distance,
    calculate_session_duration_hours,
    calculate_session_net_income,
    get_period_range,
)


def make_session(
    *,
    platform="shopeefood",
    start_mileage=100,
    end_mileage=120,
    total_orders=4,
    gross_income=40,
    fuel_cost=5,
    other_expenses=2,
    start_time=None,
    end_time=None,
):
    if start_time is None:
        start_time = datetime(
            2026,
            9,
            10,
            8,
            0,
            tzinfo=timezone.utc,
        )

    if end_time is None:
        end_time = datetime(
            2026,
            9,
            10,
            10,
            0,
            tzinfo=timezone.utc,
        )

    return SimpleNamespace(
        platform=platform,

        start_mileage=Decimal(
            str(start_mileage)
        ),

        end_mileage=Decimal(
            str(end_mileage)
        ),

        total_orders=total_orders,

        gross_income=Decimal(
            str(gross_income)
        ),

        fuel_cost=Decimal(
            str(fuel_cost)
        ),

        other_expenses=Decimal(
            str(other_expenses)
        ),

        start_time=start_time,
        end_time=end_time,
    )


def test_today_period_range():
    reference_date = date(
        2026,
        9,
        10,
    )

    start_date, end_date = (
        get_period_range(
            "today",
            reference_date,
        )
    )

    assert start_date == date(
        2026,
        9,
        10,
    )

    assert end_date == date(
        2026,
        9,
        10,
    )


def test_week_period_range():
    reference_date = date(
        2026,
        9,
        10,
    )

    start_date, end_date = (
        get_period_range(
            "week",
            reference_date,
        )
    )

    assert start_date == date(
        2026,
        9,
        7,
    )

    assert end_date == date(
        2026,
        9,
        13,
    )


def test_month_period_range():
    reference_date = date(
        2026,
        9,
        10,
    )

    start_date, end_date = (
        get_period_range(
            "month",
            reference_date,
        )
    )

    assert start_date == date(
        2026,
        9,
        1,
    )

    assert end_date == date(
        2026,
        9,
        30,
    )


def test_december_month_range():
    reference_date = date(
        2026,
        12,
        15,
    )

    start_date, end_date = (
        get_period_range(
            "month",
            reference_date,
        )
    )

    assert start_date == date(
        2026,
        12,
        1,
    )

    assert end_date == date(
        2026,
        12,
        31,
    )


def test_invalid_period():
    with pytest.raises(
        ValueError
    ):
        get_period_range(
            "year",
            date(
                2026,
                9,
                10,
            ),
        )


def test_session_distance():
    session = make_session(
        start_mileage=100,
        end_mileage=125.5,
    )

    result = (
        calculate_session_distance(
            session
        )
    )

    assert result == Decimal(
        "25.5"
    )


def test_negative_distance_returns_zero():
    session = make_session(
        start_mileage=120,
        end_mileage=100,
    )

    result = (
        calculate_session_distance(
            session
        )
    )

    assert result == Decimal("0")


def test_session_duration_hours():
    session = make_session(
        start_time=datetime(
            2026,
            9,
            10,
            8,
            0,
            tzinfo=timezone.utc,
        ),
        end_time=datetime(
            2026,
            9,
            10,
            10,
            30,
            tzinfo=timezone.utc,
        ),
    )

    result = (
        calculate_session_duration_hours(
            session
        )
    )

    assert result == Decimal(
        "2.5"
    )


def test_session_net_income():
    session = make_session(
        gross_income=50,
        fuel_cost=8,
        other_expenses=2,
    )

    result = (
        calculate_session_net_income(
            session
        )
    )

    assert result == Decimal(
        "40"
    )


def test_dashboard_metrics():
    first_session = make_session(
        start_mileage=100,
        end_mileage=120,
        total_orders=4,
        gross_income=40,
        fuel_cost=5,
        other_expenses=0,
    )

    second_session = make_session(
        start_mileage=120,
        end_mileage=150,
        total_orders=6,
        gross_income=60,
        fuel_cost=5,
        other_expenses=5,
    )

    metrics = (
        calculate_dashboard_metrics(
            [
                first_session,
                second_session,
            ]
        )
    )

    assert (
        metrics[
            "total_sessions"
        ]
        == 2
    )

    assert (
        metrics[
            "gross_income"
        ]
        == Decimal("100.00")
    )

    assert (
        metrics[
            "fuel_cost"
        ]
        == Decimal("10.00")
    )

    assert (
        metrics[
            "other_expenses"
        ]
        == Decimal("5.00")
    )

    assert (
        metrics[
            "net_income"
        ]
        == Decimal("85.00")
    )

    assert (
        metrics[
            "total_orders"
        ]
        == 10
    )

    assert (
        metrics[
            "total_distance_km"
        ]
        == Decimal("50.00")
    )

    assert (
        metrics[
            "total_hours"
        ]
        == Decimal("4.00")
    )

    assert (
        metrics[
            "income_per_hour"
        ]
        == Decimal("21.25")
    )

    assert (
        metrics[
            "income_per_order"
        ]
        == Decimal("8.50")
    )

    assert (
        metrics[
            "income_per_km"
        ]
        == Decimal("1.70")
    )


def test_empty_dashboard_metrics():
    metrics = (
        calculate_dashboard_metrics(
            []
        )
    )

    assert (
        metrics[
            "total_sessions"
        ]
        == 0
    )

    assert (
        metrics[
            "gross_income"
        ]
        == Decimal("0.00")
    )

    assert (
        metrics[
            "net_income"
        ]
        == Decimal("0.00")
    )

    assert (
        metrics[
            "total_orders"
        ]
        == 0
    )

    assert (
        metrics[
            "total_distance_km"
        ]
        == Decimal("0.00")
    )

    assert (
        metrics[
            "total_hours"
        ]
        == Decimal("0.00")
    )

    assert (
        metrics[
            "income_per_hour"
        ]
        is None
    )

    assert (
        metrics[
            "income_per_order"
        ]
        is None
    )

    assert (
        metrics[
            "income_per_km"
        ]
        is None
    )


def test_platform_summary():
    sessions = [
        make_session(
            platform="shopeefood",
            gross_income=20,
            fuel_cost=2,
            other_expenses=0,
            total_orders=2,
        ),
        make_session(
            platform="shopeefood",
            gross_income=30,
            fuel_cost=3,
            other_expenses=0,
            total_orders=3,
        ),
        make_session(
            platform="grabfood",
            gross_income=40,
            fuel_cost=5,
            other_expenses=0,
            total_orders=4,
        ),
    ]

    result = (
        calculate_platform_summary(
            sessions
        )
    )

    assert len(result) == 3

    shopeefood = result[0]
    grabfood = result[1]
    lalamove = result[2]

    assert (
        shopeefood[
            "platform"
        ]
        == "shopeefood"
    )

    assert (
        shopeefood[
            "total_sessions"
        ]
        == 2
    )

    assert (
        shopeefood[
            "total_orders"
        ]
        == 5
    )

    assert (
        shopeefood[
            "gross_income"
        ]
        == Decimal("50.00")
    )

    assert (
        shopeefood[
            "net_income"
        ]
        == Decimal("45.00")
    )

    assert (
        grabfood[
            "total_sessions"
        ]
        == 1
    )

    assert (
        lalamove[
            "total_sessions"
        ]
        == 0
    )

    assert (
        lalamove[
            "net_income"
        ]
        == Decimal("0.00")
    )