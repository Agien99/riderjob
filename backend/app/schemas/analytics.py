from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_sessions: int

    gross_income: Decimal
    fuel_cost: Decimal
    other_expenses: Decimal
    total_expenses: Decimal
    net_income: Decimal

    total_orders: int

    total_distance_km: Decimal
    total_hours: Decimal

    income_per_hour: (
        Decimal | None
    )

    income_per_order: (
        Decimal | None
    )

    income_per_km: (
        Decimal | None
    )

    expense_ratio: (
        Decimal | None
    )


class EarningsTrendItem(BaseModel):
    date: date

    gross_income: Decimal
    net_income: Decimal


class OrdersTrendItem(BaseModel):
    date: date
    orders: int


class AnalyticsPlatformSummary(
    BaseModel
):
    platform: str

    total_sessions: int
    total_orders: int

    gross_income: Decimal
    fuel_cost: Decimal
    other_expenses: Decimal
    net_income: Decimal

    total_distance_km: Decimal
    total_hours: Decimal

    income_per_hour: (
        Decimal | None
    )

    income_per_order: (
        Decimal | None
    )

    income_per_km: (
        Decimal | None
    )


class WeekdaySummary(BaseModel):
    weekday: str

    total_sessions: int
    total_orders: int

    net_income: Decimal

    average_net_income: (
        Decimal | None
    )

    total_hours: Decimal

    income_per_hour: (
        Decimal | None
    )


class DayHighlight(BaseModel):
    date: date
    value: Decimal


class PlatformHighlight(BaseModel):
    platform: str
    value: Decimal


class AnalyticsHighlights(BaseModel):
    best_earning_day: (
        DayHighlight | None
    )

    best_efficiency_day: (
        DayHighlight | None
    )

    best_platform_net: (
        PlatformHighlight | None
    )

    best_platform_efficiency: (
        PlatformHighlight | None
    )


class AnalyticsResponse(BaseModel):
    period: str

    start_date: date
    end_date: date

    summary: AnalyticsSummary

    earnings_trend: list[
        EarningsTrendItem
    ]

    orders_trend: list[
        OrdersTrendItem
    ]

    platform_summary: list[
        AnalyticsPlatformSummary
    ]

    weekday_summary: list[
        WeekdaySummary
    ]

    highlights: AnalyticsHighlights