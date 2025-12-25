import httpx
import random
from app.config import settings

BASE_URL = "https://finnhub.io/api/v1"

SYMBOLS_BY_COUNTRY = {
    "USA": {
        "AAPL": "Apple Inc.",
        "MSFT": "Microsoft Corporation",
        "GOOGL": "Alphabet Inc.",
        "AMZN": "Amazon.com Inc.",
        "NVDA": "NVIDIA Corporation",
        "TSLA": "Tesla Inc.",
        "META": "Meta Platforms Inc."
    }
}

async def fetch_quote(symbol: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"{BASE_URL}/quote",
            params={
                "symbol": symbol,
                "token": settings.FINNHUB_API_KEY
            }
        )
        r.raise_for_status()
        return r.json()

def generate_history(base_price: float):
    return [round(base_price + random.uniform(-5, 5), 2) for _ in range(20)]

async def fetch_market(country: str):
    symbols = SYMBOLS_BY_COUNTRY.get(country, {})
    if not symbols:
        return []

    results = []

    for symbol, name in symbols.items():
        quote = await fetch_quote(symbol)

        if quote.get("c", 0) == 0:
            continue

        results.append({
            "symbol": symbol,
            "name": name,
            "price": quote["c"],
            "change": quote["d"],
            "change_pct": quote["dp"],
            "history": generate_history(quote["c"])
        })

    return results
