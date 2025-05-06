from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Transaction(BaseModel):
    tx_hash: str
    sender: str
    receiver: str
    amount: float
    order_id: str
    status: Optional[str] = "success"
    timestamp: Optional[datetime] = None