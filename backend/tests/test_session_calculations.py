from datetime import (
    datetime,
    timezone,
)
from decimal import Decimal

import pytest

from app.services.session_calculations import (
    build_session_metrics,
    calculate_distance,
    calculate_duration_minutes,
    calculate_income_per_hour,
    calculate_income_per_km,
    calculate_income_per_order,
    calculate_net_income,
)


def test_calculate_distance():
    result = calculate_distance(
        Decimal("5234.00"),
        Decimal("5262.00"),
    )

    assert result == Decimal("28.00")


def test_end_mileage_cannot_be_lower():
    with pytest.raises(
        ValueError,
        match="End mileage cannot be lower",
    ):
        calculate_distance(
            Decimal("5262.00"),
            Decimal("5234.00"),
        )


def test_calculate_duration_minutes():
    start_time = datetime(
        2026,
        8,
        16,
        9,
        10,
        tzinfo=timezone.utc,
    )

    end_time = datetime(
        2026,
        8,
        16,
        10,
        36,
        tzinfo=timezone.utc,
    )

    result = (
        calculate_duration_minutes(
            start_time,
            end_time,
        )
    )

    assert result == 86


def test_calculate_net_income():
    result = calculate_net_income(
        gross_income=Decimal("25.00"),
        fuel_cost=Decimal("5.00"),
        other_expenses=Decimal("2.00"),
    )

    assert result == Decimal("18.00")


def test_calculate_income_per_hour():
    result = calculate_income_per_hour(
        Decimal("11.91"),
        86,
    )

    assert result == Decimal("8.31")


def test_calculate_income_per_order():
    result = calculate_income_per_order(
        Decimal("11.91"),
        2,
    )

    assert result == Decimal("5.96")


def test_calculate_income_per_km():
    result = calculate_income_per_km(
        Decimal("11.91"),
        Decimal("28.00"),
    )

    assert result == Decimal("0.43")


def test_zero_values_return_none():
    assert (
        calculate_income_per_hour(
            Decimal("10.00"),
            0,
        )
        is None
    )

    assert (
        calculate_income_per_order(
            Decimal("10.00"),
            0,
        )
        is None
    )

    assert (
        calculate_income_per_km(
            Decimal("10.00"),
            Decimal("0.00"),
        )
        is None
    )


def test_build_session_metrics():
    start_time = datetime(
        2026,
        8,
        16,
        9,
        10,
        tzinfo=timezone.utc,
    )

    end_time = datetime(
        2026,
        8,
        16,
        10,
        36,
        tzinfo=timezone.utc,
    )

    metrics = build_session_metrics(
        start_mileage=Decimal(
            "5234.00"
        ),
        end_mileage=Decimal(
            "5262.00"
        ),
        start_time=start_time,
        end_time=end_time,
        total_orders=2,
        gross_income=Decimal(
            "11.91"
        ),
        fuel_cost=Decimal(
            "0.00"
        ),
        other_expenses=Decimal(
            "0.00"
        ),
    )

    assert (
        metrics.distance_km
        == Decimal("28.00")
    )

    assert (
        metrics.duration_minutes
        == 86
    )

    assert (
        metrics.net_income
        == Decimal("11.91")
    )

    assert (
        metrics.income_per_hour
        == Decimal("8.31")
    )

    assert (
        metrics.income_per_order
        == Decimal("5.96")
    )

    assert (
        metrics.income_per_km
        == Decimal("0.43")
    )