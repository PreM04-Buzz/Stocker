import MiniPriceChart from "./MiniPriceChart";

export default function StockCard({ stock }) {
  const up = stock.change >= 0;

  return (
    <div className="stock-card">
      <div className="stock-top">
        <div>
          <div className="symbol">{stock.symbol}</div>
          <div className="name">{stock.name}</div>
        </div>
        <div className={up ? "price up" : "price down"}>
          ${stock.price}
        </div>
      </div>

      <MiniSparkline data={stock.history} positive={stock.change >= 0}/>


      <div className={up ? "change up" : "change down"}>
        {up ? "▲" : "▼"} {stock.change}%
      </div>
    </div>
  );
}
