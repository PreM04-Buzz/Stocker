export default function MiniSparkline({ data, up }) {
  if (!data || data.length < 2) return null;

  const w = 120;
  const h = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="spark">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

