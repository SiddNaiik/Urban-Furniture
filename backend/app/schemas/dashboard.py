from pydantic import BaseModel, Field


class OrderSummary(BaseModel):
    all: int = Field(..., description="Count of all orders")
    confirmed: int = Field(..., description="Count of confirmed orders")
    draft: int = Field(..., description="Count of draft orders")


class BudgetSummary(BaseModel):
    achieved: int = Field(..., description="Count of achieved budget records")
    budget: int = Field(..., description="Total count of budget records")
    committed: int = Field(..., description="Count of committed budget records")


class DashboardSummaryResponse(BaseModel):
    sales: OrderSummary
    purchase: OrderSummary
    budget: BudgetSummary
