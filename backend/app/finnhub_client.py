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
    params = {
        "symbol": symbol,
        "token": settings.FINNHUB_API_KEY
    }

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(f"{BASE_URL}/quote", params=params)

            if r.status_code == 429:
                base = round(random.uniform(150, 600), 2)
                return {
                    "c": base,
                    "d": round(random.uniform(-5, 5), 2),
                    "dp": round(random.uniform(-2, 2), 2)
                }

            r.raise_for_status()
            return r.json()

        except Exception:
            base = round(random.uniform(150, 600), 2)
            return {
                "c": base,
                "d": round(random.uniform(-5, 5), 2),
                "dp": round(random.uniform(-2, 2), 2)
            }

def generate_history(base_price: float):
    history = [base_price]
    for _ in range(25):
        history.append(round(history[-1] + random.uniform(-2.5, 2.5), 2))
    return history[-25:]

async def fetch_market(country: str):
    symbols = SYMBOLS_BY_COUNTRY.get(country)
    if not symbols:
        return []

    results = []

    for symbol, name in symbols.items():
        quote = await fetch_quote(symbol)

        price = quote.get("c")
        if not price:
            continue

        results.append({
            "symbol": symbol,
            "name": name,
            "price": round(price, 2),
            "change": round(quote.get("d", 0), 2),
            "change_pct": round(quote.get("dp", 0), 2),
            "history": generate_history(price)
        })

    return results
