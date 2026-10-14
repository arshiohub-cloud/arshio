export type ProjectCategory =
  | "All"
  | "Custom ERP & Software"
  | "Web Development"
  | "Mobile Apps"
  | "UI/UX & Branding"
  | "Video & Motion Reels"
  | "Digital Growth Marketing";

export type ProjectItem = {
  id: string;
  title: string;
  category: ProjectCategory;
  client: string;
  description: string;
  fullChallenge?: string;
  fullSolution?: string;
  image: string;
  videoUrl?: string; // For video editing showcases
  beforeImage?: string; // For interactive slider
  afterImage?: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  featured?: boolean;
};

export const PROJECTS: ProjectItem[] = [
  // 1. Custom ERP & Software — Project 1
  {
    id: "apex-enterprise-erp",
    title: "Apex Logistics Custom ERP & Multi-Branch Inventory Engine",
    category: "Custom ERP & Software",
    client: "Apex Global Supply Chain",
    description: "Architected a unified cloud ERP platform synchronizing 4 regional warehouses, automating dispatch routing, and integrating real-time ledger accounting.",
    fullChallenge: "Apex suffered 15+ hours weekly in manual spreadsheet reconciliations across regional hubs, triggering stockouts and dispatch delays.",
    fullSolution: "Engineered a high-concurrency Node.js and PostgreSQL ERP with automated barcode scanning, FIFO inventory allocation, and live profit-and-loss auditing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Operational Lag", value: "-68%" },
      { label: "Inventory Accuracy", value: "99.9%" },
    ],
    tags: ["Node.js", "PostgreSQL", "Docker", "REST API", "Tailwind"],
    featured: true,
  },
  // 1. Custom ERP & Software — Project 2
  {
    id: "medflow-healthcare-erp",
    title: "MedFlow Hospital Information Management & Electronic Health Records",
    category: "Custom ERP & Software",
    client: "MedFlow Clinical Network",
    description: "Built a HIPAA-compliant hospital ERP centralizing patient scheduling, doctor triage queues, digital pharmacy billing, and diagnostic lab results.",
    fullChallenge: "Siloed legacy clinic software led to 45-minute average patient wait times and error-prone handwritten billing records.",
    fullSolution: "Constructed a multi-tenant web ERP featuring role-based access control, automated prescription dispatch, and instant insurance claim generation.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Wait Times Reduced", value: "-54%" },
      { label: "Records Digitized", value: "140K+" },
    ],
    tags: ["TypeScript", "PostgreSQL", "FastAPI", "HIPAA Compliant"],
    featured: true,
  },

  // 2. Web Development — Project 1
  {
    id: "omni-ecommerce-web",
    title: "Omni Luxury Fashion Storefront & Sub-Second Checkout Engine",
    category: "Web Development",
    client: "Omni Apparel Global",
    description: "Engineered a blazing-fast Next.js e-commerce storefront with server-side rendering, headless Shopify API integration, and dynamic multi-currency routing.",
    fullChallenge: "Legacy WooCommerce storefront suffered 4.2-second load times, causing severe checkout abandonment among international mobile buyers.",
    fullSolution: "Migrated to Next.js 15 on Edge Vercel with optimized image caching and an instant slide-over cart, plummeting page load time to under 0.6 seconds.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Page Load Speed", value: "0.58s" },
      { label: "Checkout Conversion", value: "+210%" },
    ],
    tags: ["Next.js", "React 19", "Tailwind CSS", "Shopify API", "Vercel"],
    featured: true,
  },
  // 2. Web Development — Project 2
  {
    id: "cloudscale-devops-portal",
    title: "CloudScale Real-Time Server Monitoring & Infrastructure Portal",
    category: "Web Development",
    client: "CloudScale Technologies",
    description: "Developed a high-frequency telemetry dashboard rendering live CPU, memory, and network throughput metrics across 2,000+ distributed cloud nodes.",
    fullChallenge: "Engineering teams needed real-time visibility into microservice latency without freezing browser tabs under heavy websocket data bursts.",
    fullSolution: "Created a Canvas-accelerated Next.js frontend with WebSockets, sub-10ms UI paint cycles, and automated incident triage alerts.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Live Telemetry Nodes", value: "2,000+" },
      { label: "Incident Resolution", value: "3x Faster" },
    ],
    tags: ["Next.js", "WebSockets", "Canvas API", "TypeScript", "Tailwind"],
    featured: false,
  },

  // 3. Mobile Apps — Project 1
  {
    id: "fitpulse-fitness-app",
    title: "FitPulse iOS & Android Live Workout Companion App",
    category: "Mobile Apps",
    client: "FitPulse Health Technologies",
    description: "Engineered a cross-platform mobile app featuring live biometric heart rate tracking, customizable workout plans, and offline workout synchronization.",
    fullChallenge: "Client required a unified codebase for iOS and Android without sacrificing native 60fps animations or Bluetooth wearable connectivity.",
    fullSolution: "Engineered a React Native mobile application connected to a Firebase real-time backend with custom native iOS/Android BLE plugins.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "App Downloads", value: "85K+" },
      { label: "App Store Rating", value: "4.9 ★" },
    ],
    tags: ["React Native", "iOS", "Android", "Firebase", "BLE"],
    featured: true,
  },
  // 3. Mobile Apps — Project 2
  {
    id: "quickdrop-logistics-app",
    title: "QuickDrop On-Demand Hyperlocal Delivery & Rider App",
    category: "Mobile Apps",
    client: "QuickDrop Express",
    description: "Built twin iOS and Android applications for customers and delivery couriers, complete with live turn-by-turn GPS tracking and automated payouts.",
    fullChallenge: "Driver battery drain and sporadic GPS drift caused delivery delays and customer dispute rates to climb over 12%.",
    fullSolution: "Architected a battery-optimized background geofencing service in Flutter with instant push triggers and automated digital tip collection.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Daily Deliveries", value: "18,000+" },
      { label: "On-Time Fulfillment", value: "98.7%" },
    ],
    tags: ["Flutter", "Google Maps SDK", "Node.js", "WebSockets"],
    featured: false,
  },

  // 4. UI/UX & Branding — Project 1
  {
    id: "nexus-saas-rebrand",
    title: "Nexus SaaS Analytics Dashboard Redesign & Design System",
    category: "UI/UX & Branding",
    client: "Nexus Cloud Inc.",
    description: "Executed a comprehensive UI/UX redesign for a B2B enterprise data platform, turning dense data tables into an elegant, intuitive dark-mode interface.",
    fullChallenge: "Over 60% of trial users abandoned onboarding due to cluttered configuration tables and dated multi-level navigation.",
    fullSolution: "Delivered a dark-mode first design system in Figma with 140+ modular components, interactive prototypes, and developer-ready design tokens.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    beforeImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    metrics: [
      { label: "User Retention", value: "+140%" },
      { label: "Design Sprint", value: "3 Weeks" },
    ],
    tags: ["Figma", "UI/UX", "Design System", "User Research", "Dark Mode"],
    featured: true,
  },
  // 4. UI/UX & Branding — Project 2
  {
    id: "finova-banking-brand",
    title: "Finova AI Wealth Management & Digital Banking Interface",
    category: "UI/UX & Branding",
    client: "Finova Financial Group",
    description: "Designed the brand identity, logo mark, and complete mobile banking interface for an AI-powered wealth management startup.",
    fullChallenge: "FinTech market saturation required a visually distinct brand identity that instilled institutional trust while appealing to millennial investors.",
    fullSolution: "Crafted a bespoke visual identity and sleek mobile UI in Figma with high-contrast typography, interactive portfolio charts, and micro-delights.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "AUM Growth", value: "$42M" },
      { label: "Onboarding Rate", value: "88%" },
    ],
    tags: ["Brand Identity", "Figma", "FinTech UI", "Motion Design"],
    featured: false,
  },

  // 5. Video & Motion Reels — Project 1
  {
    id: "hyper-glow-viral-reels",
    title: "HyperGlow Energy Drink Motion Commercials & Viral Reels",
    category: "Video & Motion Reels",
    client: "HyperGlow Beverage Co.",
    description: "Produced high-octane 3D product motion graphics, sound design, and vertical TikTok/Reels commercials driving millions of organic engagements.",
    fullChallenge: "HyperGlow needed scroll-stopping video assets tailored for Gen-Z audiences across Instagram Reels and TikTok ad funnels.",
    fullSolution: "Scripted and edited 12 short-form dynamic reels in Premiere Pro and After Effects with custom sound design, color grading, and kinetic typography.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    metrics: [
      { label: "Organic Views", value: "4.2M+" },
      { label: "Paid ROAS", value: "4.5x" },
    ],
    tags: ["Premiere Pro", "After Effects", "Color Grading", "4K Mastering", "Sound FX"],
    featured: true,
  },
  // 5. Video & Motion Reels — Project 2
  {
    id: "aura-hardware-reveal",
    title: "Aura Studio Spatial Audio Hardware Launch Film & 3D Teaser",
    category: "Video & Motion Reels",
    client: "Aura Acoustics",
    description: "Created cinematic 3D product renders and a high-impact launch teaser demonstrating internal acoustic drivers and ANC capabilities.",
    fullChallenge: "Product launch required a premium Apple-grade hardware teaser video without exceeding a 3-week production runway.",
    fullSolution: "Rendered realistic photorealistic lighting passes in Cinema 4D and mastered explosive sound effects, delivering an Awwwards-worthy showcase film.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    metrics: [
      { label: "Pre-Orders Generated", value: "8,500+" },
      { label: "Production Turnaround", value: "14 Days" },
    ],
    tags: ["Cinema 4D", "After Effects", "3D Motion", "4K Mastering"],
    featured: false,
  },

  // 6. Digital Growth Marketing — Project 1
  {
    id: "zenith-meta-growth-campaign",
    title: "Zenith FinTech Multi-Channel Customer Acquisition Campaign",
    category: "Digital Growth Marketing",
    client: "Zenith Pay Solutions",
    description: "Architected a full-funnel Meta and Google Ads strategy combined with high-converting custom landing pages to slash customer acquisition costs.",
    fullChallenge: "High acquisition cost per user ($42 per qualified lead) across paid channels was suffocating client unit economics.",
    fullSolution: "Rebuilt landing pages with laser-focused value propositions and optimized paid ad audience targeting, slashing CPL by 45% while doubling lead volume.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Leads Generated", value: "12,400+" },
      { label: "Cost Per Lead", value: "-45%" },
    ],
    tags: ["Meta Ads", "Google Ads PPC", "Funnel CRO", "GA4 Analytics"],
    featured: true,
  },
  // 6. Digital Growth Marketing — Project 2
  {
    id: "lumina-beauty-scale",
    title: "Lumina Clean Skincare Omnichannel D2C Growth & Retention",
    category: "Digital Growth Marketing",
    client: "Lumina Beauty Labs",
    description: "Orchestrated an end-to-end e-commerce growth sprint combining TikTok creator spark ads, Klaviyo SMS/email flows, and cart upsell funnels.",
    fullChallenge: "Brand struggled with low repeat customer rates and stagnant return on ad spend during competitive holiday sales periods.",
    fullSolution: "Deployed automated lifecycle email flows, creator whitelist ads on TikTok, and post-purchase one-click upsells, tripling monthly recurring revenue.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Monthly Revenue", value: "3.2x" },
      { label: "Email Revenue Share", value: "34%" },
    ],
    tags: ["TikTok Ads", "Klaviyo CRM", "Shopify CRO", "Omnichannel"],
    featured: false,
  },
];
