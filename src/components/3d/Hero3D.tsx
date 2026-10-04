import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, TorusKnot, Sphere, Points, PointMaterial, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Variant = "network" | "torus" | "orbs" | "core" | "spiral" | "grid" | "particles";

function NeuralNetwork() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      arr.push([
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ]);
    }
    return arr;
  }, []);
  const edges = useMemo(() => {
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return;
        const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        if (d < 2.4) out.push([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
      });
    });
    return out;
  }, [nodes]);
  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.15;
      group.current.rotation.x = Math.sin(performance.now() * 0.0003) * 0.2;
    }
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <Float key={i} speed={1 + (i % 3)} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={p}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1.4} />
          </mesh>
        </Float>
      ))}
      {edges.map((e, i) => (
        <Line key={i} points={[e[0], e[1]]} color="#a3e635" lineWidth={0.6} transparent opacity={0.25} />
      ))}
    </group>
  );
}

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.3;
      ref.current.rotation.y += dt * 0.4;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1.6, 1]}>
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          wireframe
        />
      </Icosahedron>
      <Sphere args={[1.55, 32, 32]}>
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.4} emissive="#a3e635" emissiveIntensity={0.15} />
      </Sphere>
    </Float>
  );
}

function TorusBrain() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.2;
      ref.current.rotation.y += dt * 0.35;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.6} floatIntensity={0.8}>
      <TorusKnot ref={ref} args={[1.2, 0.35, 200, 32]}>
        <meshStandardMaterial color="#a3e635" emissive="#67e8f9" emissiveIntensity={0.5} wireframe />
      </TorusKnot>
    </Float>
  );
}

function OrbitOrbs() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.4;
  });
  const orbs = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      r: 2.6,
      color: i % 2 ? "#67e8f9" : "#a3e635",
    })),
    []
  );
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#67e8f9" emissiveIntensity={0.8} />
      </mesh>
      {orbs.map((o, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={0.4}>
          <mesh position={[Math.cos(o.angle) * o.r, Math.sin(o.angle * 2) * 0.5, Math.sin(o.angle) * o.r]}>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshStandardMaterial color={o.color} emissive={o.color} emissiveIntensity={1.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SpiralField() {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 200; i++) {
      const t = i * 0.12;
      out.push([Math.cos(t) * (1 + t * 0.08), (t - 8) * 0.18, Math.sin(t) * (1 + t * 0.08)]);
    }
    return out;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={ref}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={i % 2 ? "#67e8f9" : "#a3e635"} emissive={i % 2 ? "#67e8f9" : "#a3e635"} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}

function GridPlanes() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });
  return (
    <group ref={ref} rotation={[-0.4, 0, 0]}>
      {[-1.5, 0, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6, 12, 12]} />
          <meshBasicMaterial color={i % 2 ? "#67e8f9" : "#a3e635"} wireframe transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      a[i * 3] = (Math.random() - 0.5) * 10;
      a[i * 3 + 1] = (Math.random() - 0.5) * 6;
      a[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return a;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.05;
      ref.current.rotation.x += dt * 0.02;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#67e8f9" size={0.04} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

function Scene({ variant }: { variant: Variant }) {
  switch (variant) {
    case "network": return <NeuralNetwork />;
    case "core": return <CoreOrb />;
    case "torus": return <TorusBrain />;
    case "orbs": return <OrbitOrbs />;
    case "spiral": return <SpiralField />;
    case "grid": return <GridPlanes />;
    case "particles": return <ParticleCloud />;
  }
}

export function Hero3D({
  variant = "network",
  height = 380,
  interactive = false,
  className = "",
}: {
  variant?: Variant;
  height?: number;
  interactive?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} className={className} />;
  return (
    <div style={{ height }} className={`relative w-full ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} color="#67e8f9" intensity={1.4} />
        <pointLight position={[-5, -3, -3]} color="#a3e635" intensity={0.8} />
        <Suspense fallback={null}>
          <Scene variant={variant} />
        </Suspense>
        {interactive && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />}
      </Canvas>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, transparent, rgba(0,0,0,0.85) 85%)",
        }}
      />
    </div>
  );
}
