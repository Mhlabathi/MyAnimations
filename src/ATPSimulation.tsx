import { useCurrentFrame, interpolate } from "remotion";
import React from "react";

export const ATPSimulation: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 300;

  // 1. Generate historical data points up to the current frame
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= frame; i++) {
    // Map frame timeline to 0 - 5 minutes of rest
    const minutes = interpolate(i, [0, totalFrames], [0, 5]);
    
    // Biological exponential curve for ATP recovery: y = 100 * (1 - e^(-k * x))
    const atpPercentage = 100 * (1 - Math.exp(-1.2 * minutes));
    
    // Map data values directly to pixel coordinates on our 1920x1080 canvas
    const pixelX = interpolate(minutes, [0, 5], [200, 1720]);
    const pixelY = interpolate(atpPercentage, [0, 100], [880, 280]); // Inverted for screen coordinates
    
    points.push({ x: pixelX, y: pixelY });
  }

  // Current active data point
  const currentPoint = points[points.length - 1] || { x: 200, y: 880 };
  const currentATP = interpolate(frame, [0, totalFrames], [0, 5]);
  const currentPercentage = (100 * (1 - Math.exp(-1.2 * currentATP))).toFixed(1);

  // SVG path layout string string generation
  const pathD = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  return (
    <div style={{
      flex: 1,
      backgroundColor: "#0B0F19",
      fontFamily: "monospace",
      color: "#00FF66",
      padding: "60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* Dynamic Terminal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "32px", borderBottom: "2px solid #1E293B", paddingBottom: "20px" }}>
        <div>SYSTEM://BIOLOGICAL_SIMULATOR/ATP_RECOVERY</div>
        <div style={{ color: "#FF007A" }}>FRAME: {frame.toString().padStart(3, "0")} / 300</div>
      </div>

      {/* Main SVG Graph Workspace */}
      <div style={{ position: "relative", width: "100%", height: "700px" }}>
        <svg style={{ width: "100%", height: "100%" }}>
          {/* Cyber grid background */}
          {[...Array(6)].map((_, i) => (
            <line key={`x-${i}`} x1={200 + i * 304} y1="200" x2={200 + i * 304} y2="880" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`y-${i}`} x1="200" y1={280 + i * 150} x2="1720" y2={280 + i * 150} stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
          ))}

          {/* Graph Chart Axes */}
          <line x1="200" y1="880" x2="1720" y2="880" stroke="#475569" strokeWidth="4" />
          <line x1="200" y1="200" x2="200" y2="880" stroke="#475569" strokeWidth="4" />

          {/* Labels */}
          <text x="960" y="940" fill="#94A3B8" fontSize="24" textAnchor="middle">REST TIME (MINUTES)</text>
          <text x="100" y="580" fill="#94A3B8" fontSize="24" textAnchor="middle" transform="rotate(-90, 100, 580)">ATP CAPACITY (%)</text>

          {/* Tick values */}
          {[0, 1, 2, 3, 4, 5].map((val, i) => (
            <text key={`tx-${i}`} x={200 + i * 304} y="910" fill="#00FF66" fontSize="20" textAnchor="middle">{val}m</text>
          ))}
          {[0, 25, 50, 75, 100].map((val, i) => (
            <text key={`ty-${i}`} x="160" y={880 - i * 150} fill="#00FF66" fontSize="20" textAnchor="end">{val}%</text>
          ))}

          {/* The dynamically rendering line graph */}
          {pathD && (
            <path d={pathD} fill="none" stroke="#FF007A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Pulse tracking node tracking point */}
          <circle cx={currentPoint.x} cy={currentPoint.y} r="10" fill="#00FF66" filter="drop-shadow(0 0 8px #00FF66)" />
        </svg>
      </div>

      {/* Real-time Dashboard Readouts */}
      <div style={{ display: "flex", gap: "40px", background: "#111827", padding: "30px", borderRadius: "8px", border: "1px solid #1E293B" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#94A3B8", fontSize: "18px", marginBottom: "5px" }}>REST TIME ELAPSED</div>
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>{currentATP.toFixed(2)} Min</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#94A3B8", fontSize: "18px", marginBottom: "5px" }}>CELLULAR ATP STORES</div>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#FF007A" }}>{currentPercentage}%</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#94A3B8", fontSize: "18px", marginBottom: "5px" }}>RECOMMENDATION</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: parseFloat(currentPercentage) > 85 ? "#00FF66" : "#EAB308" }}>
            {parseFloat(currentPercentage) > 95 ? "READY FOR NEXT SET" : parseFloat(currentPercentage) > 80 ? "OPTIMAL ZONE" : "INSUFFICIENT REST"}
          </div>
        </div>
      </div>
    </div>
  );
};

