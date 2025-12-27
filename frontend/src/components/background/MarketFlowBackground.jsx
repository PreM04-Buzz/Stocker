export default function MarketFlowBackground() {
  return (
    <div className="market-bg">
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="market-bg-svg"
      >
        <path
          d="M0,420 
             C120,380 180,340 260,360
             C340,390 420,310 520,330
             C640,360 720,260 820,290
             C920,320 1020,220 1200,240"
          fill="none"
          stroke="rgba(0,180,255,0.25)"
          strokeWidth="4"
        />

        <path
          d="M0,460 
             C150,420 300,380 450,400
             C600,430 750,350 900,370
             C1050,390 1150,320 1200,300"
          fill="none"
          stroke="rgba(0,180,255,0.15)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
