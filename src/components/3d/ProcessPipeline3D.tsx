import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, OrbitControls, Text, Torus } from "@react-three/drei";
import * as THREE from "three";

const STAGES = [
  { label: "01 Discovery", color: "#a78bfa" },
  { label: "02 Design", color: "#67e8f9" },
  { label: "03 Engineering", color: "#34d399" },
  { label: "04 Launch", color: "#fbbf24" },
  { label: "05 Learning", color: "#f472b6" },
];

const RADIUS = 3.6;

function positions() {
  return STAGES.map((_, i) => {
    const a = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
    return new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS * 0.55, 0);
  });
}

function StageNode({
  position,
  color,
  label,
  index,
}: {
  position: THREE.Vector3;
  color: string;
  label: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2 + index) * 0.08;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.6}>
      <group position={position}>
        <Icosahedron ref={ref} args={[0.45, 1]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.1}
            roughness={0.25}
            metalness={0.4}
            wireframe
          />
        </Icosahedron>
        <Icosahedron args={[0.55, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.12} />
        </Icosahedron>
        <Text
          position={[0, -0.95, 0]}
          fontSize={0.22}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#000"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Connection({
  from,
  to,
  color,
  offset,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  offset: number;
}) {
  const points = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.z += 0.6;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return curve.getPoints(40);
  }, [from, to]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  const particleRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!particleRef.current) return;
    const t = (state.clock.elapsedTime * 0.35 + offset) % 1;
    const idx = Math.floor(t * (points.length - 1));
    const p = points[idx];
    particleRef.current.position.set(p.x, p.y, p.z);
  });

  return (
    <group>
      <primitive object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }))} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.3;
    ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#6c63ff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  return (
    <>
      {[1, 1.4, 1.8].map((s, i) => (
        <Torus key={i} args={[RADIUS * 0.95, 0.008, 16, 100]} rotation={[Math.PI / 2.2, i * 0.4, 0]}>
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.18 - i * 0.04} />
        </Torus>
      ))}
    </>
  );
}

function Scene() {
  const pts = useMemo(() => positions(), []);
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.z += dt * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#67e8f9" />

      <group ref={groupRef}>
        <Core />
        <OrbitRings />
        {STAGES.map((s, i) => (
          <StageNode key={s.label} position={pts[i]} color={s.color} label={s.label} index={i} />
        ))}
        {STAGES.map((s, i) => {
          const next = (i + 1) % STAGES.length;
          return (
            <Connection
              key={`c-${i}`}
              from={pts[i]}
              to={pts[next]}
              color={s.color}
              offset={i / STAGES.length}
            />
          );
        })}
      </group>
    </>
  );
}

export function ProcessPipeline3D() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border"
      style={{
        height: 480,
        background:
          "radial-gradient(ellipse at center, rgba(108,99,255,0.12), transparent 70%), #03030a",
        borderColor: "rgba(108,99,255,0.3)",
        boxShadow: "0 0 60px rgba(108,99,255,0.15) inset",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8.5], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] text-[#a78bfa]/80 pointer-events-none">
        Neural Process · Live 3D
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-[#67e8f9]/70 pointer-events-none">
        Drag to rotate
      </div>
    </div>
  );
}
