import React, { useEffect, useRef } from "react";

export default function MarketFlowBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // soft vignette
      const g = ctx.createRadialGradient(w * 0.3, h * 0.2, 50, w * 0.5, h * 0.5, Math.max(w, h));
      g.addColorStop(0, "rgba(2, 6, 23, 0.5)");
      g.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = "rgba(34, 211, 238, 0.06)";
      ctx.lineWidth = 1;

      const spacing = 60;
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + (t % spacing), h * 0.25);
        ctx.lineTo(x + (t % spacing), h);
        ctx.stroke();
      }

      // flowing lines (chart vibe)
      const lines = 4;
      for (let k = 0; k < lines; k++) {
        const baseY = h * (0.35 + k * 0.12);
        const amp = 35 + k * 8;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
        ctx.beginPath();

        for (let x = 0; x <= w; x += 10) {
          const y =
            baseY +
            Math.sin((x * 0.01) + (t * 0.02) + k) * amp +
            Math.sin((x * 0.02) + (t * 0.015) + k * 2) * (amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 1.5;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="bg-canvas" />;
}