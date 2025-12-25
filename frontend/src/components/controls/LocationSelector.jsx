import React from "react";

const COUNTRIES = {
  India: ["Mumbai", "Delhi", "Bengaluru"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
  USA: ["New York", "San Francisco", "Chicago"]
};

export default function LocationSelector({
  mode,
  setMode,
  country,
  setCountry,
  city,
  setCity,
  tickerQuery,
  setTickerQuery,
  lastUpdated,
  connected,
  onPull
}) {
  const cities = COUNTRIES[country] || [];

  return (
    <div className="panel">
      <div className="panel-tabs">
        <button
          className={mode === "city" ? "tab active" : "tab"}
          onClick={() => setMode("city")}
        >
          City
        </button>
        <button
          className={mode === "country" ? "tab active" : "tab"}
          onClick={() => setMode("country")}
        >
          Country
        </button>
      </div>

      <div className="panel-row">
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="select">
          {Object.keys(COUNTRIES).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="select"
          disabled={mode !== "city"}
        >
          {cities.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </div>

      <input
        className="search"
        value={tickerQuery}
        onChange={(e) => setTickerQuery(e.target.value)}
        placeholder="Search ticker..."
      />

      <div className="meta">
        <div>Last updated: {lastUpdated || "—"}</div>
        <div className="stream">
          Stream: <span className={connected ? "good" : "bad"}>{connected ? "connected" : "disconnected"}</span>
        </div>
      </div>

      <button className="btn" onClick={onPull}>
        Pull Latest Data
      </button>
    </div>
  );
}