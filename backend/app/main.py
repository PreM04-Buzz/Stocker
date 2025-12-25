from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.finnhub_client import fetch_market
from app.ws_manager import manager
from app.storage import push_price, get_history, set_snapshot
from app.models import Stock


# TO CREATE APP FIRST 

app = FastAPI(title="Stocker API", version="1.0")

# MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ROUTES
@app.post("/api/refresh")
async def refresh_market(
    country: str = Query("USA"),
    city: str | None = None
):
    market = await fetch_market(country)
    results = []

    for item in market:
        await push_price(item["symbol"], item["price"])
        history = await get_history(item["symbol"])

        stock = Stock(
            symbol=item["symbol"],
            name=item["name"],
            price=item["price"],
            change=item["change"],
            history=history,
            updated_at=datetime.utcnow().strftime("%I:%M:%S %p")
        )

        await set_snapshot(item["symbol"], stock.dict())
        await manager.broadcast(stock.dict())
        results.append(stock.dict())

    return results


@app.get("/")
async def health():
    return {"status": "ok", "service": "Stocker"}

from fastapi import WebSocket
from app.ws_manager import manager

@app.websocket("/ws/market")
async def market_socket(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except Exception:
        manager.disconnect(ws)

