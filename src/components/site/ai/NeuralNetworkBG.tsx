import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NeuralNetworkBG() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const N = 80;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = 0.005 + Math.random() * 0.012;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    // node sprite (radial glow)
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(180,200,255,1)");
    g.addColorStop(0.4, "rgba(108,99,255,0.7)");
    g.addColorStop(1, "rgba(0,212,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodeMat = new THREE.PointsMaterial({
      map: tex,
      size: 0.55,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x9aa8ff,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    // line segments
    const maxPairs = N * 6;
    const linePositions = new Float32Array(maxPairs * 2 * 3);
    const lineColors = new Float32Array(maxPairs * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const cIndigo = new THREE.Color(0x6c63ff);
    const cCyan = new THREE.Color(0x00d4ff);
    const MAX_DIST = 3.2;
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      // drift particles upward, wrap
      for (let i = 0; i < N; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        if (positions[i * 3 + 1] > 7) positions[i * 3 + 1] = -7;
        if (positions[i * 3] > 11) positions[i * 3] = -11;
        if (positions[i * 3] < -11) positions[i * 3] = 11;
      }
      // pulse size
      nodeMat.size = 0.5 + Math.sin(t * 1.6) * 0.08;
      (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // build edges
      let pi = 0;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < MAX_DIST && pi < maxPairs) {
            const alpha = 1 - d / MAX_DIST;
            const col = cIndigo.clone().lerp(cCyan, (i + j) % 7 / 7);
            const o = pi * 6;
            linePositions[o] = positions[i * 3];
            linePositions[o + 1] = positions[i * 3 + 1];
            linePositions[o + 2] = positions[i * 3 + 2];
            linePositions[o + 3] = positions[j * 3];
            linePositions[o + 4] = positions[j * 3 + 1];
            linePositions[o + 5] = positions[j * 3 + 2];
            lineColors[o] = col.r * alpha;
            lineColors[o + 1] = col.g * alpha;
            lineColors[o + 2] = col.b * alpha;
            lineColors[o + 3] = col.r * alpha;
            lineColors[o + 4] = col.g * alpha;
            lineColors[o + 5] = col.b * alpha;
            pi++;
          }
        }
      }
      lineGeo.setDrawRange(0, pi * 2);
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      scene.rotation.y = Math.sin(t * 0.08) * 0.15;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      tex.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
