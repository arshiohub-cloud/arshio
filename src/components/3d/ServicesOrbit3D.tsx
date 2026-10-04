import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, OrbitControls, Text, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

const SERVICES = [
  { label: "Strategy", color: "#a78bfa", slug: "strategy" },
  { label: "Agents", color: "#67e8f9", slug: "agents" },
  { label: "RAG", color: "#34d399", slug: "rag" },
  { label: "Copilots", color: "#f472b6", slug: "copilots" },
  { label: "Automation", color: "#fbbf24", slug: "automation" },
  { label: "Training", color: "#c084fc", slug: "training" },
];

function scrollToCap(slug: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(`cap-${slug}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.animate(
    [
      { boxShadow: "0 0 0 0 rgba(167,139,250,0)" },
      { boxShadow: "0 0 0 6px rgba(167,139,250,0.55)" },
      { boxShadow: "0 0 0 0 rgba(167,139,250,0)" },
    ],
    { duration: 1400, easing: "ease-out" }
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.4;
      ref.current.rotation.y += dt * 0.5;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.6}>
      <Icosahedron ref={ref} args={[1.1, 1]}>
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#4c1d95"
          emissiveIntensity={0.8}
          wireframe
        />
      </Icosahedron>
      <Sphere args={[0.65, 32, 32]}>
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.6} transparent opacity={0.35} />
      </Sphere>
    </Float>
  );
}

function ServiceNode({
  index, total, label, color, slug,
}: { index: number; total: number; label: string; color: string; slug: string }) {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  const radius = 3.4;
  const phase = (index / total) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const a = phase + t * 0.25;
    const y = Math.sin(t * 0.8 + index) * 0.45;
    group.current.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    group.current.lookAt(0, 0, 0);
    if (meshRef.current) {
      const target = hovered ? 1.7 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.18);
    }
  });

  const linePts = useMemo<[number, number, number][]>(
    () => [[0, 0, 0], [0, 0, 0]],
    []
  );
  const lineRef = useRef<any>(null);

  useFrame(() => {
    if (group.current && lineRef.current) {
      const p = group.current.position;
      lineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(p.x, p.y, p.z)]);
    }
  });

  return (
    <>
      <Line ref={lineRef} points={linePts} color={color} lineWidth={hovered ? 2.5 : 1} transparent opacity={hovered ? 0.9 : 0.35} />
      <group ref={group}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); scrollToCap(slug); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2.2 : 1.2} />
        </mesh>
        <Text
          position={[0, 0.55, 0]}
          fontSize={hovered ? 0.28 : 0.22}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000"
          onClick={(e) => { e.stopPropagation(); scrollToCap(slug); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
          {label}
        </Text>
      </group>
    </>
  );
}

function Ring({ radius, tilt }: { radius: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.1;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 128]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#67e8f9" />
      <Core />
      <Ring radius={3.4} tilt={0} />
      <Ring radius={3.4} tilt={0.5} />
      <Ring radius={3.4} tilt={-0.5} />
      {SERVICES.map((s, i) => (
        <ServiceNode key={s.label} index={i} total={SERVICES.length} label={s.label} color={s.color} slug={s.slug} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function ServicesOrbit3D() {
  return (
    <div className="relative w-full" style={{ height: 520 }}>
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(circle at center, transparent 55%, #000 95%)",
      }} />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-[#888]">
        Drag to explore · 6 services orbit a unified AI core
      </div>
    </div>
  );
}
