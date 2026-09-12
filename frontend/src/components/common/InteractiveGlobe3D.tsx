import React, { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/* ================================================================
   1. GLOBALLY DISTRIBUTED SYNTHETIC ALERT DATA
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
  { id: 1,  lat: 40.71,  lng: -74.01, location: 'New York, USA',       priority: 'High',   label: 'High Risk Activity' },
  { id: 2,  lat: 34.05,  lng: -118.24,location: 'Los Angeles, USA',   priority: 'Medium', label: 'Observation' },
  { id: 3,  lat: -23.55, lng: -46.63, location: 'São Paulo, Brazil',   priority: 'Medium', label: 'Monitoring' },
  { id: 4,  lat: 51.51,  lng: -0.13,  location: 'London, UK',          priority: 'Medium', label: 'Monitoring' },
  { id: 5,  lat: 48.86,  lng: 2.35,   location: 'Paris, France',       priority: 'Low',    label: 'Observation' },
  { id: 6,  lat: 6.52,   lng: 3.38,   location: 'Lagos, Nigeria',      priority: 'High',   label: 'Alert' },
  { id: 7,  lat: 30.04,  lng: 31.24,  location: 'Cairo, Egypt',        priority: 'Low',    label: 'Monitoring' },
  { id: 8,  lat: 25.20,  lng: 55.27,  location: 'Dubai, UAE',          priority: 'Medium', label: 'Observation' },
  { id: 9,  lat: 19.08,  lng: 72.88,  location: 'Mumbai, India',       priority: 'High',   label: 'High Risk Activity' },
  { id: 10, lat: 28.63,  lng: 77.22,  location: 'Delhi, India',        priority: 'High',   label: 'Alert' },
  { id: 11, lat: 13.76,  lng: 100.50, location: 'Bangkok, Thailand',   priority: 'Medium', label: 'Possible Distress' },
  { id: 12, lat: 35.68,  lng: 139.69, location: 'Tokyo, Japan',        priority: 'Low',    label: 'Monitoring' },
  { id: 13, lat: -33.87, lng: 151.21, location: 'Sydney, Australia',   priority: 'Medium', label: 'Observation' },
  { id: 14, lat: -1.29,  lng: 36.82,  location: 'Nairobi, Kenya',      priority: 'High',   label: 'Alert' },
];

/* Connection line pairs (indices into DEMO_ALERTS) + colours */
const CONNECTION_PAIRS: [number, number, string][] = [
  [8, 9,  '#ff4444'], // Mumbai ↔ Delhi
  [3, 4,  '#38bdf8'], // London ↔ Paris
  [0, 2,  '#2dd4bf'], // New York ↔ São Paulo
  [6, 13, '#ff6b6b'], // Cairo ↔ Nairobi
  [7, 8,  '#ff8c42'], // Dubai ↔ Mumbai
  [10, 11,'#38bdf8'], // Bangkok ↔ Tokyo
  [10, 12,'#2dd4bf'], // Bangkok ↔ Sydney
];

/* Network Connectivity Nodes (Non-alert Cyan/Teal Nodes) */
const NETWORK_NODES: { lat: number; lng: number }[] = [
  { lat: 37.77, lng: -122.41 }, // San Francisco
  { lat: 41.87, lng: -87.62 },  // Chicago
  { lat: -34.60, lng: -58.38 }, // Buenos Aires
  { lat: 52.52, lng: 13.40 },   // Berlin
  { lat: 41.90, lng: 12.49 },   // Rome
  { lat: 55.75, lng: 37.61 },   // Moscow
  { lat: 1.35,   lng: 103.81 }, // Singapore
  { lat: 22.31, lng: 114.16 },  // Hong Kong
  { lat: 37.56, lng: 126.97 },  // Seoul
  { lat: -26.20, lng: 28.04 },  // Johannesburg
  { lat: -36.84, lng: 174.76 }, // Auckland
  { lat: 13.08, lng: 80.27 },   // Chennai
  { lat: 22.57, lng: 88.36 },   // Kolkata
  { lat: 12.97, lng: 77.59 },   // Bengaluru
  { lat: 24.86, lng: 67.00 },   // Karachi
  { lat: 14.59, lng: 120.98 },  // Manila
  { lat: -6.20,  lng: 106.84 }, // Jakarta
  { lat: 19.43, lng: -99.13 },  // Mexico City
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
   2. REALISTIC 3D EARTH SPHERE
   ================================================================ */
function RealisticEarthSphere({ radius }: { radius: number }) {
  const dayMap = useLoader(THREE.TextureLoader, '/earth-day.jpg');
  const specularMap = useLoader(THREE.TextureLoader, '/earth-specular.jpg');
  const normalMap = useLoader(THREE.TextureLoader, '/earth-normal.jpg');

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: dayMap,
      specularMap: specularMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specular: new THREE.Color('#3388aa'),
      shininess: 25,
    });
  }, [dayMap, specularMap, normalMap]);

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
}

