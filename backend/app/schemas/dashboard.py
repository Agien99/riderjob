from datetime import (
    date,
    datetime,
)
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    total_sessions: int

    gross_income: Decimal
    fuel_cost: Decimal
    other_expenses: Decimal
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


class PlatformSummary(BaseModel):
    platform: str

    total_sessions: int
    total_orders: int

    gross_income: Decimal
    net_income: Decimal


class RecentSession(BaseModel):
    id: UUID

    session_date: date

    platform: str

    start_time: datetime
    end_time: datetime | None

    total_orders: int

    gross_income: Decimal
    net_income: Decimal


class DashboardResponse(BaseModel):
    period: str

    start_date: date
    end_date: date

    metrics: DashboardMetrics

    platform_summary: list[
        PlatformSummary
    ]

    recent_sessions: list[
        RecentSession
    ]