import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ================================================================
   DEMO ALERT DATA — Synthetic safety-network incidents
   ================================================================ */
interface AlertPoint {
  id: string;
  label: string;
  location: string;
  lat: number;
  lng: number;
  priority: 'High' | 'Medium' | 'Low';
  color: string;
}

const DEMO_ALERTS: AlertPoint[] = [
  { id: 'pt-1', label: 'High Risk Activity', location: 'Mumbai Central', lat: 19.08, lng: 72.88, priority: 'High', color: '#ff4444' },
  { id: 'pt-2', label: 'Alert', location: 'New Delhi', lat: 28.63, lng: 77.22, priority: 'High', color: '#ff4444' },
  { id: 'pt-3', label: 'Possible Distress', location: 'Howrah', lat: 22.57, lng: 88.36, priority: 'Medium', color: '#ff6b6b' },
  { id: 'pt-4', label: 'Observation', location: 'Chennai Central', lat: 13.08, lng: 80.27, priority: 'Medium', color: '#ff6b6b' },
  { id: 'pt-5', label: 'Monitoring', location: 'Indore Junction', lat: 22.72, lng: 75.86, priority: 'Low', color: '#ff8c8c' },
  { id: 'pt-6', label: 'Alert', location: 'Lucknow', lat: 26.85, lng: 80.95, priority: 'High', color: '#ff4444' },
  { id: 'pt-7', label: 'Possible Distress', location: 'Hyderabad', lat: 17.43, lng: 78.5, priority: 'Medium', color: '#ff6b6b' },
  { id: 'pt-8', label: 'Monitoring', location: 'Ahmedabad Junction', lat: 23.03, lng: 72.58, priority: 'Low', color: '#ff8c8c' },
  { id: 'pt-9', label: 'High Risk Activity', location: 'Bangalore City', lat: 12.98, lng: 77.59, priority: 'High', color: '#ff4444' },
  { id: 'pt-10', label: 'Observation', location: 'Patna Junction', lat: 25.62, lng: 85.14, priority: 'Medium', color: '#ff6b6b' },
  { id: 'pt-11', label: 'Monitoring', location: 'Surat', lat: 21.17, lng: 72.83, priority: 'Low', color: '#ff8c8c' },
  { id: 'pt-12', label: 'Observation', location: 'Chandigarh', lat: 30.73, lng: 76.78, priority: 'Medium', color: '#ff6b6b' },
];

/* Connection line pairs — indices into DEMO_ALERTS */
const CONNECTION_PAIRS: [number, number, string][] = [
  [0, 1, '#ff6b6b'], // Mumbai ↔ Delhi (coral)
  [1, 5, '#ff8c42'], // Delhi ↔ Lucknow (orange)
  [2, 9, '#2dd4bf'], // Howrah ↔ Patna (teal)
  [3, 6, '#ff6b6b'], // Chennai ↔ Hyderabad (coral)
  [8, 3, '#ff8c42'], // Bangalore ↔ Chennai (orange)
  [7, 10, '#2dd4bf'], // Ahmedabad ↔ Surat (teal)
];

/* ================================================================
   SIMPLIFIED CONTINENTAL OUTLINES (lat, lng pairs)
   ================================================================ */
const INDIA_OUTLINE = [
  [8, 77], [10, 76], [12, 75], [15, 74], [17, 73], [20, 73],
  [23, 69], [24, 68], [27, 70], [30, 74], [33, 76], [35, 77],
  [33, 78], [28, 84], [26, 87], [22, 88], [21, 87], [18, 84],
  [15, 80], [12, 80], [10, 79], [8, 77],
];

const SE_ASIA = [
  [5, 100], [10, 99], [15, 101], [20, 100], [22, 104], [20, 107],
  [15, 109], [10, 106], [5, 105], [5, 100],
];

const AFRICA = [
  [35, -5], [30, 32], [22, 37], [12, 44], [5, 40], [-5, 35],
  [-15, 40], [-25, 35], [-34, 26], [-34, 18], [-28, 16],
  [-20, 12], [-12, 14], [-5, 10], [0, 5], [5, 1], [10, -10],
  [15, -17], [22, -17], [30, -10], [35, -5],
];

const EUROPE = [
  [36, -10], [38, -5], [43, 0], [48, -5], [51, 2], [55, 10],
  [57, 12], [60, 25], [65, 28], [70, 30], [70, 40], [60, 40],
  [55, 35], [50, 30], [45, 28], [40, 30], [36, 25], [36, -10],
];

