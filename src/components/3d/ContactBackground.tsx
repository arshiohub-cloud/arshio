import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ContactBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 1.2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // -------- Synthwave grid floor (smooth, no flicker) --------
    const gridGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vDist;
        void main(){
          vUv = uv;
          vec3 p = position;
          p.y += mod(uTime * 3.0, 2.0);
          vDist = length(p.xy);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying float vDist;
        void main(){
          vec2 uv = vUv * 60.0;
          vec2 g = abs(fract(uv) - 0.5);
          float line = smoothstep(0.46, 0.5, max(g.x, g.y));
          vec3 col = mix(vec3(1.0, 0.25, 0.7), vec3(0.3, 0.7, 1.0), vUv.y);
          float fade = smoothstep(36.0, 4.0, vDist);
          gl_FragColor = vec4(col, line * fade * 0.7);
        }
      `,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2.3;
    grid.position.y = -4.8;
    scene.add(grid);

    // -------- Interactive wireframe icosahedron (AI core) --------
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer glowing wireframe
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x7ad7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(ico);

    // Inner solid translucent shell
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xb070ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(inner);

    // Orbiting rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60c8ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.015, 8, 128), ringMat);
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.012, 8, 128),
      new THREE.MeshBasicMaterial({
        color: 0xff5fb8,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ringA.rotation.x = Math.PI / 2.4;
    ringB.rotation.x = Math.PI / 3;
    ringB.rotation.y = Math.PI / 4;
    coreGroup.add(ringA);
    coreGroup.add(ringB);

    // -------- Floating glow particles (smooth, no connecting lines) --------
    const COUNT = 140;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      seeds[i] = Math.random() * 10;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.3, "rgba(180,140,255,0.9)");
    grd.addColorStop(0.7, "rgba(120,80,220,0.25)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.22,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
      opacity: 0.9,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // -------- Mouse / resize --------
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      target.x = nx;
      target.y = -ny;
    };
    window.addEventListener("mousemove", onMove);

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

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      (gridMat.uniforms as { uTime: { value: number } }).uTime.value = t;

      // animate core
      coreGroup.rotation.y += 0.004;
      coreGroup.rotation.x += 0.0015;
      ico.rotation.y -= 0.006;
      inner.rotation.y += 0.012;
      inner.rotation.x += 0.008;
      ringA.rotation.z += 0.01;
      ringB.rotation.z -= 0.008;

      // mouse-driven tilt
      coreGroup.rotation.x += (target.y * 0.6 - coreGroup.rotation.x * 0.02) * 0.05;
      coreGroup.rotation.y += (target.x * 0.6 - coreGroup.rotation.y * 0.02) * 0.05;

      // gentle particle drift
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += Math.sin(t * 0.6 + seeds[i]) * 0.002;
        pos[i * 3] += Math.cos(t * 0.4 + seeds[i]) * 0.0015;
      }
      pGeo.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.02;

      // camera parallax
      camera.position.x += (target.x * 2.2 - camera.position.x) * 0.04;
      camera.position.y += (1.2 + target.y * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      gridGeo.dispose();
      gridMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      ringMat.dispose();
      (ringB.material as THREE.Material).dispose();
      pGeo.dispose();
      pMat.dispose();
      tex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
