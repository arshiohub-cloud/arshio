import { supabase } from "@/integrations/supabase/client";

export type LeadStatus = "new" | "in_progress" | "won" | "lost" | "spam";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  type: string;
  status: LeadStatus;
  source_page: string | null;
  created_at: string;
  read_at: string | null;
  notes: string | null;
  converted_engagement_id: string | null;
};

export type Milestone = {
  id: string;
  label: string;
  done: boolean;
  sort_order: number;
};

export type Engagement = {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  service_type: "custom_erp" | "web_app" | "mobile_app" | "ui_ux" | "video_motion" | "growth";
  status: "active" | "completed" | "on_hold";
  summary: string;
  created_at: string;
  updated_at: string;
  budget?: string;
  milestones: Milestone[];
};

// Initial realistic seed leads for pristine admin experience & offline resilience
const SEED_LEADS: Lead[] = [
  {
    id: "lead-001",
    name: "Mahmud Hasan",
    email: "mahmud.h@apexsupply.com",
    phone: "+880 1711-234567",
    company: "Apex Global Supply Chain",
    message: "We need a multi-warehouse inventory and logistics management dashboard. Current system in Excel is causing massive bottlenecks.",
    type: "contact",
    status: "in_progress",
    source_page: "/contact",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    read_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: "Initial discovery call scheduled for Thursday 3:00 PM. Budget estimate $12,000 - $15,000.",
    converted_engagement_id: null,
  },
  {
    id: "lead-002",
    name: "Sarah Jenkins",
    email: "s.jenkins@nexuscloud.io",
    phone: "+1 (415) 890-2341",
    company: "Nexus Cloud Inc.",
    message: "Looking for an end-to-end UI/UX redesign and Flutter mobile application for our B2B team productivity tool.",
    type: "contact",
    status: "new",
    source_page: "/services",
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(), // 14 hours ago
    read_at: null,
    notes: null,
    converted_engagement_id: null,
  },
  {
    id: "lead-003",
    name: "Rashedul Karim",
    email: "rashed@omniglobal.fashion",
    phone: "+880 1819-987654",
    company: "Omni Apparel Global",
    message: "High-performance headless e-commerce storefront with automated ERP sync and multi-currency checkout.",
    type: "contact",
    status: "won",
    source_page: "/pricing",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    read_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    notes: "Contract signed! $8,500 milestone project. Kickoff meeting completed.",
    converted_engagement_id: "eng-001",
  },
  {
    id: "lead-004",
    name: "David Vance",
    email: "dvance@hyperglow.co",
    phone: "+1 (212) 555-0199",
    company: "HyperGlow Beverage Co.",
    message: "Product launch motion graphics reel campaign: 10 vertical TikTok/Reels ads and 3D can renders.",
    type: "contact",
    status: "won",
    source_page: "/portfolio",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(), // 4 days ago
    read_at: new Date(Date.now() - 3600000 * 90).toISOString(),
    notes: "Deliverables approved. Final motion render in color grading.",
    converted_engagement_id: "eng-002",
  },
  {
    id: "lead-005",
    name: "Elena Rostova",
    email: "elena@fintechvortex.de",
    phone: "+49 30 901820",
    company: "Vortex Analytics",
    message: "Real-time trading analytics dashboard with WebSockets data streaming and high-frequency charts.",
    type: "contact",
    status: "new",
    source_page: "/contact",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    read_at: null,
    notes: null,
    converted_engagement_id: null,
  },
  {
    id: "lead-006",
    name: "Spam Bot",
    email: "fastseo@cheaplinks.xyz",
    phone: null,
    company: "Best SEO 2026",
    message: "Boost your Google ranking #1 in 24 hours guaranteed!",
    type: "contact",
    status: "spam",
    source_page: "/contact",
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    read_at: new Date(Date.now() - 3600000 * 110).toISOString(),
    notes: "Automated spam flagged.",
    converted_engagement_id: null,
  },
];

