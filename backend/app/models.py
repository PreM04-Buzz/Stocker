from pydantic import BaseModel
from typing import List
from datetime import datetime

class Stock(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    history: List[float]
    updated_at: str