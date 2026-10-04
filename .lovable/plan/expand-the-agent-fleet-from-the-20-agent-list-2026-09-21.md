# Expand the Agent Fleet from the 20-agent list

I compared your 20 agent ideas with the 10 agents already on the Agents page and found which are duplicates, which are near-duplicates to fold in, and which are genuinely new.

## Already covered (no new agent)

| Your idea | Existing agent |
| --- | --- |
| 2. Customer Support Agent | Atlas — Support Copilot |
| 3. Sales Agent | Nova — Sales SDR |
| 17. Research Agent | Lex — Research Analyst + Scout — Market Research |
| 9. Finance questions (partly) | Prism — Data Analyst (data Q&A only) |
| 12. SOP Agent (partly) | Harbor — Onboarding |
| Custom builds | Forge — Custom Agent |
| Voice front desk | Aria — Voice Concierge |

Notes on the two partials: Prism answers data questions but does not touch invoices, bank feeds or accounting — so a finance agent is still new. Harbor onboards people but does not run SOP-driven actions company-wide — folded into the Company Brain agent below.

## New agents to add (15)

5 of your 20 ideas are already covered by existing agents (Customer Support = Atlas, Sales = Nova, Research = Lex/Scout, Compliance = Sentinel, SOP = Harbor). The remaining 15 are new. Each keeps the existing wording pattern: name — role, a short role label, one sentence describing autonomous outcomes, and 3 tags.

1. Orion — AI Operations Employee (SME digital assistant: answers staff questions from your documents, writes reports, sends email, updates CRM, creates tasks, books meetings, escalates)
2. Cortex — Company Brain (one searchable memory across Drive, Notion, Slack, 365, PDFs and your database, with cited answers and SOP steps it can execute)
3. Vault — Document Intelligence (reads invoices, forms, certificates and reports, extracts structured fields, validates and routes for approval)
4. Clause — Contract Intelligence (answers obligation, renewal and termination questions across your contract library and flags unusual clauses)
5. Quill — Proposal & Quotation (turns client requirements into scope, timeline, pricing and a draft contract using your past proposals and rate cards)
6. Sage — Recruiting Agent (parses CVs, scores against the job description, ranks candidates, builds interview questions, schedules and reports)
7. Ledger — Finance Assistant (explains spend changes, chases unpaid invoices, categorises expenses and produces the monthly summary)
8. Relay — Procurement Agent (takes a purchase need, sources approved vendors, gathers quotes, compares and prepares the purchase request)
9. Cadence — Meeting to Action (turns recordings into decisions, owners and deadlines, pushes them to your tools and chases them)
10. Beacon — Marketing Agent (research to content to approval to publishing to performance reporting as one loop)
11. Chorus — Feedback Agent (classifies reviews, tickets and surveys into themes, sentiment and churn signals, then opens tasks)
12. Keystone — Property Operations (turns maintenance reports into prioritised work orders, vendor dispatch, owner updates and reports)
13. Arbiter — Claims Agent (intakes claim documents and photos, checks completeness against the policy, estimates and routes to a human adjuster)
14. Pulse — Healthcare Admin Agent (handles appointment booking, insurance verification, document collection, reminders and follow-up — no diagnosis, admin only)
15. Mentor — Education Agent (powers AI tutoring, quiz generation, weak-topic detection and progress reports for schools, universities and tutoring companies)

All 20 of your ideas are accounted for: 5 overlapped with existing agents, 15 are new. That makes **25 agents total** — the 10 already in the fleet plus these 15.

## How they appear on the page

- The "Agent Fleet" section keeps its 6 flagship rows unchanged.
- "More agents in the fleet" grows from 4 to 19 rows, same alternating split-row layout, same accent colour cycle, same tag pills.
- Because that becomes a long list, the expanded group gets a light grouping: short headings for Operations & Knowledge, Revenue & Documents, People & Money, and Industry agents, so a visitor can scan it.
- No new page, no backend work, no change to the command center or agent builder.

## Technical detail

Edits are confined to `src/routes/agents.tsx`: extend the `moreAgents` array with the 15 entries (icon from `lucide-react`, emoji, name, tags, desc) and render it in grouped batches with continuous index numbering through `SplitRow`. Homepage `Agents.tsx` stays at its current 6 and is untouched.