/* ================================================================
   3. SEPARATE ROTATING CLOUD LAYER
   ================================================================ */
function RealisticCloudLayer({ radius }: { radius: number }) {
  const cloudGroupRef = useRef<THREE.Group>(null!);
  const cloudsMap = useLoader(THREE.TextureLoader, '/earth-clouds.png');

  useFrame((_, delta) => {
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y += ((Math.PI * 2) / 36) * delta;
    }
  });

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
  }, [cloudsMap]);

  return (
    <group ref={cloudGroupRef}>
      <mesh material={material} scale={[1.018, 1.018, 1.018]}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>
    </group>
  );
}

/* ================================================================
   4. ATMOSPHERIC OUTER RIM GLOW
   ================================================================ */
function AtmosphereGlow({ radius }: { radius: number }) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#26c7a7') },
        coefficient: { value: 0.65 },
        power: { value: 3.2 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float coefficient;
        uniform float power;

        varying vec3 vNormal;
        varying vec3 vPositionNormal;

        void main() {
          float intensity = pow(coefficient - dot(vNormal, vPositionNormal), power);
          gl_FragColor = vec4(glowColor, intensity * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh material={shaderMaterial} scale={[1.10, 1.10, 1.10]}>
      <sphereGeometry args={[radius, 48, 48]} />
    </mesh>
  );
}

/* ================================================================
   5. NETWORK CONNECTIVITY NODES (SECONDARY ACCENT)
   ================================================================ */
function NetworkNodes({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    NETWORK_NODES.forEach((node) => {
      const vec = latLngToVec3(node.lat, node.lng, radius + 0.022);
      positions.push(vec.x, vec.y, vec.z);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [radius]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#38bdf8'),
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return <points geometry={geometry} material={material} />;
}

/* ================================================================
   6. RED ALERT HOTSPOT — ATTACHED TO EARTH & STAGGERED PULSE
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
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const position = useMemo(() => latLngToVec3(alert.lat, alert.lng, radius + 0.025), [alert, radius]);

  const phaseOffset = useMemo(() => (alert.id * 0.75) % (Math.PI * 2), [alert.id]);
  const { camera, size } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 2.2 + phaseOffset) * 0.5 + 0.5;

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.88 + 0.12 * pulse;
      coreRef.current.scale.setScalar(0.95 + 0.25 * pulse);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + 0.2 * pulse;
      glowRef.current.scale.setScalar(1.0 + 0.6 * pulse);
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + 0.25 * pulse;
      ringRef.current.scale.setScalar(1.0 + 1.0 * pulse);
    }
  });

  const handlePointerEnter = useCallback(
    (e: any) => {
      e.stopPropagation();
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const projected = worldPos.clone().project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (-projected.y * 0.5 + 0.5) * size.height;
      onHover(alert, { x: screenX, y: screenY });
    },
    [alert, camera, size, onHover]
  );

  const handlePointerLeave = useCallback(
    (e: any) => {
      e.stopPropagation();
      onLeave();
    },
    [onLeave]
  );

  const coreColor = alert.priority === 'High' ? '#FF2233' : alert.priority === 'Medium' ? '#FF554D' : '#FF7770';

  return (
    <group ref={groupRef} position={position}>
      {/* Outer pulse ring */}
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.048, 12, 12]} />
        <meshBasicMaterial color="#FF554D" transparent opacity={0.20} depthWrite={false} />
      </mesh>
      {/* Mid glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#FF2233" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      {/* Core point */}
      <mesh
        ref={coreRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.98} />
      </mesh>
    </group>
  );
}

/* ================================================================
   7. CONNECTION ARCS BETWEEN ALERT NODES
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
    const start = latLngToVec3(from.lat, from.lng, radius + 0.02);
    const end = latLngToVec3(to.lat, to.lng, radius + 0.02);
    const mid = start.clone().add(end).multiplyScalar(0.5);

    const midLen = mid.length();
    const arcHeight = start.distanceTo(end) * 0.28;
    mid.normalize().multiplyScalar(midLen + arcHeight);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.45,
    });
    return new THREE.Line(geom, mat);
  }, [from, to, radius, color]);

  return <primitive object={lineObj} />;
}

/* ================================================================
   8. MAIN ROTATING GLOBE SCENE WITH DRAG & AUTO-ROTATION
   ================================================================ */
