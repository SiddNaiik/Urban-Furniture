from pydantic import BaseModel


class ChartOfAccountCreate(BaseModel):
    name: str
    account_type: str


class ChartOfAccountResponse(BaseModel):
    id: int
    name: str
    account_type: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }