/* ============================================================================
 * InsightAI Consultancy — Landing Page (SINGLE-FILE EXPORT)
 * ----------------------------------------------------------------------------
 * This file inlines every component currently rendered on `/` so you can drop
 * it into any React + Tailwind + lucide-react project.
 *
 * Default export: <LandingPage />
 *
 * REQUIRED DEPENDENCIES in the target project:
 *   - react, react-dom
 *   - lucide-react
 *   - three                    (for the NeuralOrb 3D hero background)
 *   - tailwindcss (configured)
 *
 * REQUIRED ASSETS (still referenced via `@/assets/...` imports):
 *   - src/assets/certs/*.png           (12 certification logos)
 *   - src/assets/clients/*.png         (12 client logos)
 *   - src/assets/robot-hand-ai.png     (Contact section hero visual)
 *
 * REQUIRED CSS — see the commented CSS block at the BOTTOM of this file.
 * Copy those rules into your global stylesheet (e.g. src/styles.css /
 * src/index.css) or they will be missing styling for: glass-card, btn-primary,
 * btn-secondary, rainbow-text, spotlight, marquee, fade-up, text-gradient.
 *
 * ROUTING: links use plain <a href="..."> so this file works outside
 * TanStack Router. Wire them up to your router if needed.
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import {
  Mail,
  Phone,
  Sparkles,
  Code2,
  GraduationCap,
  Users,
  Boxes,
  Palette,
  Building2,
  Landmark,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Eye,
  Linkedin,
  Facebook,
  MessageCircle,
  Check,
  MapPin,
  Clock,
  Navigation,
  ParkingCircle,
} from "lucide-react";

// Asset imports (keep these paths or replace with your own image URLs)
import iso27001 from "@/assets/certs/iso27001.png";
import soc2 from "@/assets/certs/soc2.png";
import pcidss from "@/assets/certs/pcidss.png";
import gdpr from "@/assets/certs/gdpr.png";
import iso9001 from "@/assets/certs/iso9001.png";
import cmmi from "@/assets/certs/cmmi.png";
import nist from "@/assets/certs/nist.png";
import itil from "@/assets/certs/itil.png";
import everify from "@/assets/certs/everify.png";
import fedramp from "@/assets/certs/fedramp.png";
import hipaa from "@/assets/certs/hipaa.png";
import basis from "@/assets/certs/basis.png";
import apple from "@/assets/clients/apple.png";
import meta from "@/assets/clients/meta.png";
import disney from "@/assets/clients/disney.png";
import google from "@/assets/clients/google.png";
import boa from "@/assets/clients/boa.png";
import chase from "@/assets/clients/chase.png";
import aetna from "@/assets/clients/aetna.png";
import uhc from "@/assets/clients/uhc.png";
import cvs from "@/assets/clients/cvs.png";
import ibm from "@/assets/clients/ibm.png";
import nyse from "@/assets/clients/nyse.png";
import tcs from "@/assets/clients/tcs.png";
import robotHand from "@/assets/robot-hand-ai.png";

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCounter(target: number, duration = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Section({
  id,
  bg = "#000000",
  title,
  subtitle,
  children,
}: {
  id?: string;
  bg?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section id={id} style={{ background: bg }} className="py-24 border-b border-white/5">
      <div ref={ref} className="fade-up max-w-7xl mx-auto px-4">
        {title && (
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight rainbow-text">
              {title}
            </h2>
            {subtitle && <p className="mt-4 text-[#888] max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ============================================================================
 * NEURAL ORB — Three.js hero background
 * ========================================================================== */

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

const paletteGLSL = /* glsl */ `
vec3 palette(float t){
  vec3 a=vec3(0.5,0.5,0.55);
  vec3 b=vec3(0.5,0.5,0.5);
  vec3 c=vec3(1.0,1.0,1.0);
  vec3 d=vec3(0.00,0.33,0.67);
  return a+b*cos(6.28318*(c*t+d));
}
`;

