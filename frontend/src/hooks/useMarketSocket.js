import { useEffect, useMemo, useRef, useState } from "react";

const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws/market";

export default function useMarketSocket({ apiBase, country, city }) {
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [stocksBySymbol, setStocksBySymbol] = useState({});

  const wsRef = useRef(null);

  const stocks = useMemo(
    () => Object.values(stocksBySymbol),
    [stocksBySymbol]
  );

  const pullLatest = async () => {
    if (!country) return;

    try {
      const url = `${apiBase}/api/refresh?country=${encodeURIComponent(
        country
      )}&city=${encodeURIComponent(city || "")}`;

      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (!Array.isArray(data)) return;

      setStocksBySymbol(prev => {
        const next = { ...prev };
        for (const item of data) {
          if (item?.symbol) next[item.symbol] = item;
        }
        return next;
      });

      if (data[0]?.updated_at) {
        setLastUpdated(data[0].updated_at);
      }
    } catch {}
  };

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = evt => {
      try {
        const payload = JSON.parse(evt.data);
        if (!payload?.symbol) return;

        setStocksBySymbol(prev => ({
          ...prev,
          [payload.symbol]: {
            ...prev[payload.symbol],
            ...payload
          }
        }));

        if (payload.updated_at) {
          setLastUpdated(payload.updated_at);
        }
      } catch {}
    };

    return () => {
      try {
        ws.close();
      } catch {}
    };
  }, []);

  useEffect(() => {
    pullLatest();
  }, [country, city]);

  return {
    connected,
    lastUpdated,
    stocks,
    pullLatest
  };
}

