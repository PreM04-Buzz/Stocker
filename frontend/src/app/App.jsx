import React, { useMemo, useState } from "react";

import Header from "../components/layout/Header.jsx";
import LocationSelector from "../components/controls/LocationSelector.jsx";
import StockCard from "../components/cards/StockCard.jsx";
import MarketFlowBackground from "../components/background/MarketFlowBackground.jsx";
import useMarketSocket from "../hooks/useMarketSocket.js";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function App() {
  // mode: city | country
  const [mode, setMode] = useState("city");

  // USA only (current scope)
  const [country, setCountry] = useState("USA");
  const [city, setCity] = useState("New York");

  const [tickerQuery, setTickerQuery] = useState("");

  const {
    connected,
    lastUpdated,
    stocks,
    pullLatest
  } = useMarketSocket({
    apiBase: API_BASE,
    mode,
    country,
    city
  });

  const filteredStocks = useMemo(() => {
    const q = tickerQuery.trim().toUpperCase();
    if (!q) return stocks;
    return stocks.filter((s) =>
      s.symbol?.toUpperCase().includes(q)
    );
  }, [stocks, tickerQuery]);

  return (
    <div className="page">
      <MarketFlowBackground />

      <div className="container">
        <Header />

        {/* HERO */}
        <div className="hero">
          <div className="hero-left">
            <div className="hero-tag">LIVE MARKET DATA</div>

            <h1 className="hero-title">stocker</h1>

            <p className="hero-subtitle">
              Real-time market intelligence tracking top performing assets
              across global markets.
            </p>

            <h2 className="hero-location">
              Trending in{" "}
              <span>{mode === "city" ? city : country}</span>
            </h2>
          </div>

          <div className="hero-right">
            <LocationSelector
              mode={mode}
              setMode={setMode}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              tickerQuery={tickerQuery}
              setTickerQuery={setTickerQuery}
              lastUpdated={lastUpdated}
              connected={connected}
              onPull={pullLatest}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
            />
          ))}

          {filteredStocks.length === 0 && (
            <div className="empty">
              <div className="empty-title">No matches</div>
              <div className="empty-sub">
                Try searching by ticker (example: AAPL, TSLA)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
