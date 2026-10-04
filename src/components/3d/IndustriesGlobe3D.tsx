import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const INDUSTRIES = [
  { label: "Healthcare", color: "#f472b6", x: -3.2, z: -2.0 },
  { label: "Education", color: "#67e8f9", x: -1.2, z: -2.6 },
  { label: "Finance", color: "#a3e635", x: 1.4, z: -2.2 },
  { label: "Retail", color: "#fbbf24", x: 3.0, z: -0.8 },
  { label: "Manufacturing", color: "#a78bfa", x: -3.0, z: 0.4 },
  { label: "Agriculture", color: "#34d399", x: -0.6, z: 0.2 },
  { label: "Real Estate", color: "#60a5fa", x: 2.2, z: 0.8 },
  { label: "Public Sector", color: "#f59e0b", x: -2.2, z: 2.4 },
  { label: "Cybersecurity", color: "#ef4444", x: 0.8, z: 2.6 },
  { label: "Legal", color: "#c084fc", x: 3.2, z: 2.4 },
];

// Animated terrain plane — height ripples like a topographic AI landscape.
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => new THREE.PlaneGeometry(12, 9, 80, 60), []);
  const original = useMemo(() => geom.attributes.position.array.slice() as Float32Array, [geom]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const z =
        Math.sin(x * 0.6 + t * 0.7) * 0.35 +
        Math.cos(y * 0.7 + t * 0.5) * 0.35 +
        Math.sin((x + y) * 0.4 + t * 0.9) * 0.2;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <group rotation={[-Math.PI / 2.1, 0, 0]}>
      <mesh ref={meshRef} geometry={geom}>
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#4c1d95"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* solid underlay for depth */}
      <mesh geometry={geom} position={[0, 0, -0.02]}>
        <meshBasicMaterial color="#050014" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// A floating industry pin: hovers above the terrain with a beam down to the surface.
function Pin({
  x,
  z,
  color,
  label,
  index,
}: {
  x: number;
  z: number;
  color: string;
  label: string;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Read live terrain-ish height under this pin to keep beam grounded.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const hover = 1.6 + Math.sin(t * 1.2 + index * 0.7) * 0.18;
    if (groupRef.current) groupRef.current.position.y = hover;
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + (Math.sin(t * 2 + index) + 1) * 0.15;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* light beam from pin down to terrain */}
      <mesh ref={beamRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.18, 1.6, 12, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.22, 0.34, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* floating orb */}
      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} />
        </mesh>

        {/* DOM label — sharp text, no SDF font fetch */}
        <Html
          center
          position={[0, 0.55, 0]}
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 9999,
              background: "rgba(0,0,0,0.65)",
              border: `1px solid ${color}`,
              color,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
            }}
          >
            {label}
          </div>
        </Html>
      </group>
    </group>
  );
}

function Aurora() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 4, -6]}>
      <torusGeometry args={[4, 0.6, 16, 100]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.08} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} color="#a78bfa" />
      <pointLight position={[-5, 3, 4]} intensity={0.7} color="#67e8f9" />
      <pointLight position={[5, 3, -4]} intensity={0.7} color="#f472b6" />

      <Terrain />
      <Aurora />
      {INDUSTRIES.map((d, i) => (
        <Pin key={d.label} x={d.x} z={d.z} color={d.color} label={d.label} index={i} />
      ))}
    </>
  );
}

export function IndustriesGlobe3D() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border"
      style={{
        height: 520,
        background:
          "radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.25), transparent 60%), linear-gradient(180deg, #02010a 0%, #0a0420 100%)",
        borderColor: "rgba(99,102,241,0.3)",
        boxShadow: "0 0 80px rgba(99,102,241,0.18) inset",
      }}
    >
      <Canvas camera={{ position: [0, 3.8, 8], fov: 52 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.3}
          />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-[#a78bfa]/80 pointer-events-none">
        Industry Intelligence Landscape · Live 3D
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-[#67e8f9]/70 pointer-events-none">
        Drag to explore
      </div>
    </div>
  );
}
