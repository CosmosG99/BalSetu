import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

/* ================================================================
   DEMO ALERT DATA — Synthetic safety-network incidents
   ================================================================ */
interface AlertPoint {
  id: number;
  lat: number;
  lng: number;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  label: string;
}

const DEMO_ALERTS: AlertPoint[] = [
  { id: 1, lat: 19.08, lng: 72.88, location: 'Mumbai Central', priority: 'High', label: 'High Risk Activity' },
  { id: 2, lat: 28.63, lng: 77.22, location: 'New Delhi', priority: 'High', label: 'Alert' },
  { id: 3, lat: 22.57, lng: 88.36, location: 'Howrah', priority: 'Medium', label: 'Possible Distress' },
  { id: 4, lat: 13.08, lng: 80.27, location: 'Chennai Central', priority: 'Medium', label: 'Observation' },
  { id: 5, lat: 22.72, lng: 75.86, location: 'Indore Junction', priority: 'Low', label: 'Monitoring' },
  { id: 6, lat: 26.85, lng: 80.95, location: 'Lucknow', priority: 'High', label: 'Alert' },
  { id: 7, lat: 17.43, lng: 78.5, location: 'Hyderabad', priority: 'Medium', label: 'Possible Distress' },
  { id: 8, lat: 23.03, lng: 72.58, location: 'Ahmedabad Junction', priority: 'Low', label: 'Monitoring' },
  { id: 9, lat: 12.98, lng: 77.59, location: 'Bangalore City', priority: 'High', label: 'High Risk Activity' },
  { id: 10, lat: 25.62, lng: 85.14, location: 'Patna Junction', priority: 'Medium', label: 'Observation' },
  { id: 11, lat: 21.17, lng: 72.83, location: 'Surat', priority: 'Low', label: 'Monitoring' },
  { id: 12, lat: 30.73, lng: 76.78, location: 'Chandigarh', priority: 'Medium', label: 'Observation' },
];

/* Connection line pairs — indices into DEMO_ALERTS */
const CONNECTION_PAIRS: [number, number][] = [
  [0, 1], // Mumbai ↔ Delhi
  [1, 5], // Delhi ↔ Lucknow
  [2, 9], // Howrah ↔ Patna
  [3, 6], // Chennai ↔ Hyderabad
  [8, 3], // Bangalore ↔ Chennai
  [7, 10], // Ahmedabad ↔ Surat
];

const CONNECTION_COLORS = [
  '#ff6b6b', // coral
  '#ff8c42', // orange
  '#2dd4bf', // teal
  '#ff6b6b', // coral
  '#ff8c42', // orange
  '#2dd4bf', // teal
];

/* ================================================================
   UTILITY: Lat/lng → 3D coordinates on a sphere
   ================================================================ */
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ================================================================
   GLOBE WIREFRAME — latitude/longitude grid lines
   ================================================================ */
function GlobeWireframe({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = 0; lng <= 360; lng += 2) {
        points.push(latLngToVec3(lat, lng, radius));
        if (lng < 360) {
          points.push(latLngToVec3(lat, lng + 2, radius));
        }
      }
    }

    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      for (let lat = -90; lat < 90; lat += 2) {
        points.push(latLngToVec3(lat, lng, radius));
        points.push(latLngToVec3(lat + 2, lng, radius));
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setFromPoints(points);
    return geom;
  }, [radius]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a6e5c" transparent opacity={0.25} />
    </lineSegments>
  );
}

/* ================================================================
   WORLD MAP — Simplified continental outlines (key coastline vertices)
   ================================================================ */
