# Build Quill — the Proposal & Quotation agent (public demo)

Quill goes from a description in the fleet list to something a visitor can actually use on the website. They type in a client brief, Quill writes back a real proposal, and the page invites them to talk to you about deploying it.

## What the visitor does

1. On the AI Agents page, Quill's row gets a "Try Quill" button that opens the live demo below it (and a direct link `/agents/quill`).
2. The visitor fills in a short brief:
   - Client or company name
   - Industry
   - What they need (free text — the requirements)
   - Budget range (optional)
   - Desired timeline (optional)
3. They press "Generate proposal". Quill streams a proposal back on screen, section by section:
   - Executive summary
   - Scope of work
   - Proposed approach / phases
   - Timeline with milestones
   - Investment (pricing table, clearly marked as indicative)
   - Assumptions and next steps
4. Under the result: "Copy proposal", "Start over", and a "Book a free AI audit" button pointing at the contact page.

Two or three one-click example briefs sit above the form so a visitor can see the result without typing anything.

## Rules for this build

- Public — no sign-in needed.
- Nothing is saved: refreshing the page clears the demo. No database work.
- The demo is labelled as a demonstration and the pricing as indicative, so no one mistakes it for a quote from you.
- Light abuse protection: input length limits, one request at a time, and a short cool-down between generations in the same browser session.
- Everything else on the AI Agents page stays exactly as it is, including the flagship rows, the show/hide toggle and the numbering.

## How it looks

Same visual language as the rest of the site — dark panel, violet/cyan accents, the split-row rhythm already used on this page. The proposal renders as a formatted document panel (headings, bullet lists, a simple pricing table) rather than raw text, with a shimmer while Quill is thinking.

## Technical detail

- New server function `src/lib/quill-proposal.functions.ts`: `createServerFn` with a zod-validated input (company, industry, requirements, budget, timeline), building the proposal through the Lovable AI gateway with `openai/gpt-6-astra` on the Responses API — streamed, consumed as a streamed response so long generations don't time out. Errors map to friendly messages (rate limit, credits, generic) as in the existing `agent-spec.functions.ts`.
- New component `src/components/site/ai/QuillProposal.tsx`: the form, example briefs, streaming output, copy/reset/CTA actions. Markdown-ish output rendered with a small formatter; no new dependencies.
- New route `src/routes/agents.quill.tsx` with its own `head()` (unique title, description, og/twitter tags) hosting a hero plus the demo component.
- `src/routes/agents.tsx`: Quill's row gains a "Try Quill" link/button; the demo component is also embedded inline on the page under the fleet section. No other rows touched.
