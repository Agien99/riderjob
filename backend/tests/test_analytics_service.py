from datetime import (
    date,
    datetime,
    timezone,
)
from decimal import Decimal
from types import SimpleNamespace

import pytest

from app.services.analytics_service import (
    build_daily_trend,
    build_platform_summary,
    build_weekday_summary,
    calculate_analytics_summary,
    find_best_earning_day,
    find_best_efficiency_day,
    find_best_platform_efficiency,
    find_best_platform_net,
    get_analytics_period_range,
)


def make_session(
    *,
    session_date=date(
        2026,
        9,
        10,
    ),
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
        session_date=session_date,
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


def test_period_last_7_days():
    start_date, end_date = (
        get_analytics_period_range(
            "7d",
            date(
                2026,
                9,
                10,
            ),
        )
    )

    assert start_date == date(
        2026,
        9,
        4,
    )

    assert end_date == date(
        2026,
        9,
        10,
    )


def test_period_last_30_days():
    start_date, end_date = (
        get_analytics_period_range(
            "30d",
            date(
                2026,
                9,
                10,
            ),
        )
    )

    assert start_date == date(
        2026,
        8,
        12,
    )

    assert end_date == date(
        2026,
        9,
        10,
    )


def test_period_this_month():
    start_date, end_date = (
        get_analytics_period_range(
            "month",
            date(
                2026,
                9,
                10,
            ),
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
        10,
    )


def test_period_last_3_months():
    start_date, end_date = (
        get_analytics_period_range(
            "3m",
            date(
                2026,
                9,
                10,
            ),
        )
    )

    assert start_date == date(
        2026,
        6,
        13,
    )

    assert end_date == date(
        2026,
        9,
        10,
    )


def test_period_all_time():
    start_date, end_date = (
        get_analytics_period_range(
            "all",
            date(
                2026,
                9,
                10,
            ),
        )
    )

    assert start_date is None

    assert end_date == date(
        2026,
        9,
        10,
    )


def test_invalid_period():
    with pytest.raises(
        ValueError
    ):
        get_analytics_period_range(
            "invalid",
            date(
                2026,
                9,
                10,
            ),
        )


def test_analytics_summary():
    sessions = [
        make_session(
            gross_income=50,
            fuel_cost=5,
            other_expenses=2,
            total_orders=5,
            start_mileage=100,
            end_mileage=120,
        ),
        make_session(
            gross_income=50,
            fuel_cost=5,
            other_expenses=3,
            total_orders=5,
            start_mileage=120,
            end_mileage=150,
        ),
    ]

    result = (
        calculate_analytics_summary(
            sessions
        )
    )

    assert (
        result["total_sessions"]
        == 2
    )

    assert (
        result["gross_income"]
        == Decimal("100.00")
    )

    assert (
        result["fuel_cost"]
        == Decimal("10.00")
    )

    assert (
        result[
            "other_expenses"
        ]
        == Decimal("5.00")
    )

    assert (
        result[
            "total_expenses"
        ]
        == Decimal("15.00")
    )

    assert (
        result["net_income"]
        == Decimal("85.00")
    )

    assert (
        result["total_orders"]
        == 10
    )

    assert (
        result[
            "total_distance_km"
        ]
        == Decimal("50.00")
    )

    assert (
        result["total_hours"]
        == Decimal("4.00")
    )

    assert (
        result[
            "income_per_hour"
        ]
        == Decimal("21.25")
    )

    assert (
        result[
            "income_per_order"
        ]
        == Decimal("8.50")
    )

    assert (
        result["income_per_km"]
        == Decimal("1.70")
    )

    assert (
        result["expense_ratio"]
        == Decimal("15.00")
    )


def test_empty_analytics_summary():
    result = (
        calculate_analytics_summary(
            []
        )
    )

    assert (
        result["total_sessions"]
        == 0
    )

    assert (
        result["gross_income"]
        == Decimal("0.00")
    )

    assert (
        result["net_income"]
        == Decimal("0.00")
    )

    assert (
        result[
            "total_expenses"
        ]
        == Decimal("0.00")
    )

    assert (
        result[
            "income_per_hour"
        ]
        is None
    )

    assert (
        result[
            "income_per_order"
        ]
        is None
    )

    assert (
        result["income_per_km"]
        is None
    )

    assert (
        result["expense_ratio"]
        is None
    )


def test_daily_trend_groups_sessions():
    sessions = [
        make_session(
            session_date=date(
                2026,
                9,
                9,
            ),
            gross_income=20,
            fuel_cost=2,
            other_expenses=0,
            total_orders=2,
        ),
        make_session(
            session_date=date(
                2026,
                9,
                9,
            ),
            gross_income=30,
            fuel_cost=3,
            other_expenses=0,
            total_orders=3,
        ),
        make_session(
            session_date=date(
                2026,
                9,
                10,
            ),
            gross_income=40,
            fuel_cost=5,
            other_expenses=0,
            total_orders=4,
        ),
    ]

    result = build_daily_trend(
        sessions
    )

    assert len(result) == 2

    assert (
        result[0]["date"]
        == date(
            2026,
            9,
            9,
        )
    )

    assert (
        result[0][
            "gross_income"
        ]
        == Decimal("50.00")
    )

    assert (
        result[0]["net_income"]
        == Decimal("45.00")
    )

    assert (
        result[0]["orders"]
        == 5
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
        build_platform_summary(
            sessions
        )
    )

    assert len(result) == 3

    shopeefood = result[0]
    grabfood = result[1]
    lalamove = result[2]

    assert (
        shopeefood["platform"]
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
        grabfood["platform"]
        == "grabfood"
    )

    assert (
        grabfood[
            "total_sessions"
        ]
        == 1
    )

    assert (
        lalamove["platform"]
        == "lalamove"
    )

    assert (
        lalamove[
            "total_sessions"
        ]
        == 0
    )


def test_weekday_summary():
    sessions = [
        make_session(
            session_date=date(
                2026,
                9,
                7,
            ),
            gross_income=30,
            fuel_cost=5,
            other_expenses=0,
        ),
        make_session(
            session_date=date(
                2026,
                9,
                8,
            ),
            gross_income=40,
            fuel_cost=5,
            other_expenses=0,
        ),
    ]

    result = (
        build_weekday_summary(
            sessions
        )
    )

    assert len(result) == 7

    monday = result[0]
    tuesday = result[1]
    wednesday = result[2]

    assert (
        monday["weekday"]
        == "Monday"
    )

    assert (
        monday[
            "total_sessions"
        ]
        == 1
    )

    assert (
        monday["net_income"]
        == Decimal("25.00")
    )

    assert (
        tuesday["weekday"]
        == "Tuesday"
    )

    assert (
        tuesday["net_income"]
        == Decimal("35.00")
    )

    assert (
        wednesday[
            "total_sessions"
        ]
        == 0
    )


def test_best_earning_day():
    daily_trend = [
        {
            "date":
                date(
                    2026,
                    9,
                    9,
                ),

            "net_income":
                Decimal("40.00"),

            "total_hours":
                Decimal("2.00"),
        },
        {
            "date":
                date(
                    2026,
                    9,
                    10,
                ),

            "net_income":
                Decimal("60.00"),

            "total_hours":
                Decimal("3.00"),
        },
    ]

    result = (
        find_best_earning_day(
            daily_trend
        )
    )

    assert result == {
        "date":
            date(
                2026,
                9,
                10,
            ),

        "value":
            Decimal("60.00"),
    }


def test_best_efficiency_day():
    daily_trend = [
        {
            "date":
                date(
                    2026,
                    9,
                    8,
                ),

            "net_income":
                Decimal("20.00"),

            "total_hours":
                Decimal("0.50"),
        },
        {
            "date":
                date(
                    2026,
                    9,
                    9,
                ),

            "net_income":
                Decimal("30.00"),

            "total_hours":
                Decimal("2.00"),
        },
        {
            "date":
                date(
                    2026,
                    9,
                    10,
                ),

            "net_income":
                Decimal("40.00"),

            "total_hours":
                Decimal("2.00"),
        },
    ]

    result = (
        find_best_efficiency_day(
            daily_trend
        )
    )

    assert result == {
        "date":
            date(
                2026,
                9,
                10,
            ),

        "value":
            Decimal("20.00"),
    }


def test_best_efficiency_day_requires_one_hour():
    daily_trend = [
        {
            "date":
                date(
                    2026,
                    9,
                    10,
                ),

            "net_income":
                Decimal("20.00"),

            "total_hours":
                Decimal("0.50"),
        },
    ]

    result = (
        find_best_efficiency_day(
            daily_trend
        )
    )

    assert result is None


def test_best_platform_net():
    platform_summary = [
        {
            "platform":
                "shopeefood",

            "total_sessions":
                2,

            "net_income":
                Decimal("70.00"),

            "income_per_hour":
                Decimal("14.00"),
        },
        {
            "platform":
                "grabfood",

            "total_sessions":
                1,

            "net_income":
                Decimal("50.00"),

            "income_per_hour":
                Decimal("18.00"),
        },
    ]

    result = (
        find_best_platform_net(
            platform_summary
        )
    )

    assert result == {
        "platform":
            "shopeefood",

        "value":
            Decimal("70.00"),
    }


def test_best_platform_efficiency():
    platform_summary = [
        {
            "platform":
                "shopeefood",

            "total_sessions":
                2,

            "net_income":
                Decimal("70.00"),

            "income_per_hour":
                Decimal("14.00"),
        },
        {
            "platform":
                "grabfood",

            "total_sessions":
                1,

            "net_income":
                Decimal("50.00"),

            "income_per_hour":
                Decimal("18.00"),
        },
    ]

    result = (
        find_best_platform_efficiency(
            platform_summary
        )
    )

    assert result == {
        "platform":
            "grabfood",

        "value":
            Decimal("18.00"),
    }


def test_empty_highlights():
    assert (
        find_best_earning_day([])
        is None
    )

    assert (
        find_best_efficiency_day([])
        is None
    )

    assert (
        find_best_platform_net([])
        is None
    )

    assert (
        find_best_platform_efficiency(
            []
        )
        is None
    )