function WorldMap({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Simplified India outline
    const india = [
      [8, 77], [10, 76], [12, 75], [15, 74], [17, 73], [20, 73],
      [23, 69], [24, 68], [27, 70], [30, 74], [33, 76], [35, 77],
      [33, 78], [28, 84], [26, 87], [22, 88], [21, 87], [18, 84],
      [15, 80], [12, 80], [10, 79], [8, 77],
    ];

    // SE Asia rough outline
    const seAsia = [
      [5, 100], [10, 99], [15, 101], [20, 100], [22, 104], [20, 107],
      [15, 109], [10, 106], [5, 105], [5, 100],
    ];

    // Africa rough outline
    const africa = [
      [35, -5], [30, 32], [22, 37], [12, 44], [5, 40], [-5, 35],
      [-15, 40], [-25, 35], [-34, 26], [-34, 18], [-28, 16],
      [-20, 12], [-12, 14], [-5, 10], [0, 5], [5, 1], [10, -10],
      [15, -17], [22, -17], [30, -10], [35, -5],
    ];

    // Europe rough outline
    const europe = [
      [36, -10], [38, -5], [43, 0], [48, -5], [51, 2], [55, 10],
      [57, 12], [60, 25], [65, 28], [70, 30], [70, 40], [60, 40],
      [55, 35], [50, 30], [45, 28], [40, 30], [36, 25], [36, -10],
    ];

    // South America rough outline
    const southAmerica = [
      [12, -72], [10, -62], [5, -53], [0, -50], [-5, -35],
      [-15, -40], [-23, -43], [-33, -52], [-40, -63], [-55, -68],
      [-50, -75], [-40, -73], [-30, -72], [-20, -70], [-15, -76],
      [-5, -80], [0, -78], [5, -77], [10, -75], [12, -72],
    ];

    // North America rough outline
    const northAmerica = [
      [10, -85], [15, -90], [20, -100], [25, -100], [30, -95],
      [30, -85], [35, -80], [40, -74], [45, -67], [48, -55],
      [55, -60], [60, -65], [65, -65], [70, -70], [72, -85],
      [70, -100], [65, -105], [60, -120], [55, -130], [50, -128],
      [45, -125], [40, -124], [35, -120], [30, -115], [25, -110],
      [20, -105], [15, -95], [10, -85],
    ];

    const drawOutline = (coords: number[][]) => {
      for (let i = 0; i < coords.length - 1; i++) {
        // Interpolate between points for smoother lines
        const lat1 = coords[i][0], lng1 = coords[i][1];
        const lat2 = coords[i + 1][0], lng2 = coords[i + 1][1];
        const steps = 4;
        for (let s = 0; s < steps; s++) {
          const t1 = s / steps;
          const t2 = (s + 1) / steps;
          points.push(
            latLngToVec3(
              lat1 + (lat2 - lat1) * t1,
              lng1 + (lng2 - lng1) * t1,
              radius + 0.002
            )
          );
          points.push(
            latLngToVec3(
              lat1 + (lat2 - lat1) * t2,
              lng1 + (lng2 - lng1) * t2,
              radius + 0.002
            )
          );
        }
      }
    };

    drawOutline(india);
    drawOutline(seAsia);
    drawOutline(africa);
    drawOutline(europe);
    drawOutline(southAmerica);
    drawOutline(northAmerica);

    const geom = new THREE.BufferGeometry();
    geom.setFromPoints(points);
    return geom;
  }, [radius]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#2dd4bf" transparent opacity={0.45} />
    </lineSegments>
  );
}

/* ================================================================
   NETWORK NODES — small dots scattered across the globe surface
   ================================================================ */