function GlobeScene({
  onAlertHover,
  onAlertLeave,
  isDragging,
  dragDelta,
}: {
  onAlertHover: (alert: AlertPoint, screenPos: { x: number; y: number }) => void;
  onAlertLeave: () => void;
  isDragging: boolean;
  dragDelta: { x: number; y: number };
}) {
  const rotatingEarthGroupRef = useRef<THREE.Group>(null!);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idleTimerRef = useRef<number>(0);
  const GLOBE_RADIUS = 1.35; // Safe radius to prevent any frustum clipping

  // Frame animation loop: handle Drag, Inertia, & Auto-rotation
  useFrame((_, delta) => {
    if (!rotatingEarthGroupRef.current) return;

    if (isDragging) {
      // User is dragging: apply drag deltas directly
      const rotY = dragDelta.x * 0.006;
      const rotX = dragDelta.y * 0.004;

      rotatingEarthGroupRef.current.rotation.y += rotY;
      rotatingEarthGroupRef.current.rotation.x = THREE.MathUtils.clamp(
        rotatingEarthGroupRef.current.rotation.x + rotX,
        -0.5,
        0.5
      );

      // Track rotational velocity for inertia
      velocityRef.current = { x: rotY, y: rotX };
      idleTimerRef.current = 0;
    } else {
      // User released: apply inertia decay
      if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
        rotatingEarthGroupRef.current.rotation.y += velocityRef.current.x;
        rotatingEarthGroupRef.current.rotation.x = THREE.MathUtils.clamp(
          rotatingEarthGroupRef.current.rotation.x + velocityRef.current.y,
          -0.5,
          0.5
        );
        velocityRef.current.x *= 0.93;
        velocityRef.current.y *= 0.93;
      }

      idleTimerRef.current += delta;

      // Resume smooth auto-rotation after 0.6s idle time
      if (idleTimerRef.current > 0.6) {
        rotatingEarthGroupRef.current.rotation.y += ((Math.PI * 2) / 28) * delta;
        // Slowly return vertical tilt back to center
        rotatingEarthGroupRef.current.rotation.x *= 0.97;
      }
    }
  });

  return (
    <>
      {/* Lighting for realistic 3D Earth shading */}
      <ambientLight intensity={0.50} color="#d4f0ec" />
      <directionalLight position={[5, 3, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#10332c" />

      {/* Atmospheric outer glow rim */}
      <AtmosphereGlow radius={GLOBE_RADIUS} />

      {/* Cloud Layer (rotates independently) */}
      <RealisticCloudLayer radius={GLOBE_RADIUS} />

      {/* Rotating 3D Earth World */}
      <group ref={rotatingEarthGroupRef}>
        {/* Realistic NASA Blue Marble Earth Sphere */}
        <RealisticEarthSphere radius={GLOBE_RADIUS} />

        {/* Network connectivity nodes */}
        <NetworkNodes radius={GLOBE_RADIUS} />

        {/* Red alert hotspots (Attached to Earth surface) */}
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
        {CONNECTION_PAIRS.map(([fromIdx, toIdx, color], i) => (
          <ConnectionArc
            key={i}
            from={DEMO_ALERTS[fromIdx]}
            to={DEMO_ALERTS[toIdx]}
            radius={GLOBE_RADIUS}
            color={color}
          />
        ))}
      </group>
    </>
  );
}

/* ================================================================
   9. FALLBACK & TOOLTIP OVERLAY
   ================================================================ */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
    </div>
  );
}

function Tooltip({
  alert,
  position,
}: {
  alert: AlertPoint;
  position: { x: number; y: number };
}) {
  const priorityStyle =
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
        transform: 'translate(-50%, -130%)',
      }}
    >
      <div className="bg-charcoal-950/95 backdrop-blur-md border border-charcoal-700 rounded-xl px-4 py-3 shadow-modal text-left min-w-[180px]">
        <div className="text-[9px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">
          DEMO ALERT
        </div>
        <div className="text-xs font-bold text-white mb-1.5">{alert.label}</div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-charcoal-400">Location:</span>
            <span className="text-teal-400 font-semibold">{alert.location}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-charcoal-400">Priority:</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${priorityStyle}`}>
              {alert.priority}
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1.5 border-t border-charcoal-800 text-[8px] text-charcoal-500 font-mono">
          SYNTHETIC DATA VISUALIZATION
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   10. EXPORTED COMPONENT — DRAGGABLE, AUTO-ROTATING, FULLY VISIBLE
   ================================================================ */
export const InteractiveGlobe3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredAlert, setHoveredAlert] = useState<AlertPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setDragDelta({ x: 0, y: 0 });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setDragDelta({ x: dx, y: dy });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    setDragDelta({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  const handleAlertHover = useCallback((alert: AlertPoint, screenPos: { x: number; y: number }) => {
    setHoveredAlert(alert);
    setTooltipPos(screenPos);
  }, []);

  const handleAlertLeave = useCallback(() => {
    setHoveredAlert(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full min-h-[460px] flex items-center justify-center pointer-events-auto touch-none select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 45 }}
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
            isDragging={isDragging}
            dragDelta={dragDelta}
          />
        </Canvas>
      </Suspense>

      {/* Interactive Tooltip */}
      {hoveredAlert && (
        <Tooltip alert={hoveredAlert} position={tooltipPos} />
      )}
    </div>
  );
};
