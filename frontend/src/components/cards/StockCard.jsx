import MiniSparkline from "./MiniSparkline";

export default function StockCard({ stock }) {
  const up = stock.change >= 0;

  return (
    <div className="card">
      <div className="card-top">
        <div>
          <div className="symbol">{stock.symbol}</div>
          <div className="name">{stock.name}</div>
        </div>
        <div className="price">
          ${stock.price.toFixed(2)}
          <div className={`pct ${up ? "up" : "down"}`}>
            {up ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
          </div>
        </div>
      </div>

      <MiniSparkline data={stock.history} up={up} />

      <div className="card-bottom">
        <span className="muted">VolatilityLow</span>
      </div>
    </div>
  );
}