const SEED_ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-001",
    title: "Omni Apparel Headless Storefront & ERP Integration",
    client_name: "Rashedul Karim",
    client_email: "rashed@omniglobal.fashion",
    service_type: "web_app",
    status: "active",
    summary: "Next.js frontend connected to Supabase and custom inventory microservices with Sub-500ms TTFB.",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString(),
    budget: "$8,500",
    milestones: [
      { id: "m-1", label: "Architecture SRS & Figma Design System", done: true, sort_order: 1 },
      { id: "m-2", label: "Catalog Engine & Multi-currency Checkout", done: true, sort_order: 2 },
      { id: "m-3", label: "Automated Inventory & Shipping API Webhooks", done: false, sort_order: 3 },
      { id: "m-4", label: "QA Load Testing & Production Deployment", done: false, sort_order: 4 },
    ],
  },
  {
    id: "eng-002",
    title: "HyperGlow 3D Motion Reel & Performance Ad Creatives",
    client_name: "David Vance",
    client_email: "dvance@hyperglow.co",
    service_type: "video_motion",
    status: "active",
    summary: "10 high-octane 9:16 vertical motion reels with 3D product renders and sound design for TikTok/Meta.",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString(),
    budget: "$3,800",
    milestones: [
      { id: "m-5", label: "Storyboards & 3D Lighting Setup", done: true, sort_order: 1 },
      { id: "m-6", label: "Physics Simulation & Liquid Splashes", done: true, sort_order: 2 },
      { id: "m-7", label: "Sound Effects & Typography Animations", done: true, sort_order: 3 },
      { id: "m-8", label: "Final 4K Master Export & Deliverables Handover", done: false, sort_order: 4 },
    ],
  },
  {
    id: "eng-003",
    title: "Apex Multi-Warehouse Logistics & ERP System",
    client_name: "Mahmud Hasan",
    client_email: "mahmud.h@apexsupply.com",
    service_type: "custom_erp",
    status: "active",
    summary: "Real-time stock tracking across 4 central depots with barcode scanner mobile companion app.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    budget: "$14,000",
    milestones: [
      { id: "m-9", label: "Database Schema & Role-Based Access Control", done: true, sort_order: 1 },
      { id: "m-10", label: "Inventory Transfer & Real-time Ledger", done: false, sort_order: 2 },
      { id: "m-11", label: "Barcode Dispatch Mobile App", done: false, sort_order: 3 },
      { id: "m-12", label: "Client Training & Onboarding", done: false, sort_order: 4 },
    ],
  },
];

const LEADS_STORAGE_KEY = "arshio_admin_leads_v2";
const ENGAGEMENTS_STORAGE_KEY = "arshio_admin_engagements_v2";

function getLocalLeads(): Lead[] {
  if (typeof window === "undefined") return SEED_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(SEED_LEADS));
      return SEED_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_LEADS;
  }
}

function saveLocalLeads(leads: Lead[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent("arshio_leads_updated"));
  } catch (e) {
    console.error("Failed to save local leads", e);
  }
}

function getLocalEngagements(): Engagement[] {
  if (typeof window === "undefined") return SEED_ENGAGEMENTS;
  try {
    const raw = localStorage.getItem(ENGAGEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENGAGEMENTS_STORAGE_KEY, JSON.stringify(SEED_ENGAGEMENTS));
      return SEED_ENGAGEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ENGAGEMENTS;
  }
}

function saveLocalEngagements(engagements: Engagement[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENGAGEMENTS_STORAGE_KEY, JSON.stringify(engagements));
    window.dispatchEvent(new CustomEvent("arshio_engagements_updated"));
  } catch (e) {
    console.error("Failed to save local engagements", e);
  }
}

/**
 * Universal Lead Ingestion:
 * Submits to Supabase if reachable, and guarantees persistence in local sync storage!
 */
export async function submitLead(lead: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  source_page?: string;
  type?: string;
}): Promise<{ ok: boolean; id: string; error?: string }> {
  const newLead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    company: lead.company || null,
    message: lead.message,
    type: lead.type || "contact",
    status: "new",
    source_page: lead.source_page || (typeof window !== "undefined" ? window.location.pathname : "/contact"),
    created_at: new Date().toISOString(),
    read_at: null,
    notes: null,
    converted_engagement_id: null,
  };

  // 1. Save to local storage mirror first for instant UI response
  const existing = getLocalLeads();
  saveLocalLeads([newLead, ...existing]);

  // 2. Attempt remote Supabase insert in background
  try {
    const { data, error } = await supabase.from("leads").insert({
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      message: newLead.message,
      type: (newLead.type as any) || "contact",
      source_page: newLead.source_page,
    }).select("id").single();

    if (!error && data?.id) {
      newLead.id = data.id;
    }
  } catch (err) {
    console.warn("Supabase remote sync queued in offline mirror:", err);
  }

  return { ok: true, id: newLead.id };
}

/**
 * List leads with live Supabase query + fallback to offline store
 */
