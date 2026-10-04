import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Product Stack 3D
 * A stacked architecture visualization (different from orbits / globes / pipelines used elsewhere).
 * Horizontal layers represent the AI stack each product is built on; particles travel
 * vertically between layers to show live inference flow. Hovering a layer dims the rest.
 */

type Layer = { name: string; sub: string; color: string; y: number };

const LAYERS: Layer[] = [
  { name: "Experience", sub: "Chat · Search · Dashboards", color: "#67e8f9", y: 2.2 },
  { name: "Agents", sub: "Planning · Tool use · Memory", color: "#a78bfa", y: 1.1 },
  { name: "Models", sub: "LLMs · Vision · Voice", color: "#f472b6", y: 0 },
  { name: "Retrieval", sub: "RAG · Embeddings · Vector DB", color: "#a3e635", y: -1.1 },
  { name: "Data + Infra", sub: "Pipelines · Guardrails · Eval", color: "#fbbf24", y: -2.2 },
];

function LayerSlab({
  layer,
  active,
  dim,
  onHover,
  onLeave,
}: {
  layer: Layer;
  active: boolean;
  dim: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = layer.y + (active ? Math.sin(t * 2) * 0.04 : 0);
  });

  const opacity = dim ? 0.18 : active ? 0.95 : 0.62;

  return (
    <group
      ref={ref}
      position={[0, layer.y, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
      }}
      onPointerOut={onLeave}
    >
      <RoundedBox args={[5.2, 0.18, 3]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={layer.color}
          emissive={layer.color}
          emissiveIntensity={active ? 0.9 : 0.35}
          transparent
          opacity={opacity}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      {/* glow rim */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.85, 0.015, 8, 80]} />
        <meshBasicMaterial color={layer.color} transparent opacity={active ? 0.9 : 0.4} />
      </mesh>
      <Text
        position={[-2.4, 0.22, 0]}
        fontSize={0.26}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        fillOpacity={dim ? 0.3 : 1}
      >
        {layer.name}
      </Text>
      <Text
        position={[-2.4, -0.05, 0]}
        fontSize={0.13}
        color={layer.color}
        anchorX="left"
        anchorY="middle"
        fillOpacity={dim ? 0.25 : 0.9}
      >
        {layer.sub}
      </Text>
    </group>
  );
}

function FlowParticles({ active }: { active: number | null }) {
  const COUNT = 140;
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(
    () =>
      new Array(COUNT).fill(0).map(() => ({
        x: (Math.random() - 0.5) * 4.4,
        z: (Math.random() - 0.5) * 2.4,
        speed: 0.4 + Math.random() * 0.9,
        offset: Math.random() * 6,
        color: LAYERS[Math.floor(Math.random() * LAYERS.length)].color,
      })),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    data.forEach((p, i) => {
      const y = (((t * p.speed + p.offset) % 5) - 2.5);
      dummy.position.set(p.x, y, p.z);
      const s = 0.035 + Math.sin(t * 3 + p.offset) * 0.012;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      colorObj.set(p.color);
      if (active !== null) {
        const layerY = LAYERS[active].y;
        const near = 1 - Math.min(1, Math.abs(y - layerY) / 0.9);
        colorObj.multiplyScalar(0.25 + near * 1.4);
      }
      ref.current!.setColorAt(i, colorObj);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.95} />
    </instancedMesh>
  );
}

function Scene({
  active,
  setActive,
}: {
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1.1} color="#67e8f9" />
      <pointLight position={[-5, -3, 4]} intensity={0.7} color="#a78bfa" />
      <group ref={group}>
        {LAYERS.map((l, i) => (
          <LayerSlab
            key={l.name}
            layer={l}
            active={active === i}
            dim={active !== null && active !== i}
            onHover={() => setActive(i)}
            onLeave={() => setActive(null)}
          />
        ))}
        <FlowParticles active={active} />
        {/* spine */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 4.6, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>
    </>
  );
}

export function AIProductStack3D() {
  const [active, setActive] = useState<number | null>(null);
  const [ips, setIps] = useState(2841);

  React.useEffect(() => {
    const id = setInterval(() => setIps((v) => v + Math.floor(20 + Math.random() * 60)), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden glass-card">
      <Canvas camera={{ position: [4.8, 2.2, 6.8], fov: 45 }} dpr={[1, 1.6]}>
        <Suspense fallback={null}>
          <Scene active={active} setActive={setActive} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>

      {/* HUD overlays */}
      <div className="pointer-events-none absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="pointer-events-auto">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#67e8f9]">Live AI Stack</div>
            <div className="text-white font-semibold text-sm md:text-base mt-1">
              What every product is made of
            </div>
          </div>
          <div className="pointer-events-auto text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#888]">Inferences / sec</div>
            <div className="text-[#a3e635] font-bold tabular-nums text-base md:text-lg mt-1">
              {ips.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          <div className="flex flex-wrap gap-2">
            {LAYERS.map((l, i) => (
              <button
                key={l.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                className="text-[10px] px-2.5 py-1 rounded-full border transition"
                style={{
                  borderColor: active === i ? l.color : "rgba(255,255,255,0.12)",
                  color: active === i ? l.color : "#bbb",
                  background:
                    active === i ? `${l.color}1f` : "rgba(255,255,255,0.03)",
                }}
              >
                {l.name}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#777] mt-2">
            Hover a layer to isolate · particles = live token flow through the stack
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIProductStack3D;