function NeuralOrb() {
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

    const uniforms = { uTime: { value: 0 } };

    const shellGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const shellWire = new THREE.WireframeGeometry(shellGeo);
    const shellMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
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
      fragmentShader: `
        uniform float uTime;
        varying vec3 vPos;
        varying float vNoise;
        ${paletteGLSL}
        void main(){
          float t = vPos.y * 0.35 + vPos.x * 0.15 + uTime * 0.08 + vNoise * 0.25;
          vec3 col = palette(t);
          float glow = smoothstep(2.4, 0.6, length(vPos));
          col *= 0.85 + glow * 0.6;
          gl_FragColor = vec4(col, 0.75);
        }
      `,
    });
    const shell = new THREE.LineSegments(shellWire, shellMat);
    scene.add(shell);

    const innerGeo = new THREE.IcosahedronGeometry(1.05, 5);
    const innerMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
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
      fragmentShader: `
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
          float core = smoothstep(1.2, 0.0, length(vPos));
          col = col * (0.4 + fres * 1.4) + col * core * 0.5;
          float alpha = fres * 0.85 + core * 0.25;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

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
      vertexShader: `
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
      fragmentShader: `
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

/* ============================================================================
 * TOPBAR
 * ========================================================================== */

function TopBar() {
  return (
    <div className="w-full bg-[#111] border-b border-white/5 text-[12px] text-[#888]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 flex-wrap">
        <span className="inline-flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" /> info@insightaiconsultancy.com
        </span>
        <span className="inline-flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" /> (973) 681-8296
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
 * NAVBAR — full mega-menu
 * ========================================================================== */

const navMenus: Record<string, { label: string; items: string[] }[]> = {
  "Insight Products": [
    {
      label: "Core ITES",
      items: [
        "UpCare MediConnect",
        "UpLearn EduTech",
        "UpSales BizHub",
        "UpShield Insurix",
        "UpScale RealEstate",
        "UpLegal JurySync",
        "UpCredit ECLSight",
        "UpInvest WealthGuard",
      ],
    },
    {
      label: "Client ITES",
      items: [
        "Omni Smart LMS",
        "MG Cotton ERP",
        "Everest CRM",
        "Nexus Fuel SCADA",
        "Trust AgroChem SCM",
        "BIMCO AgroMeds CRM",
        "Sarkar HRMS",
        "LoanAI Agent",
        "Board Management",
      ],
    },
  ],
  "Digital Lab": [
    {
      label: "Digital Marketing",
      items: [
        "Graphics Design",
        "UI/UX Design",
        "Web Application",
        "WordPress Website",
        "Video Editing",
        "Content Writing",
        "Social Media Ads",
      ],
    },
    { label: "Portfolio", items: ["Behance Portfolio"] },
    { label: "More", items: ["Gigs on Fiverr", "Graphics on Fiverr", "Hire on Upwork"] },
  ],
  "AI Enterprise": [
    {
      label: "Enterprise",
      items: [
        "Supply Chain Systems",
        "Cyber Security Solutions",
        "Business Intelligence",
        "Banking Solutions",
        "Healthcare Software",
      ],
    },
    {
      label: "AI Solutions",
      items: [
        "AI Powered CRM",
        "AI Integrated ERP",
        "AI Enabled LMS",
        "AI Driven HRMS",
        "AI Business Agents",
      ],
    },
    {
      label: "Public Sector",
      items: [
        "E-Government Solutions",
        "Public Safety Solutions",
        "Citizen Engagement Systems",
        "Geographic Information System",
        "Digital Identity & Authentication",
      ],
    },
    {
      label: "More",
      items: [
        "Mobile App Development",
        "Custom Software Solutions",
        "Document & Workflow Automation",
        "IT Staffing & Consulting",
        "Federal Contractor Compliance",
      ],
    },
  ],
  "InsightAI Academia": [
    { label: "IT Bootcamp", items: ["Student Portal", "Training Courses", "Plans & Pricing"] },
    { label: "Practice & Tools", items: ["Automation Practice", "Coding Exercise", "XPath Brainteaser"] },
    {
      label: "Learning Hub",
      items: [
        "Academia E-Learning",
        "InsightAI Certifications",
        "Course Marketplace",
        "Academic Journals",
      ],
    },
    {
      label: "More",
      items: [
        "Contact Us",
        "Careers",
        "Oracle Live SQL",
        "Jira & Zephyr",
        "JSON Schema",
        "Code Share",
        "Swagger",
      ],
    },
  ],
};

const navProductLinks: Record<string, string> = {
  "Omni Smart LMS": "/products/omni-smart-lms",
  "Nexus Fuel SCADA": "/products/nexus-fuel-scada",
  "Trust AgroChem SCM": "/products/trust-agrochem-scm",
  "BIMCO AgroMeds CRM": "/products/bimco-agromeds-crm",
  "Sarkar HRMS": "/products/sarkar-hrms",
  "LoanAI Agent": "/products/loanai-agent",
  "Contact Us": "/contact",
  Careers: "/coming-soon",
};
const navResolve = (label: string) => navProductLinks[label] ?? "/coming-soon";

function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white font-bold">
          <span className="w-8 h-8 rounded-md border border-white/20 flex items-center justify-center bg-white/5">
            <Eye className="w-4 h-4" />
          </span>
          <span>
            InsightAI <span className="text-[#888] font-normal">Consultancy</span>
          </span>
        </a>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1 h-16">
          {Object.keys(navMenus).map((key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  cancelClose();
                  setOpen(key);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpen(isOpen ? null : key)}
                  className={`px-4 py-2 text-sm inline-flex items-center gap-1 transition-colors ${
                    isOpen ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {key}{" "}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div
                    className="fixed left-1/2 -translate-x-1/2 top-16 w-[min(1120px,calc(100vw-2rem))] z-50"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div
                      className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(15,15,18,0.98) 0%, rgba(8,8,10,0.98) 100%)",
                        backdropFilter: "blur(24px)",
                        boxShadow:
                          "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset",
                      }}
                    >
                      <div className="grid grid-cols-12 gap-0">
                        <div
                          className="col-span-9 p-7 grid gap-x-6 gap-y-2"
                          style={{
                            gridTemplateColumns: `repeat(${navMenus[key].length}, minmax(0, 1fr))`,
                          }}
                        >
                          {navMenus[key].map((col, idx) => (
                            <div
                              key={col.label}
                              className={idx > 0 ? "pl-6 border-l border-white/5" : ""}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-1 h-3.5 rounded-full bg-gradient-to-b from-white/70 to-white/20" />
                                <h4 className="text-[11px] uppercase tracking-[0.14em] text-white/50 font-semibold">
                                  {col.label}
                                </h4>
                              </div>
                              <ul className="space-y-0.5">
                                {col.items.map((it) => (
                                  <li key={it}>
                                    <a
                                      href={navResolve(it)}
                                      onClick={() => setOpen(null)}
                                      className="group/item flex items-center justify-between gap-2 text-sm text-white/80 hover:text-white px-2 py-1.5 -mx-2 rounded-md hover:bg-white/[0.06] transition-all"
                                    >
                                      <span className="truncate">{it}</span>
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-white/60 shrink-0" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div
                          className="col-span-3 p-7 border-l border-white/5 relative overflow-hidden"
                          style={{
                            background:
                              "radial-gradient(120% 80% at 100% 0%, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
                          }}
                        >
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-wider text-white/80 mb-3">
                            <Sparkles className="w-3 h-3" /> Featured
                          </div>
                          <h5 className="text-white font-semibold text-base leading-snug mb-2">
                            {key}
                          </h5>
                          <p className="text-xs text-white/60 leading-relaxed mb-4">
                            Explore our complete suite of solutions designed to transform your business.
                          </p>
                          <a
                            href="#"
                            onClick={() => setOpen(null)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-white/80 group/cta"
                          >
                            Learn more
                            <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#" className="text-sm text-white/70 hover:text-white">
            Log In
          </a>
          <a href="#contact" className="btn-primary text-sm !py-2 !px-4">
            Get Started
          </a>
        </div>

        <button className="lg:hidden text-white" onClick={() => setMobile(!mobile)} aria-label="Menu">
          {mobile ? <X /> : <Menu />}
        </button>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-white/10 bg-black px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {Object.keys(navMenus).map((k) => {
            const isOpen = mobileOpen === k;
            return (
              <div key={k} className="border-b border-white/5 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(isOpen ? null : k)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-white/90 text-sm font-medium py-2"
                >
                  <span>{k}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="pl-2 pb-2 space-y-3">
                    {navMenus[k].map((col) => (
                      <div key={col.label}>
                        <h4 className="text-[10px] uppercase tracking-wider text-[#555] font-semibold mt-2 mb-1">
                          {col.label}
                        </h4>
                        <ul className="space-y-1">
                          {col.items.map((it) => (
                            <li key={it}>
                              <a
                                href={navResolve(it)}
                                onClick={() => {
                                  setMobile(false);
                                  setMobileOpen(null);
                                }}
                                className="block text-sm text-white/80 hover:text-white py-1"
                              >
                                {it}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a href="#contact" className="btn-primary text-sm w-full justify-center">
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}

/* ============================================================================
 * HERO — with NeuralOrb background + animated stats + HeroTabs
 * ========================================================================== */

function HeroStat({
  icon: Icon,
  value,
  suffix,
  label,
}: {
  icon: any;
  value: number;
  suffix: string;
  label: string;
}) {
  const n = useCounter(value);
  return (
    <div className="text-center">
      <Icon className="w-5 h-5 mx-auto text-white/60 mb-3" />
      <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-[#888] mt-2 max-w-[200px] mx-auto">{label}</div>
    </div>
  );
}

const heroTabs = [
  {
    key: "ites",
    label: "ITES Products",
    icon: "🧩",
    title: "8 Industry-Specific Platforms",
    desc: "From healthcare to finance — purpose-built AI software for every sector.",
    tags: ["MediConnect", "EduTech", "BizHub", "Insurix", "+4 more"],
  },
  {
    key: "digital",
    label: "Digital Lab",
    icon: "🎨",
    title: "Full-Service Digital Agency",
    desc: "UI/UX, web apps, video production, content writing, and social media ads.",
    tags: ["UI/UX Design", "Web Apps", "Video Editing", "Social Ads"],
  },
  {
    key: "enterprise",
    label: "AI Enterprise",
    icon: "🏢",
    title: "Enterprise-Grade AI Solutions",
    desc: "AI CRM, ERP, HRMS, LMS, and government systems for large-scale operations.",
    tags: ["AI CRM", "AI ERP", "E-Government", "Cyber Security"],
  },
  {
    key: "academia",
    label: "InsightAI Academia",
    icon: "🎓",
    title: "IT Bootcamps & Certifications",
    desc: "Expert-led training in AI, Cloud, Cyber Security, DevOps, and more.",
    tags: ["IT Bootcamp", "Certifications", "E-Learning", "Career Placement"],
  },
];

function HeroTabs() {
  const [active, setActive] = useState(0);
  const t = heroTabs[active];
  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-center gap-1 border-b border-white/5">
        {heroTabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(i)}
              className="px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
              style={{
                color: isActive ? "#ffffff" : "#888",
                borderBottomColor: isActive ? "#7c3aed" : "transparent",
                background: isActive ? "rgba(124,58,237,0.08)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        key={t.key}
        className="glass-card mt-6 p-7 text-left mx-auto max-w-2xl"
        style={{ borderRadius: 16, animation: "fadeUp 0.3s ease-out forwards" }}
      >
        <div className="text-3xl mb-3">{t.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.title}</h3>
        <p className="text-sm text-[#888] mb-4">{t.desc}</p>
        <div className="flex flex-wrap gap-2">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-[3px] rounded-full"
              style={{
                background: "rgba(124,58,237,0.12)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10">
      <div className="spotlight" />
      <div className="absolute inset-0 opacity-60">
        <NeuralOrb />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-xs text-white/90 mb-8 shadow-[0_0_30px_rgba(168,201,255,0.15)]">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Consultancy
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.85), 0 0 60px rgba(0,0,0,0.6)" }}
        >
          Empowering Intelligence,
          <br />
          <span className="text-gradient">Shaping Tomorrow.</span>
        </h1>
        <p
          className="mt-6 text-lg text-white/75 max-w-2xl mx-auto"
          style={{ textShadow: "0 1px 20px rgba(0,0,0,0.9)" }}
        >
          InsightAI delivers AI-driven ITES, custom software solutions, and expert-led training for
          private and government sectors globally.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <a href="#services" className="btn-primary justify-center">
            Explore Solutions
          </a>
          <a href="#contact" className="btn-secondary justify-center">
            Talk to an Expert
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
          <HeroStat icon={Code2} value={100} suffix="+" label="Custom Software Solutions in Global Market" />
          <HeroStat icon={Users} value={2500} suffix="+" label="IT Professionals Placed in the USA" />
          <HeroStat icon={GraduationCap} value={10000} suffix="+" label="Professionals Trained in IT Technologies" />
        </div>

        <HeroTabs />
      </div>
    </section>
  );
}

/* ============================================================================
 * SERVICES
 * ========================================================================== */

const serviceItems = [
  {
    icon: Boxes,
    title: "ITES Products",
    desc: "AI-driven IT Enabled Services built for healthcare, finance, legal, education, and more.",
    bullets: [
      "Custom Software Development",
      "AI Integration",
      "Cloud Deployment",
      "Dedicated Support",
      "API-Ready",
      "White-label Options",
    ],
    badges: ["Enterprise Ready", "AI Powered"],
  },
  {
    icon: Palette,
    title: "Digital Lab",
    desc: "Creative and digital marketing services — UI/UX, web apps, video, content, and social media.",
    bullets: [
      "UI/UX Design",
      "Web Applications",
      "Video Production",
      "Content Writing",
      "Social Media Ads",
      "Brand Identity",
    ],
    badges: ["Creative Studio", "Full-Service"],
  },
  {
    icon: Building2,
    title: "AI Enterprise Solutions",
    desc: "Scalable enterprise software: AI CRM, ERP, LMS, HRMS, and business automation agents.",
    bullets: [
      "AI-Powered CRM",
      "Integrated ERP",
      "HRMS Automation",
      "Business Intelligence",
      "Workflow Automation",
      "Custom Integrations",
    ],
    badges: ["Scalable", "AI Native"],
  },
  {
    icon: Landmark,
    title: "Public Sector & Government",
    desc: "E-Government platforms, public safety systems, GIS, and citizen engagement solutions.",
    bullets: [
      "E-Government Portals",
      "Public Safety Systems",
      "GIS Solutions",
      "Citizen Engagement",
      "Digital Identity",
      "Compliance Ready",
    ],
    badges: ["FedRAMP", "Trusted by Gov"],
  },
  {
    icon: GraduationCap,
    title: "InsightAI Academia",
    desc: "Expert-led IT bootcamps, certifications, e-learning, and career placement programs.",
    bullets: [
      "Live Instructor-Led Classes",
      "Industry Certifications",
      "Job Placement",
      "Hands-on Projects",
      "Online & Offline",
      "Career Mentorship",
    ],
    badges: ["10,000+ Trained", "Certified Programs"],
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security & Compliance",
    desc: "End-to-end security solutions, federal contractor compliance, and identity systems.",
    bullets: [
      "Threat Detection",
      "Identity & Access",
      "Compliance Audits",
      "Encrypted Pipelines",
      "Federal Contracting",
      "24/7 Monitoring",
    ],
    badges: ["SOC 2", "HIPAA Ready"],
  },
];

function ServiceBullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-4">
      {items.map((b, i) => (
        <li
          key={b}
          className="text-[13px] text-[#888] flex items-start gap-2"
          style={{
            lineHeight: 1.8,
            opacity: 0,
            animation: `fadeUp 0.4s ease-out forwards`,
            animationDelay: `${i * 100}ms`,
          }}
        >
          <span style={{ color: "#a78bfa" }}>·</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[11px] px-3 py-[3px] rounded-full"
      style={{
        background: "rgba(124,58,237,0.15)",
        color: "#a78bfa",
        border: "1px solid rgba(124,58,237,0.3)",
      }}
    >
      {children}
    </span>
  );
}

function Services() {
  return (
    <Section
      id="services"
      title="Our Services"
      subtitle="End-to-end AI-powered technology services for enterprise and government."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {serviceItems.map(({ icon: Icon, title, desc, bullets, badges }) => (
          <div key={title} className="glass-card p-7 group flex flex-col">
            <Icon className="w-7 h-7 text-white mb-5" />
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
            <ServiceBullets items={bullets} />
            <div className="flex flex-wrap gap-2 mt-5">
              {badges.map((b) => (
                <ServiceBadge key={b}>{b}</ServiceBadge>
              ))}
            </div>
            <a
              href="#"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:text-white transition"
            >
              Learn More{" "}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
 * ITES PRODUCTS
 * ========================================================================== */

const itesCore = [
  ["UpCare MediConnect", "Healthcare Platform"],
  ["UpLearn EduTech", "EdTech Suite"],
  ["UpSales BizHub", "Sales CRM"],
  ["UpShield Insurix", "Insurance Platform"],
  ["UpScale RealEstate", "Real Estate Suite"],
  ["UpLegal JurySync", "Legal Tech"],
  ["UpCredit ECLSight", "Credit Analytics"],
  ["UpInvest WealthGuard", "Wealth Management"],
];
const itesClient = [
  ["Omni Smart LMS", "Learning System"],
  ["MG Cotton ERP", "ERP System"],
  ["Everest CRM", "CRM Platform"],
  ["Nexus Fuel SCADA", "Industrial IoT"],
  ["Trust AgroChem SCM", "Supply Chain"],
  ["BIMCO AgroMeds CRM", "Agri CRM"],
  ["Sarkar HRMS", "HR Platform"],
  ["LoanAI Agent", "AI Lending"],
  ["Board Management", "Governance Suite"],
];

const itesProductLinks: Record<string, string> = {
  "Omni Smart LMS": "/products/omni-smart-lms",
  "Nexus Fuel SCADA": "/products/nexus-fuel-scada",
  "Trust AgroChem SCM": "/products/trust-agrochem-scm",
  "BIMCO AgroMeds CRM": "/products/bimco-agromeds-crm",
  "Sarkar HRMS": "/products/sarkar-hrms",
  "LoanAI Agent": "/products/loanai-agent",
};

function ItesRow({ label, items }: { label: string; items: string[][] }) {
  return (
    <div className="mb-12 last:mb-0">
      <h4 className="text-xs uppercase tracking-wider text-[#555] mb-4 font-semibold">{label}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(([name, cat]) => {
          const href = itesProductLinks[name];
          const inner = (
            <div className="glass-card p-5 group cursor-pointer h-full flex flex-col">
              <span className="inline-block text-[10px] uppercase tracking-wide text-white/60 border border-white/15 rounded-full px-2 py-0.5 mb-3 self-start">
                {cat}
              </span>
              <div className="flex items-start justify-between">
                <h3 className="text-white font-semibold">{name}</h3>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
              {href && (
                <span className="mt-3 text-xs" style={{ color: "#a78bfa" }}>
                  View Product →
                </span>
              )}
            </div>
          );
          return href ? (
            <a key={name} href={href} className="block">
              {inner}
            </a>
          ) : (
            <div key={name}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

function ITESProducts() {
  return (
    <Section id="products" bg="#0a0a0a" title="ITES Products" subtitle="Purpose-built AI platforms across industries.">
      <ItesRow label="Core ITES" items={itesCore} />
      <ItesRow label="Client ITES" items={itesClient} />
    </Section>
  );
}

/* ============================================================================
 * ICON GRID + INNOVATION / R&D / TRAINING SECTIONS
 * ========================================================================== */

type IconGridItem = { image?: string; label: string };

function IconGrid({
  id,
  bg,
  title,
  subtitle,
  items,
  footer,
}: {
  id?: string;
  bg?: string;
  title: string;
  subtitle?: string;
  items: IconGridItem[];
  footer?: ReactNode;
}) {
  return (
    <Section id={id} bg={bg} title={title} subtitle={subtitle}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(({ image, label }) => (
          <div key={label} className="glass-card p-8 flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition">
              {image && (
                <img src={image} alt={label} loading="lazy" className="w-10 h-10 object-contain" />
              )}
            </div>
            <div className="text-sm font-medium text-white">{label}</div>
          </div>
        ))}
      </div>
      {footer && <div className="mt-12 text-center">{footer}</div>}
    </Section>
  );
}

const ic = (slug: string) => `https://img.icons8.com/color/96/${slug}.png`;

function InnovationTech() {
  return (
    <IconGrid
      id="innovation"
      title="Innovation & Technology"
      items={[
        { image: ic("shield"), label: "Cyber Security" },
        { image: ic("physics"), label: "Data Science" },
        { image: ic("data-configuration"), label: "Data Mining" },
        { image: ic("face-id"), label: "DeepFake" },
        { image: ic("cloud"), label: "Cloud Computing" },
        { image: ic("api-settings"), label: "API Integration" },
        { image: ic("chatbot"), label: "Prompt Engineering" },
        { image: ic("infinity"), label: "DevOps" },
        { image: ic("design"), label: "UI/UX Design" },
      ]}
    />
  );
}

function ResearchDev() {
  return (
    <IconGrid
      bg="#080808"
      id="research"
      title="Research & Development"
      items={[
        { image: ic("artificial-intelligence"), label: "Artificial Intelligence" },
        { image: ic("electric-car"), label: "Autonomous Vehicles" },
        { image: ic("speech-bubble-with-dots"), label: "Natural Language Processing" },
        { image: ic("electronics"), label: "Quantum Computing" },
        { image: ic("blockchain-technology"), label: "Blockchain" },
        { image: ic("virtual-reality"), label: "AR/VR/MR" },
      ]}
    />
  );
}

function TrainingOpportunities() {
  return (
    <IconGrid
      id="training"
      title="Training & Opportunities"
      items={[
        { image: ic("shield"), label: "Cyber Security" },
        { image: ic("artificial-intelligence"), label: "Artificial Intelligence" },
        { image: ic("data-configuration"), label: "Data Engineering" },
        { image: ic("cloud"), label: "Cloud Computing" },
        { image: ic("blockchain-technology"), label: "Blockchain Development" },
        { image: ic("workflow"), label: "ERP & Application Development" },
        { image: ic("automation"), label: "Software Quality & Automation" },
        { image: ic("combo-chart"), label: "DevOps & Business Analytics" },
        { image: ic("design"), label: "UI/UX Design" },
      ]}
      footer={
        <a href="#" className="btn-secondary">
          View All Courses →
        </a>
      }
    />
  );
}

/* ============================================================================
 * CERTIFICATIONS + CLIENTS (logo grids)
 * ========================================================================== */

type LogoImg = { label: string; src: string };

function LogoCell({ item }: { item: LogoImg }) {
  return (
    <div className="flex items-center justify-center p-6 rounded-2xl border border-white/10 bg-white hover:border-white/20 transition-colors min-h-[140px]">
      <img
        src={item.src}
        alt={item.label}
        className="max-h-20 max-w-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

function Certifications() {
  const items: LogoImg[] = [
    { label: "ISO 27001", src: iso27001 },
    { label: "SOC 2 Type II", src: soc2 },
    { label: "PCI DSS", src: pcidss },
    { label: "GDPR Compliant", src: gdpr },
    { label: "ISO 9001", src: iso9001 },
    { label: "CMMI Institute", src: cmmi },
    { label: "NIST", src: nist },
    { label: "ITIL", src: itil },
    { label: "E-Verify", src: everify },
    { label: "FedRAMP", src: fedramp },
    { label: "HIPAA", src: hipaa },
    { label: "BASIS", src: basis },
  ];
  return (
    <Section
      bg="#0a0a0a"
      title="Certifications & Standards"
      subtitle="Compliant with the world's most rigorous security and quality frameworks."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it, i) => (
          <LogoCell key={i} item={it} />
        ))}
      </div>
    </Section>
  );
}

function Clients() {
  const items: LogoImg[] = [
    { label: "Apple", src: apple },
    { label: "Meta", src: meta },
    { label: "Walt Disney", src: disney },
    { label: "Google", src: google },
    { label: "Bank of America", src: boa },
    { label: "Chase", src: chase },
    { label: "Aetna", src: aetna },
    { label: "UnitedHealthcare", src: uhc },
    { label: "CVS", src: cvs },
    { label: "IBM", src: ibm },
    { label: "NYSE", src: nyse },
    { label: "TCS", src: tcs },
  ];
  return (
    <Section
      title="Clients & Partnerships"
      subtitle="Trusted by leading organizations across finance, healthcare, and technology."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it, i) => (
          <LogoCell key={i} item={it} />
        ))}
      </div>
    </Section>
  );
}

/* ============================================================================
 * CONTACT FORM (simplified — original used a separate <ContactBackground/>
 * Three.js scene; this version keeps the robot-hand visual + form layout
 * without that extra canvas, so the file stays self-contained.)
 * ========================================================================== */

function ContactInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      required
      {...props}
      className="w-full bg-[#111] border border-white/15 rounded-md px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-white/40 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition"
    />
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="relative py-24 border-b border-white/5 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(120,80,220,0.18), transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(40,180,255,0.14), transparent 60%)",
        }}
      />

      <div
        aria-hidden
        className="absolute pointer-events-none hidden md:block left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          width: "min(1100px, 95%)",
          zIndex: 2,
        }}
      >
        <div className="relative robot-float">
          <div
            className="absolute"
            style={{
              left: "26%",
              top: "8%",
              width: "50%",
              height: "50%",
              background:
                "radial-gradient(circle, rgba(80,200,255,0.95), rgba(180,100,255,0.65) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orbPulse 3.6s ease-in-out infinite",
            }}
          />
          <img
            src={robotHand}
            alt=""
            loading="lazy"
            className="w-full h-auto select-none"
            style={{
              filter:
                "drop-shadow(0 0 120px rgba(80,180,255,0.85)) drop-shadow(0 0 240px rgba(180,100,255,0.7)) drop-shadow(0 0 360px rgba(80,180,255,0.4))",
              opacity: 1,
            }}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(8,8,8,0.6) 85%)",
          zIndex: 3,
        }}
      />

      <div
        ref={ref}
        className="fade-up relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start"
        style={{ zIndex: 10 }}
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Connect Today</h2>
          <p className="mt-4 text-[#888] max-w-md">
            Chat with a specialist to explore our services and AI-driven ITES solutions.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Response within 24 hours",
              "Dedicated AI solutions specialist",
              "Free initial consultation",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/85">
                <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="relative p-8 space-y-4 rounded-2xl border border-white/15"
          style={{
            background: "rgba(10,10,14,0.94)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(80,180,255,0.2)",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <ContactInput name="firstName" placeholder="First Name" />
            <ContactInput name="lastName" placeholder="Last Name" />
          </div>
          <ContactInput name="email" type="email" placeholder="Email" />
          <ContactInput name="phone" placeholder="Phone" />
          <textarea
            required
            rows={4}
            placeholder="Comments / Message"
            className="w-full bg-[#111] border border-white/15 rounded-md px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-white/40 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition"
          />
          <button type="submit" className="btn-primary w-full justify-center !rounded-md">
            Send Message
          </button>
          {sent && (
            <p className="text-sm text-emerald-400 text-center">
              ✓ Thanks for submitting! We'll contact you soon.
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes robotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes orbPulse { 0%,100%{opacity:.75;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        .robot-float { animation: robotFloat 5.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

/* ============================================================================
 * FIND US (map + info)
 * ========================================================================== */

function FindUsInfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string[];
}) {
  return (
    <div
      className="flex gap-3 items-start w-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "18px 20px",
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(124,58,237,0.12)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: "15px", color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>
          {label}
        </div>
        <div style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.6 }}>
          {value.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FindUs() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section
      className="relative py-24 border-b border-white/5 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06), transparent 60%)" }}
      />
      <div ref={ref} className="fade-up relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight rainbow-text">
            🗺️ Find Us
          </h2>
          <p className="mt-4 text-[#888] max-w-2xl mx-auto">
            Visit our office in Jackson Heights, New York.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 60px rgba(124,58,237,0.08)",
            }}
          >
            <iframe
              title="Office location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.8835!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHeritage+Tower+82-11+37th+Avenue+Jackson+Heights+NY+11372!5e0!3m2!1sen!2sus"
              width="100%"
              height="560"
              style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-[400px] md:h-[480px] lg:h-[560px]"
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Visit Our Office</h3>
            <FindUsInfoCard
              icon={<MapPin size={18} color="#a78bfa" />}
              label="Address"
              value={["Heritage Tower, Suite-LL11", "82-11 37th Avenue", "Jackson Heights, NY 11372"]}
            />
            <FindUsInfoCard
              icon={<Navigation size={18} color="#a78bfa" />}
              label="Getting Here"
              value={["Accessible by subway (7 train),", "bus, and ride-sharing services."]}
            />
            <FindUsInfoCard
              icon={<ParkingCircle size={18} color="#a78bfa" />}
              label="Parking"
              value={["Street parking available.", "Nearby parking garages on 37th Ave."]}
            />
            <FindUsInfoCard
              icon={<Clock size={18} color="#a78bfa" />}
              label="Office Hours"
              value={["Mon–Fri: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 4:00 PM"]}
            />
            <a
              href="https://maps.google.com/?q=Heritage+Tower+82-11+37th+Avenue+Jackson+Heights+NY+11372"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-2 py-2.5 text-[13px] font-medium rounded-lg transition duration-200"
              style={{
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#a78bfa",
                background: "rgba(124,58,237,0.08)",
              }}
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * FOOTER
 * ========================================================================== */

const footerProductLinks = [
  { label: "Omni Smart LMS", href: "/products/omni-smart-lms" },
  { label: "Nexus Fuel SCADA", href: "/products/nexus-fuel-scada" },
  { label: "Trust AgroChem SCM", href: "/products/trust-agrochem-scm" },
  { label: "BIMCO AgroMeds CRM", href: "/products/bimco-agromeds-crm" },
  { label: "Sarkar HRMS", href: "/products/sarkar-hrms" },
  { label: "LoanAI Agent", href: "/products/loanai-agent" },
];
const footerCompanyLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold mb-3">
            <span className="w-8 h-8 rounded-md border border-white/20 flex items-center justify-center bg-white/5">
              <Eye className="w-4 h-4" />
            </span>
            InsightAI Consultancy
          </div>
          <p className="text-sm text-[#888] max-w-xs">Empowering Intelligence, Shaping Tomorrow.</p>
          <div className="flex items-center gap-3 mt-5">
            {[Linkedin, Facebook, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#555] font-semibold mb-4">
            Insight Products
          </h4>
          <ul className="space-y-2">
            {footerProductLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-[#aaa] hover:text-white transition">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#555] font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            {footerCompanyLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-[#aaa] hover:text-white transition">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#555] font-semibold mb-4">Contact</h4>
          <p className="text-sm text-[#888] leading-relaxed">
            Heritage Tower, Suite-LL11,
            <br />
            82-11 37th Avenue,
            <br />
            Jackson Heights, NY 11372
          </p>
          <p className="text-sm text-[#888] mt-3">info@insightaiconsultancy.com</p>
          <p className="text-sm text-[#888]">(973) 681-8296</p>
        </div>
      </div>
      <div className="mt-14 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#555]">
          <p>©2025 by InsightAI Consultancy</p>
          <p>
            <a href="/coming-soon" className="hover:text-white/80">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href="/coming-soon" className="hover:text-white/80">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
 * DEFAULT EXPORT — full landing page
 * ========================================================================== */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ITESProducts />
        <InnovationTech />
        <ResearchDev />
        <TrainingOpportunities />
        <Certifications />
        <Clients />
        <ContactForm />
        <FindUs />
      </main>
      <Footer />
    </div>
  );
}

/* ============================================================================
 * REQUIRED CSS — paste into your global stylesheet
 * ----------------------------------------------------------------------------
 * The components above reference these utility classes which are NOT part of
 * Tailwind. Copy this block into your `src/styles.css` / `src/index.css`.
 * ============================================================================

@layer utilities {
  .text-gradient {
    background: linear-gradient(180deg, #ffffff 0%, #a8c9ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .glass-card {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
    overflow: hidden;
  }
  .glass-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 300ms ease;
    background: radial-gradient(
      400px circle at var(--mx, 50%) var(--my, 50%),
      rgba(168, 201, 255, 0.18),
      rgba(180, 140, 255, 0.08) 30%,
      transparent 60%
    );
  }
  .glass-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
  .glass-card:hover::before { opacity: 1; }

  .btn-primary {
    background: #fff; color: #000;
    border-radius: 9999px; padding: 0.75rem 1.5rem;
    font-weight: 500; transition: all 300ms ease;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary:hover { transform: scale(1.03); box-shadow: 0 0 30px rgba(255,255,255,0.25); }

  .btn-secondary {
    background: transparent; color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 9999px; padding: 0.75rem 1.5rem;
    font-weight: 500; transition: all 300ms ease;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-secondary:hover { background: #fff; color: #000; }

  .rainbow-text {
    background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #5f27cd, #ff9ff3, #ff6b6b);
    background-size: 300% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: rainbowShift 4s linear infinite;
  }
  @keyframes rainbowShift {
    0%   { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
}

@keyframes spotlight {
  0%   { transform: translate(-30%,-30%) rotate(0deg); }
  50%  { transform: translate(30%,20%) rotate(180deg); }
  100% { transform: translate(-30%,-30%) rotate(360deg); }
}
.spotlight {
  position: absolute; inset: -20%;
  background: radial-gradient(circle at 50% 50%, rgba(168,201,255,.12) 0%, rgba(255,255,255,.04) 25%, transparent 60%);
  animation: spotlight 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { opacity: 0; }
.fade-up.in-view { animation: fadeUp 0.7s ease-out forwards; }

============================================================================ */
