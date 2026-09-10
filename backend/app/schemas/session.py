from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class StartSessionRequest(BaseModel):
    platform: Literal[
        "shopeefood",
        "grabfood",
        "lalamove",
    ]

    start_mileage: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )


class EndSessionRequest(BaseModel):
    end_mileage: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    total_orders: int = Field(
        ge=0,
    )

    gross_income: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    fuel_cost: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    other_expenses: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )


class SessionResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    user_id: UUID

    platform: str
    session_date: date

    start_time: datetime
    end_time: datetime | None

    start_mileage: Decimal
    end_mileage: Decimal | None

    total_orders: int
    gross_income: Decimal
    fuel_cost: Decimal
    other_expenses: Decimal

    notes: str | None
    status: str

    created_at: datetime
    updated_at: datetime


class SessionMetrics(BaseModel):
    distance_km: Decimal
    duration_minutes: int

    net_income: Decimal

    income_per_hour: Decimal | None
    income_per_order: Decimal | None
    income_per_km: Decimal | None


class SessionDetailResponse(SessionResponse):
    metrics: SessionMetrics

class UpdateSessionRequest(BaseModel):
    platform: Literal[
        "shopeefood",
        "grabfood",
        "lalamove",
    ]

    start_mileage: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    end_mileage: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    total_orders: int = Field(
        ge=0,
    )

    gross_income: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    fuel_cost: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    other_expenses: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )