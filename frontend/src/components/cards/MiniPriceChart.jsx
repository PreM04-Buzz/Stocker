
export default function MiniPriceChart({ data, negative }) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const line = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `${line} 100,100 0,100`;

  return (
    <svg viewBox="0 0 100 100" className="gf-chart">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={negative ? "#ef4444" : "#22c55e"}
            stopOpacity="0.35"
          />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polyline
        points={area}
        fill="url(#fade)"
      />

      <polyline
        points={line}
        fill="none"
        stroke={negative ? "#ef4444" : "#22c55e"}
        strokeWidth="2"
      />
    </svg>
  );
}
