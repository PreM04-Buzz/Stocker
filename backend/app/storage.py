import json
import redis.asyncio as redis
from app.config import settings

# Redis connection
r = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Price history
async def push_price(symbol: str, price: float):
    """
    Store rolling price history for a stock symbol.
    Keeps only the latest 40 data points.
    """
    key = f"history:{symbol}"
    await r.rpush(key, price)
    await r.ltrim(key, -40, -1)


async def get_history(symbol: str):
    """
    Retrieve historical price list for chart rendering.
    """
    key = f"history:{symbol}"
    values = await r.lrange(key, 0, -1)
    return [float(v) for v in values]

# Snapshot storage
async def set_snapshot(symbol: str, data: dict):
    """
    Store latest stock snapshot.
    Redis hashes do NOT support lists or dicts directly,
    so complex fields are serialized to JSON.
    """
    safe_data = {}

    for key, value in data.items():
        if isinstance(value, (list, dict)):
            safe_data[key] = json.dumps(value)
        else:
            safe_data[key] = value

    await r.hset(f"stock:{symbol}", mapping=safe_data)


async def get_snapshot(symbol: str):
    """
    Retrieve latest stock snapshot.
    Automatically deserialize JSON fields.
    """
    raw = await r.hgetall(f"stock:{symbol}")
    parsed = {}

    for key, value in raw.items():
        try:
            parsed[key] = json.loads(value)
        except (json.JSONDecodeError, TypeError):
            parsed[key] = value

    return parsed
