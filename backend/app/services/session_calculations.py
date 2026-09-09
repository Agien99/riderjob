from datetime import datetime
from decimal import (
    Decimal,
    ROUND_HALF_UP,
)


TWO_DECIMAL_PLACES = Decimal("0.01")


def round_money(
    value: Decimal,
) -> Decimal:
    return value.quantize(
        TWO_DECIMAL_PLACES,
        rounding=ROUND_HALF_UP,
    )


def calculate_distance(
    start_mileage: Decimal,
    end_mileage: Decimal,
) -> Decimal:
    distance = (
        end_mileage
        - start_mileage
    )

    if distance < 0:
        raise ValueError(
            "End mileage cannot be lower than start mileage."
        )

    return round_money(distance)


def calculate_duration_minutes(
    start_time: datetime,
    end_time: datetime,
) -> int:
    if end_time < start_time:
        raise ValueError(
            "End time cannot be earlier than start time."
        )

    duration = (
        end_time
        - start_time
    )

    return int(
        duration.total_seconds()
        // 60
    )


def calculate_net_income(
    gross_income: Decimal,
    fuel_cost: Decimal,
    other_expenses: Decimal,
) -> Decimal:
    return round_money(
        gross_income
        - fuel_cost
        - other_expenses
    )


def calculate_income_per_hour(
    net_income: Decimal,
    duration_minutes: int,
) -> Decimal | None:
    if duration_minutes <= 0:
        return None

    hours = (
        Decimal(duration_minutes)
        / Decimal("60")
    )

    return round_money(
        net_income / hours
    )


def calculate_income_per_order(
    net_income: Decimal,
    total_orders: int,
) -> Decimal | None:
    if total_orders <= 0:
        return None

    return round_money(
        net_income
        / Decimal(total_orders)
    )


def calculate_income_per_km(
    net_income: Decimal,
    distance_km: Decimal,
) -> Decimal | None:
    if distance_km <= 0:
        return None

    return round_money(
        net_income
        / distance_km
    )

from app.schemas.session import (
    SessionMetrics,
)


def build_session_metrics(
    start_mileage: Decimal,
    end_mileage: Decimal,
    start_time: datetime,
    end_time: datetime,
    total_orders: int,
    gross_income: Decimal,
    fuel_cost: Decimal,
    other_expenses: Decimal,
) -> SessionMetrics:
    distance_km = calculate_distance(
        start_mileage,
        end_mileage,
    )

    duration_minutes = (
        calculate_duration_minutes(
            start_time,
            end_time,
        )
    )

    net_income = calculate_net_income(
        gross_income,
        fuel_cost,
        other_expenses,
    )

    return SessionMetrics(
        distance_km=distance_km,
        duration_minutes=duration_minutes,
        net_income=net_income,
        income_per_hour=(
            calculate_income_per_hour(
                net_income,
                duration_minutes,
            )
        ),
        income_per_order=(
            calculate_income_per_order(
                net_income,
                total_orders,
            )
        ),
        income_per_km=(
            calculate_income_per_km(
                net_income,
                distance_km,
            )
        ),
    )