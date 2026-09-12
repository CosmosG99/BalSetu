import React, { useRef, useMemo, useState, useCallback, useEffect, Suspense } from 'react';
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

/* Network Connectivity Nodes (Non-alert Teal/Cyan Nodes) */
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
   2. DARK DIGITAL BASE EARTH (DARK INTERIOR)
   ================================================================ */
function DarkEarthBase({ radius }: { radius: number }) {
  const topoTexture = useLoader(THREE.TextureLoader, '/earth-topology.png');

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topoMap: { value: topoTexture },
        lightDir: { value: new THREE.Vector3(1.0, 0.5, 1.0).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D topoMap;
        uniform vec3 lightDir;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vec4 topo = texture2D(topoMap, vUv);
          float lum = dot(topo.rgb, vec3(0.299, 0.587, 0.114));

          // Dark interior colors (#06151D base)
          vec3 darkOcean = vec3(0.024, 0.075, 0.095); // #061318 deep ocean
          vec3 darkLand  = vec3(0.040, 0.130, 0.115); // #0A211D dark land

          float landMask = smoothstep(0.12, 0.35, lum);
          vec3 baseColor = mix(darkOcean, darkLand, landMask);

          float diff = max(dot(vNormal, lightDir), 0.18);
          gl_FragColor = vec4(baseColor * diff, 1.0);
        }
      `,
    });
  }, [topoTexture]);

  return (
    <mesh material={shaderMaterial}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
}

/* ================================================================
   3. DOTTED CONTINENT PARTICLES (DENSE DIGITAL HALFTONE SURFACE)
   ================================================================ */
function DottedContinents({ radius }: { radius: number }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/earth-topology.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, 1024, 512);
      const imgData = ctx.getImageData(0, 0, 1024, 512);

      const positions: number[] = [];
      const colors: number[] = [];
      const sizes: number[] = [];

      // Dense lat/lng sampling for halftone continental dots
      for (let lat = -84; lat <= 84; lat += 1.2) {
        const radLat = (lat * Math.PI) / 180;
        const cosLat = Math.cos(radLat);
        const lngStep = 1.2 / Math.max(0.2, cosLat);

        for (let lng = -180; lng < 180; lng += lngStep) {
          const u = (lng + 180) / 360;
          const v = (90 - lat) / 180;
          const px = Math.floor(u * 1024);
          const py = Math.floor(v * 512);
          const idx = (py * 1024 + px) * 4;

          const r = imgData.data[idx];
          const g = imgData.data[idx + 1];
          const b = imgData.data[idx + 2];
          const bright = (r + g + b) / 3;

          if (bright > 40) {
            // Land point: render crisp particle dot
            const vec = latLngToVec3(lat, lng, radius + 0.006);
            positions.push(vec.x, vec.y, vec.z);

            const isHighland = bright > 110;
            const isCoast = bright > 40 && bright < 75;

            let col = new THREE.Color('#2dd4bf'); // bright teal default
            if (isHighland) col = new THREE.Color('#38bdf8'); // bright cyan
            else if (isCoast) col = new THREE.Color('#10b981'); // emerald

            colors.push(col.r, col.g, col.b);
            sizes.push(isHighland ? 0.030 : 0.024);
          } else {
            // Ocean point: sparse dark teal dots for high-tech digital grid feel
            if (Math.random() < 0.04) {
              const vec = latLngToVec3(lat, lng, radius + 0.003);
              positions.push(vec.x, vec.y, vec.z);
              const oceanCol = new THREE.Color('#083935');
              colors.push(oceanCol.r, oceanCol.g, oceanCol.b);
              sizes.push(0.014);
            }
          }
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));
      geom.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
      setGeometry(geom);
    };
  }, [radius]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uLightDir: { value: new THREE.Vector3(1.0, 0.5, 1.0).normalize() },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying vec3 vWorldPos;

        void main() {
          vColor = aColor;
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (360.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying vec3 vWorldPos;
        uniform vec3 uLightDir;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.15, dist);

          vec3 normal = normalize(vWorldPos);
          float diff = max(dot(normal, uLightDir), 0.22);

          gl_FragColor = vec4(vColor * diff, alpha * 0.95);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  if (!geometry) return null;

  return <points geometry={geometry} material={shaderMaterial} />;
}

/* ================================================================
   4. NETWORK NODES (NON-ALERT CYAN/TEAL NODES)
   ================================================================ */
function NetworkNodes({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    NETWORK_NODES.forEach((node) => {
      const vec = latLngToVec3(node.lat, node.lng, radius + 0.008);
      positions.push(vec.x, vec.y, vec.z);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [radius]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#38bdf8'),
      size: 0.04,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return <points geometry={geometry} material={material} />;
}

/* ================================================================
   5. ATMOSPHERIC OUTER RIM GLOW
   ================================================================ */
function AtmosphereGlow({ radius }: { radius: number }) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#1a8c73') },
        coefficient: { value: 0.65 },
        power: { value: 3.5 },
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
          gl_FragColor = vec4(glowColor, intensity * 0.75);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh material={shaderMaterial} scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 48, 48]} />
    </mesh>
  );
}

/* ================================================================
   6. RED ALERT HOTSPOT — ATTACHED TO GLOBE & STAGGERED PULSE
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
  const position = useMemo(() => latLngToVec3(alert.lat, alert.lng, radius + 0.012), [alert, radius]);

  // Staggered animation phase
  const phaseOffset = useMemo(() => (alert.id * 0.75) % (Math.PI * 2), [alert.id]);

  const { camera, size } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 2.2 + phaseOffset) * 0.5 + 0.5;

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.8 + 0.2 * pulse;
      coreRef.current.scale.setScalar(0.85 + 0.25 * pulse);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + 0.15 * pulse;
      glowRef.current.scale.setScalar(1.0 + 0.5 * pulse);
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + 0.22 * pulse;
      ringRef.current.scale.setScalar(1.0 + 0.9 * pulse);
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

  const coreColor = alert.priority === 'High' ? '#ff2244' : alert.priority === 'Medium' ? '#ff5555' : '#ff7777';

  return (
    <group ref={groupRef} position={position}>
      {/* Outer pulse ring */}
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      {/* Mid glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial color="#ff5555" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {/* Core point */}
      <mesh
        ref={coreRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/* ================================================================
   7. CONNECTION ARCS BETWEEN NODES
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

    const midLen = mid.length();
    const arcHeight = start.distanceTo(end) * 0.28;
    mid.normalize().multiplyScalar(midLen + arcHeight);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.35,
    });
    return new THREE.Line(geom, mat);
  }, [from, to, radius, color]);

  return <primitive object={lineObj} />;
}

/* ================================================================
   8. ORBITAL ARCS SURROUNDING THE GLOBE
   ================================================================ */
function OrbitalArcs({ radius }: { radius: number }) {
  const arcs = useMemo(() => {
    const configs = [
      { r: radius * 1.18, tiltX: 0.45, tiltZ: 0.2,  color: '#2dd4bf', opacity: 0.35 },
      { r: radius * 1.25, tiltX: -0.6, tiltZ: -0.3, color: '#38bdf8', opacity: 0.30 },
      { r: radius * 1.32, tiltX: 0.9,  tiltZ: 0.7,  color: '#c084fc', opacity: 0.20 },
    ];

    return configs.map((cfg, idx) => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * cfg.r, 0, Math.sin(theta) * cfg.r));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: cfg.opacity,
      });
      const line = new THREE.Line(geom, mat);
      line.rotation.x = cfg.tiltX;
      line.rotation.z = cfg.tiltZ;
      return { key: idx, line };
    });
  }, [radius]);

  return (
    <>
      {arcs.map((arc) => (
        <primitive key={arc.key} object={arc.line} />
      ))}
    </>
  );
}

/* ================================================================
   9. MAIN ROTATING GLOBE SCENE
   ================================================================ */
function GlobeScene({
  onAlertHover,
  onAlertLeave,
}: {
  onAlertHover: (alert: AlertPoint, screenPos: { x: number; y: number }) => void;
  onAlertLeave: () => void;
}) {
  const rotatingGroupRef = useRef<THREE.Group>(null!);
  const GLOBE_RADIUS = 1.55;

  // Continuous rotation: ~28 seconds per revolution
  useFrame(({ clock }) => {
    if (rotatingGroupRef.current) {
      rotatingGroupRef.current.rotation.y = clock.getElapsedTime() * ((Math.PI * 2) / 28);
    }
  });

  return (
    <>
      {/* Lights for 3D depth */}
      <ambientLight intensity={0.15} color="#1a6e5c" />
      <directionalLight position={[4, 2, 5]} intensity={1.2} color="#e0fff8" />

      {/* Atmospheric outer glow rim */}
      <AtmosphereGlow radius={GLOBE_RADIUS} />

      {/* Orbital arcs around globe silhouette */}
      <OrbitalArcs radius={GLOBE_RADIUS} />

      {/* Rotating 3D World (Dark Earth + Dotted Continents + Alert Hotspots + Arcs) */}
      <group ref={rotatingGroupRef}>
        {/* Dark interior base sphere */}
        <DarkEarthBase radius={GLOBE_RADIUS} />

        {/* Dotted halftone particle continents */}
        <DottedContinents radius={GLOBE_RADIUS} />

        {/* Network connectivity nodes */}
        <NetworkNodes radius={GLOBE_RADIUS} />

        {/* Red alert hotspots */}
        {DEMO_ALERTS.map((alert) => (
          <AlertHotspot
            key={alert.id}
            alert={alert}
            radius={GLOBE_RADIUS}
            onHover={onAlertHover}
            onLeave={onAlertLeave}
          />
        ))}

        {/* Connection arcs */}
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
   10. FALLBACK & TOOLTIP OVERLAY
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
   EXPORTED COMPONENT
   ================================================================ */
export const InteractiveGlobe3D: React.FC = () => {
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
    <div ref={containerRef} className="relative w-full h-full min-h-[460px] flex items-center justify-center pointer-events-auto">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.0], fov: 45 }}
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
      </Suspense>

      {/* Interactive Tooltip */}
      {hoveredAlert && (
        <Tooltip alert={hoveredAlert} position={tooltipPos} />
      )}
    </div>
  );
};