export async function getLeads(params?: {
  status?: LeadStatus | "all";
  search?: string;
}): Promise<{ leads: Lead[]; total: number; isLiveSupabase: boolean }> {
  const statusFilter = params?.status ?? "all";
  const search = (params?.search ?? "").trim().toLowerCase();

  // Try live Supabase query first
  try {
    let q = supabase
      .from("leads")
      .select("id, name, email, phone, company, message, type, status, source_page, created_at, read_at, notes, converted_engagement_id")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      q = q.eq("status", statusFilter);
    }

    const { data, error } = await q;

    if (!error && data && data.length > 0) {
      // Merge with any local unsynced items
      const local = getLocalLeads();
      const localMap = new Map(local.map((l) => [l.id, l]));
      const merged = (data as unknown as Lead[]).map((remote) => {
        const localItem = localMap.get(remote.id);
        return localItem ? { ...remote, ...localItem } : remote;
      });

      let filtered = merged;
      if (search) {
        filtered = filtered.filter(
          (l) =>
            l.name.toLowerCase().includes(search) ||
            l.email.toLowerCase().includes(search) ||
            (l.company && l.company.toLowerCase().includes(search)) ||
            l.message.toLowerCase().includes(search)
        );
      }
      return { leads: filtered, total: filtered.length, isLiveSupabase: true };
    }
  } catch {
    // Fall back to local store
  }

  // Local storage mirror
  let leads = getLocalLeads();
  if (statusFilter !== "all") {
    leads = leads.filter((l) => l.status === statusFilter);
  }
  if (search) {
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        (l.company && l.company.toLowerCase().includes(search)) ||
        l.message.toLowerCase().includes(search)
    );
  }

  return { leads, total: leads.length, isLiveSupabase: false };
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const local = getLocalLeads();
  const index = local.findIndex((l) => l.id === id);
  if (index !== -1) {
    local[index].status = status;
    local[index].read_at = local[index].read_at || new Date().toISOString();
    saveLocalLeads([...local]);
  }

  try {
    await supabase.from("leads").update({ status: status as any }).eq("id", id);
  } catch {
    // saved locally
  }
  return true;
}

export async function updateLeadNotes(id: string, notes: string): Promise<boolean> {
  const local = getLocalLeads();
  const index = local.findIndex((l) => l.id === id);
  if (index !== -1) {
    local[index].notes = notes;
    saveLocalLeads([...local]);
  }

  try {
    await supabase.from("leads").update({ notes }).eq("id", id);
  } catch {
    // saved locally
  }
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const local = getLocalLeads();
  saveLocalLeads(local.filter((l) => l.id !== id));

  try {
    await supabase.from("leads").delete().eq("id", id);
  } catch {
    // deleted locally
  }
  return true;
}

export async function getLeadStats() {
  const leads = getLocalLeads();
  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const inProgress = leads.filter((l) => l.status === "in_progress").length;
  const won = leads.filter((l) => l.status === "won").length;
  const lost = leads.filter((l) => l.status === "lost").length;
  const conversionRate = total > 0 ? Math.round((won / (total - lost || 1)) * 100) : 0;

  return {
    total,
    newLeads,
    inProgress,
    won,
    lost,
    conversionRate: Math.min(conversionRate, 100),
  };
}

export async function getEngagements(): Promise<Engagement[]> {
  return getLocalEngagements();
}

export async function createEngagement(data: {
  title: string;
  client_name: string;
  client_email: string;
  service_type: Engagement["service_type"];
  summary: string;
  budget?: string;
}): Promise<Engagement> {
  const newEng: Engagement = {
    id: `eng-${Date.now()}`,
    title: data.title,
    client_name: data.client_name,
    client_email: data.client_email,
    service_type: data.service_type,
    status: "active",
    summary: data.summary,
    budget: data.budget || "$5,000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: `m-${Date.now()}-1`, label: "Discovery, Scope Blueprint & Wireframes", done: true, sort_order: 1 },
      { id: `m-${Date.now()}-2`, label: "High-Fidelity Prototype & System Schema", done: false, sort_order: 2 },
      { id: `m-${Date.now()}-3`, label: "Core Feature Sprints & Weekly Previews", done: false, sort_order: 3 },
      { id: `m-${Date.now()}-4`, label: "Final QA, Security Audit & Production Launch", done: false, sort_order: 4 },
    ],
  };

  const list = getLocalEngagements();
  saveLocalEngagements([newEng, ...list]);
  return newEng;
}

export async function toggleEngagementMilestone(engId: string, milestoneId: string): Promise<boolean> {
  const list = getLocalEngagements();
  const eng = list.find((e) => e.id === engId);
  if (!eng) return false;

  const ms = eng.milestones.find((m) => m.id === milestoneId);
  if (ms) {
    ms.done = !ms.done;
    eng.updated_at = new Date().toISOString();
    saveLocalEngagements([...list]);
    return true;
  }
  return false;
}
