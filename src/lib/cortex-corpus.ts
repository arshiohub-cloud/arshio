/** Sample company knowledge used by the public Cortex demo. Browser-safe (no server imports). */
export type CortexSource = {
  id: string;
  title: string;
  kind: string;
  body: string;
};

export const CORTEX_SOURCES: CortexSource[] = [
  {
    id: "sop",
    title: "Internal Operations SOP v4.2",
    kind: "Standard Operating Procedure",
    body: `# Purchase approvals
Any purchase under $1,000 is approved by the team lead. Purchases between $1,000 and $10,000 require the department head plus Finance. Anything above $10,000 goes to the operations director and must include two comparative vendor quotes.

# New vendor onboarding
A new vendor must submit a W-9, proof of liability insurance, and banking details through the vendor portal. Finance verifies the documents within three business days. No invoice is paid before the vendor record is marked Verified.

# Incident escalation
Severity 1 means a client-facing system is down. Severity 1 incidents are escalated to the on-call engineer immediately and to the operations director within 15 minutes. A written post-incident review is due within 5 business days.

# Client reporting cadence
Every active client receives a written progress update every second Friday, and a live review call at the end of each delivery phase.`,
  },
  {
    id: "policy",
    title: "Remote Work & Expense Policy 2026",
    kind: "HR Policy",
    body: `# Remote work eligibility
All full-time staff may work remotely up to three days per week after completing 60 days of employment. Fully remote arrangements require written approval from the department head and are reviewed every six months.

# Home office stipend
Employees receive a one-time $600 home office stipend and $45 per month toward internet costs. Receipts must be submitted within 30 days of purchase.

# Travel expenses
Economy airfare, standard hotel rooms up to $220 per night, and meals up to $65 per day are reimbursable. Ride-share is preferred over rental cars for trips under three days. Alcohol is not reimbursable.

# Expense submission deadline
Expenses must be submitted within 30 days of being incurred. Claims older than 60 days require director approval and are paid at the company's discretion.

# Paid time off
Staff accrue 15 days of paid leave in year one, 20 days from year three. Unused leave carries over up to 5 days into the next calendar year.`,
  },
  {
    id: "sla",
    title: "InsightAI Client SLA Guidelines",
    kind: "Service Agreement",
    body: `# Support response times
Critical issues are acknowledged within 1 hour and worked continuously until resolved. High priority issues are acknowledged within 4 business hours, normal priority within one business day.

# Uptime commitment
Managed AI agents carry a 99.5% monthly uptime commitment. If uptime falls below that, the client receives a 10% service credit for that month; below 98%, a 25% credit.

# Scheduled maintenance
Maintenance windows are Saturdays 02:00–06:00 Eastern, announced at least 72 hours in advance. Maintenance windows do not count against uptime.

# Data handling
Client data stays in the client's own cloud tenancy or in a dedicated encrypted store. Data is never used to train third-party models. Deletion requests are completed within 14 days.

# Change requests
Minor changes under four hours of effort are included each month. Larger changes are quoted as a scoped change order before work begins.`,
  },
  {
    id: "kickoff",
    title: "Client Kickoff Playbook",
    kind: "Delivery Playbook",
    body: `# Week 0 — discovery
Run a two-hour discovery workshop with the client's process owners. Capture current workflow, volumes, systems of record, and the single metric that defines success.

# Week 1 — access and data
Collect read access to the required systems, sample documents, and a named client sponsor. Delivery does not start until access is confirmed in writing.

# Weeks 2 to 4 — pilot build
Build the pilot against a narrow slice of real work. Review with the client at the end of each week. The pilot must show a measurable baseline versus the manual process.

# Week 5 — acceptance
Acceptance requires the agreed accuracy threshold on a held-out sample, a runbook, and a trained internal owner on the client side.

# Handover
Every engagement ends with a handover pack: architecture summary, runbook, prompt and policy documentation, and a 30-day support window.`,
  },
];
