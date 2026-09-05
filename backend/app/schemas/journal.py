from pydantic import BaseModel


class JournalCreate(BaseModel):
    name: str
    journal_type: str
    default_account_id: int


class JournalResponse(BaseModel):
    id: int
    name: str
    journal_type: str
    default_account_id: int
    is_active: bool

    model_config = {
        "from_attributes": True
    }