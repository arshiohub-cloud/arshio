import { useEffect, useRef } from "react";
import * as THREE from "three";

// GLSL: classic 3D simplex noise (Ashima)
const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
       i.z+vec4(0.0,i1.z,i2.z,1.0))
     + i.y+vec4(0.0,i1.y,i2.y,1.0))
     + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

// IQ-style cosine palette → smooth gradient
const paletteGLSL = /* glsl */ `
vec3 palette(float t){
  vec3 a=vec3(0.5,0.5,0.55);
  vec3 b=vec3(0.5,0.5,0.5);
  vec3 c=vec3(1.0,1.0,1.0);
  vec3 d=vec3(0.00,0.33,0.67); // magenta→cyan→amber sweep
  return a+b*cos(6.28318*(c*t+d));
}
`;

export function NeuralOrb() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
    };

    // --- Outer wireframe shell with noise displacement + gradient palette ---
    const shellGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const shellWire = new THREE.WireframeGeometry(shellGeo);

    const shellMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vPos;
        varying float vNoise;
        ${noiseGLSL}
        void main(){
          vec3 p = position;
          float n = snoise(p * 1.1 + vec3(0.0, 0.0, uTime * 0.35));
          float n2 = snoise(p * 2.3 - vec3(uTime * 0.2));
          float disp = n * 0.18 + n2 * 0.06;
          p += normalize(position) * disp;
          vPos = p;
          vNoise = n;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vPos;
        varying float vNoise;
        ${paletteGLSL}
        void main(){
          float t = vPos.y * 0.35 + vPos.x * 0.15 + uTime * 0.08 + vNoise * 0.25;
          vec3 col = palette(t);
          // smooth glow falloff
          float glow = smoothstep(2.4, 0.6, length(vPos));
          col *= 0.85 + glow * 0.6;
          gl_FragColor = vec4(col, 0.75);
        }
      `,
    });
    const shell = new THREE.LineSegments(shellWire, shellMat);
    scene.add(shell);

    // --- Inner solid orb with fresnel glow + animated palette ---
    const innerGeo = new THREE.IcosahedronGeometry(1.05, 5);
    const innerMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vNoise;
        ${noiseGLSL}
        void main(){
          vec3 p = position;
          float n = snoise(p * 1.6 + vec3(uTime * 0.25, uTime * 0.18, 0.0));
          p += normal * n * 0.12;
          vNormal = normalize(normalMatrix * normal);
          vPos = p;
          vNoise = n;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vNoise;
        ${paletteGLSL}
        void main(){
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);
          float t = vPos.x * 0.25 + vPos.y * 0.2 + uTime * 0.12 + vNoise * 0.4;
          vec3 col = palette(t);
          // soft core glow
          float core = smoothstep(1.2, 0.0, length(vPos));
          col = col * (0.4 + fres * 1.4) + col * core * 0.5;
          float alpha = fres * 0.85 + core * 0.25;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // --- Soft radial glow sprite (background bloom) ---
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d")!;
    const grd = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,255,255,0.55)");
    grd.addColorStop(0.25, "rgba(180,140,255,0.35)");
    grd.addColorStop(0.55, "rgba(80,180,255,0.15)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    gctx.fillStyle = grd;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(5.2, 5.2, 1);
    glowSprite.position.z = -0.5;
    scene.add(glowSprite);

    // --- Particle field with palette + noise hue shift ---
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        ...uniforms,
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSeed;
        varying float vSeed;
        varying vec3 vPos;
        ${noiseGLSL}
        void main(){
          vec3 p = position;
          float n = snoise(p * 0.35 + vec3(uTime * 0.15, uTime * 0.1, aSeed * 5.0));
          p += normalize(position) * n * 0.25;
          vSeed = aSeed;
          vPos = p;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (8.0 + aSeed * 14.0) * uPixelRatio * (1.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying float vSeed;
        varying vec3 vPos;
        ${paletteGLSL}
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if(d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          float t = vSeed + uTime * 0.1 + vPos.y * 0.1;
          vec3 col = palette(t);
          gl_FragColor = vec4(col, a * 0.9);
        }
      `,
    });
    const particles = new THREE.Points(pGeo, particleMat);
    scene.add(particles);

    // Resize
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

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      (particleMat.uniforms as { uTime: { value: number } }).uTime.value = t;

      shell.rotation.y = t * 0.15;
      shell.rotation.x = t * 0.08;
      inner.rotation.y = -t * 0.22;
      inner.rotation.z = t * 0.1;
      particles.rotation.y = t * 0.04;

      scene.rotation.y += (mouse.x - scene.rotation.y) * 0.04;
      scene.rotation.x += (mouse.y - scene.rotation.x) * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      renderer.dispose();
      shellGeo.dispose();
      shellWire.dispose();
      innerGeo.dispose();
      pGeo.dispose();
      shellMat.dispose();
      innerMat.dispose();
      particleMat.dispose();
      glowMat.dispose();
      glowTex.dispose();
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