const S_AMERICA = [
  [12, -72], [10, -62], [5, -53], [0, -50], [-5, -35],
  [-15, -40], [-23, -43], [-33, -52], [-40, -63], [-55, -68],
  [-50, -75], [-40, -73], [-30, -72], [-20, -70], [-15, -76],
  [-5, -80], [0, -78], [5, -77], [10, -75], [12, -72],
];

const N_AMERICA = [
  [10, -85], [15, -90], [20, -100], [25, -100], [30, -95],
  [30, -85], [35, -80], [40, -74], [45, -67], [48, -55],
  [55, -60], [60, -65], [65, -65], [70, -70], [72, -85],
  [70, -100], [65, -105], [60, -120], [55, -130], [50, -128],
  [45, -125], [40, -124], [35, -120], [30, -115], [25, -110],
  [20, -105], [15, -95], [10, -85],
];

const CONTINENTS = [INDIA_OUTLINE, SE_ASIA, AFRICA, EUROPE, S_AMERICA, N_AMERICA];

/* ================================================================
   COMPONENT
   ================================================================ */
export const InteractiveGlobe3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<AlertPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const alertScreenPositions = useRef<{ pt: AlertPoint; sx: number; sy: number; visible: boolean }[]>([]);

  // Handle mouse hover for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: AlertPoint | null = null;
    let foundPos = { x: 0, y: 0 };

    for (const item of alertScreenPositions.current) {
      if (!item.visible) continue;
      const dx = mouseX - item.sx;
      const dy = mouseY - item.sy;
      if (dx * dx + dy * dy < 18 * 18) { // ~18px hit radius
        found = item.pt;
        foundPos = { x: item.sx, y: item.sy };
        break;
      }
    }

    setActiveTooltip(found);
    if (found) {
      setTooltipPos(foundPos);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveTooltip(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Handle high DPI displays
    const width = canvas.clientWidth || 550;
    const height = canvas.clientHeight || 550;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = width * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate static network dots distributed on a sphere (Fibonacci spiral)
    const dots: { x: number; y: number; z: number; size: number }[] = [];
    const numDots = 500;

    for (let i = 0; i < numDots; i++) {
      const phi = Math.acos(-1 + (2 * i) / numDots);
      const theta = Math.sqrt(numDots * Math.PI) * phi;
      dots.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        size: Math.random() * 1.2 + 0.6
      });
    }

    // Lat/lng → unit sphere coordinates
    const toSphere = (lat: number, lng: number) => {
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.sin(lngRad),
        y: -Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lngRad),
      };
    };

    // Rotate a 3D point around the Y axis
    const rotateY = (p: { x: number; y: number; z: number }, cosR: number, sinR: number) => ({
      x: p.x * cosR - p.z * sinR,
      y: p.y,
      z: p.x * sinR + p.z * cosR,
    });

    // Project rotated 3D point to 2D screen
    const project = (rp: { x: number; y: number; z: number }) => ({
      sx: centerX + rp.x * radius,
      sy: centerY + rp.y * radius,
      z: rp.z,
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ~25 seconds per full rotation
      rotation += 0.0025;

      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      // ── 1. Atmosphere Radial Glow ──
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.6,
        centerX, centerY, radius * 1.3
      );
      glowGradient.addColorStop(0, 'rgba(20, 155, 132, 0.22)');
      glowGradient.addColorStop(0.5, 'rgba(38, 199, 167, 0.07)');
      glowGradient.addColorStop(1, 'rgba(7, 26, 22, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Dark Sphere Body ──
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#061D1A';
      ctx.shadowColor = '#149B84';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── 3. Latitude & Longitude Grid Lines ──
      ctx.strokeStyle = 'rgba(38, 199, 167, 0.1)';
      ctx.lineWidth = 0.8;

      // Latitude circles
      for (let lat = -60; lat <= 60; lat += 30) {
        const rLat = (lat * Math.PI) / 180;
        const yLat = centerY + radius * Math.sin(rLat);
        const rRadius = radius * Math.cos(rLat);

        ctx.beginPath();
        ctx.ellipse(centerX, yLat, rRadius, rRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude meridians (rotating)
      for (let lon = 0; lon < 180; lon += 30) {
        const radLon = ((lon + rotation * (180 / Math.PI)) * Math.PI) / 180;
        const widthFactor = Math.cos(radLon);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.abs(widthFactor), radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = widthFactor > 0 ? 'rgba(38, 199, 167, 0.12)' : 'rgba(38, 199, 167, 0.04)';
        ctx.stroke();
      }

      // ── 4. Continental Outlines ──
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.lineWidth = 1.2;

      CONTINENTS.forEach((continent) => {
        ctx.beginPath();
        let started = false;
        let lastVisible = false;

        for (let i = 0; i < continent.length; i++) {
          const sp = toSphere(continent[i][0], continent[i][1]);
          const rp = rotateY(sp, cosR, sinR);
          const pp = project(rp);

          if (rp.z > 0) {
            if (!started || !lastVisible) {
              ctx.moveTo(pp.sx, pp.sy);
            } else {
              ctx.lineTo(pp.sx, pp.sy);
            }
            started = true;
            lastVisible = true;
          } else {
            lastVisible = false;
          }
        }
        ctx.stroke();
      });

      // ── 5. Rotating Surface Dots (Network Nodes) ──
      dots.forEach((dot) => {
        const rx = dot.x * cosR - dot.z * sinR;
        const ry = dot.y;
        const rz = dot.x * sinR + dot.z * cosR;

        if (rz > -0.15) {
          const px = centerX + rx * radius;
          const py = centerY + ry * radius;
          const alpha = Math.max(0.08, (rz + 0.2) / 1.2);

          ctx.fillStyle = `rgba(99, 213, 192, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(px, py, dot.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ── 6. Connection Arcs between Alert Pairs ──
      const now = Date.now();

      CONNECTION_PAIRS.forEach(([fromIdx, toIdx, color]) => {
        const p1 = DEMO_ALERTS[fromIdx];
        const p2 = DEMO_ALERTS[toIdx];

        const sp1 = toSphere(p1.lat, p1.lng);
        const sp2 = toSphere(p2.lat, p2.lng);
        const rp1 = rotateY(sp1, cosR, sinR);
        const rp2 = rotateY(sp2, cosR, sinR);

        // Only draw if both endpoints face the camera
        if (rp1.z > 0.05 && rp2.z > 0.05) {
          const pp1 = project(rp1);
          const pp2 = project(rp2);

          // Midpoint elevated arc
          const midX = (pp1.sx + pp2.sx) / 2;
          const midY = (pp1.sy + pp2.sy) / 2;
          const dist = Math.hypot(pp2.sx - pp1.sx, pp2.sy - pp1.sy);
          const arcLift = dist * 0.25;

          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(pp1.sx, pp1.sy);
          ctx.quadraticCurveTo(midX, midY - arcLift, pp2.sx, pp2.sy);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }
      });

      // ── 7. Red Alert Hotspots (pulsing, staggered) ──
      const screenPositions: typeof alertScreenPositions.current = [];

      DEMO_ALERTS.forEach((pt, idx) => {
        const sp = toSphere(pt.lat, pt.lng);
        const rp = rotateY(sp, cosR, sinR);

        if (rp.z > 0.1) {
          const pp = project(rp);
          const phaseOffset = idx * 0.78;
          const pulse = Math.sin(now * 0.0025 + phaseOffset); // ~2.5s cycle
          const pulseRadius = 5 + pulse * 3;
          const glowRadius = 12 + pulse * 5;
          const coreAlpha = 0.8 + pulse * 0.2;

          // Outer soft glow
          const glow = ctx.createRadialGradient(
            pp.sx, pp.sy, 0,
            pp.sx, pp.sy, glowRadius
          );
          glow.addColorStop(0, `rgba(255, 68, 68, ${(0.25 + pulse * 0.1).toFixed(2)})`);
          glow.addColorStop(1, 'rgba(255, 68, 68, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Outer pulse ring
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.3 + pulse * 0.2;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, pulseRadius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          // Core bright dot
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 12;
          ctx.globalAlpha = coreAlpha;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;

          screenPositions.push({ pt, sx: pp.sx, sy: pp.sy, visible: true });
        } else {
          screenPositions.push({ pt, sx: 0, sy: 0, visible: false });
        }
      });

      alertScreenPositions.current = screenPositions;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Tooltip priority color
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'Medium':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[460px] flex items-center justify-center pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[550px] max-h-[550px] object-contain cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip Overlay */}
      {activeTooltip && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <div className="bg-charcoal-950/95 backdrop-blur-md border border-charcoal-700 rounded-xl px-4 py-3 shadow-modal text-left min-w-[180px]">
            <div className="text-[9px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">
              DEMO ALERT
            </div>
            <div className="text-xs font-bold text-white mb-1.5">{activeTooltip.label}</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-charcoal-400">Location:</span>
                <span className="text-teal-400 font-semibold">{activeTooltip.location}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-charcoal-400">Priority:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityStyle(activeTooltip.priority)}`}>
                  {activeTooltip.priority}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-charcoal-800 text-[8px] text-charcoal-500 font-mono">
              SYNTHETIC DATA VISUALIZATION
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