function NetworkNodes({ radius, count = 120 }: { radius: number; count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const lat = Math.random() * 140 - 70; // -70 to 70
      const lng = Math.random() * 360 - 180;
      const v = latLngToVec3(lat, lng, radius + 0.005);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, [radius, count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#2dd4bf" size={0.012} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ================================================================
   ALERT HOTSPOT — A single pulsing red/coral point on the globe
   ================================================================ */
function AlertHotspot({
  alert,
  radius,
  onHover,
  onLeave,
}: {
  alert: AlertPoint;
  radius: number;
  onHover: (alert: AlertPoint, screenPos: { x: number; y: number }) => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const position = useMemo(() => latLngToVec3(alert.lat, alert.lng, radius + 0.01), [alert, radius]);

  // Staggered pulse based on alert id
  const phaseOffset = useMemo(() => (alert.id * 0.78) % (Math.PI * 2), [alert.id]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.6 + 0.4 * Math.sin(t * 2.5 + phaseOffset);
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + 0.3 * pulse;
      meshRef.current.scale.setScalar(0.8 + 0.3 * pulse);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.15 * pulse;
      glowRef.current.scale.setScalar(0.9 + 0.4 * pulse);
    }
  });

  const { camera, size } = useThree();

  const handlePointerEnter = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      // Project 3D world position to screen coords
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      const projected = worldPos.clone().project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (-projected.y * 0.5 + 0.5) * size.height;
      onHover(alert, { x: screenX, y: screenY });
    },
    [alert, camera, size, onHover]
  );

  const handlePointerLeave = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onLeave();
    },
    [onLeave]
  );

  return (
    <group position={position}>
      {/* Core bright point */}
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial
          color={alert.priority === 'High' ? '#ff4444' : alert.priority === 'Medium' ? '#ff6b6b' : '#ff8c8c'}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial
          color="#ff4444"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

/* ================================================================
   CONNECTION ARCS — Curved lines between selected alert pairs
   ================================================================ */
function ConnectionArc({
  from,
  to,
  radius,
  color,
}: {
  from: AlertPoint;
  to: AlertPoint;
  radius: number;
  color: string;
}) {
  const lineObj = useMemo(() => {
    const start = latLngToVec3(from.lat, from.lng, radius + 0.01);
    const end = latLngToVec3(to.lat, to.lng, radius + 0.01);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    // Elevate the midpoint above the globe surface for the arc
    const midLen = mid.length();
    const arcHeight = start.distanceTo(end) * 0.3;
    mid.normalize().multiplyScalar(midLen + arcHeight);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(32);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
    return new THREE.Line(geom, mat);
  }, [from, to, radius, color]);

  return <primitive object={lineObj} />;
}

/* ================================================================
   ATMOSPHERIC GLOW — Subtle outer halo around the globe
   ================================================================ */
function AtmosphericGlow({ radius }: { radius: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(0.18, 0.83, 0.75, 1.0) * intensity * 0.6;
    }
  `;

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
}

/* ================================================================
   MAIN GLOBE GROUP — Contains all rotating elements
   ================================================================ */
function GlobeScene({
  onAlertHover,
  onAlertLeave,
}: {
  onAlertHover: (alert: AlertPoint, screenPos: { x: number; y: number }) => void;
  onAlertLeave: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const GLOBE_RADIUS = 1.6;

  // Continuous rotation: ~25 seconds per full rotation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * (Math.PI * 2) / 25;
    }
  });

  return (
    <>
      {/* Camera lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.5} />

      {/* Atmosphere glow (doesn't rotate — stays fixed for halo effect) */}
      <AtmosphericGlow radius={GLOBE_RADIUS} />

      {/* Rotating group: globe + hotspots + arcs all rotate together */}
      <group ref={groupRef}>
        {/* Globe sphere — dark transparent shell */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshPhongMaterial
            color="#0a2e26"
            transparent
            opacity={0.85}
            shininess={30}
            specular={new THREE.Color('#1a6e5c')}
          />
        </mesh>

        {/* Lat/lng wireframe grid */}
        <GlobeWireframe radius={GLOBE_RADIUS} />

        {/* Continental outlines */}
        <WorldMap radius={GLOBE_RADIUS} />

        {/* Scattered network nodes */}
        <NetworkNodes radius={GLOBE_RADIUS} count={100} />

        {/* Alert hotspots — they rotate with the globe */}
        {DEMO_ALERTS.map((alert) => (
          <AlertHotspot
            key={alert.id}
            alert={alert}
            radius={GLOBE_RADIUS}
            onHover={onAlertHover}
            onLeave={onAlertLeave}
          />
        ))}

        {/* Connection arcs between alert pairs */}
        {CONNECTION_PAIRS.map(([fromIdx, toIdx], i) => (
          <ConnectionArc
            key={i}
            from={DEMO_ALERTS[fromIdx]}
            to={DEMO_ALERTS[toIdx]}
            radius={GLOBE_RADIUS}
            color={CONNECTION_COLORS[i % CONNECTION_COLORS.length]}
          />
        ))}
      </group>
    </>
  );
}

/* ================================================================
   TOOLTIP OVERLAY — HTML tooltip over the canvas
   ================================================================ */
function Tooltip({
  alert,
  position,
}: {
  alert: AlertPoint;
  position: { x: number; y: number };
}) {
  const priorityColor =
    alert.priority === 'High'
      ? 'text-red-400 bg-red-500/20 border-red-500/40'
      : alert.priority === 'Medium'
      ? 'text-orange-400 bg-orange-500/20 border-orange-500/40'
      : 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      <div className="bg-charcoal-950/95 backdrop-blur-md border border-charcoal-700 rounded-xl px-4 py-3 shadow-modal text-left min-w-[180px]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">
          LIVE ALERT
        </div>
        <div className="text-xs font-bold text-white mb-1.5">{alert.label}</div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-charcoal-400">Location:</span>
            <span className="text-teal-400 font-semibold">{alert.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-charcoal-400">Priority:</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${priorityColor}`}>
              {alert.priority}
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1.5 border-t border-charcoal-800 text-[9px] text-charcoal-500 font-mono">
          SYNTHETIC DATA VISUALIZATION
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   EXPORTED COMPONENT — The full globe with canvas + overlays
   ================================================================ */
export const SafetyGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredAlert, setHoveredAlert] = useState<AlertPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleAlertHover = useCallback((alert: AlertPoint, screenPos: { x: number; y: number }) => {
    setHoveredAlert(alert);
    setTooltipPos(screenPos);
  }, []);

  const handleAlertLeave = useCallback(() => {
    setHoveredAlert(null);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[440px] lg:h-[480px]">
      {/* WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene
          onAlertHover={handleAlertHover}
          onAlertLeave={handleAlertLeave}
        />
      </Canvas>

      {/* Tooltip */}
      {hoveredAlert && (
        <Tooltip alert={hoveredAlert} position={tooltipPos} />
      )}

      {/* Bottom label */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span className="inline-block text-[9px] font-mono font-bold text-teal-600/60 dark:text-teal-500/50 bg-charcoal-950/50 backdrop-blur-sm px-3 py-1 rounded-full border border-teal-700/20">
          LIVE SAFETY NETWORK • OPERATIONAL RESPONSE VIEW
        </span>
      </div>
    </div>
  );
};
