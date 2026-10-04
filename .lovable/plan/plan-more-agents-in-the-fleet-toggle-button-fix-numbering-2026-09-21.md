# Plan: "More agents in the fleet" → toggle button + fix numbering

## Goal
Replace the static "More agents in the fleet" heading on `/agents` with a clickable toggle button that shows/hides the additional agents (the rows in `moreAgents` + `agentGroups`). The extra agents start **hidden** by default. Also fix the index numbering so the additional agents continue after the 6 flagship agents (Forge = 06), i.e. Scout = 07, Aria = 08, Prism = 09, Harbor = 10, then grouped agents continue 11+.

## Changes (single file: `src/routes/agents.tsx`)

1. Add `useState` import; add `showMore` state (default `false`) inside `AgentsPage`.
2. Replace the static `<h3>More agents in the fleet</h3>` block with a styled toggle button:
   - Button text toggles: "Show all agents" (collapsed) ↔ "Hide agents" (expanded).
   - Pill/rounded style, accent `#a78bfa` border + subtle glow, a chevron icon that rotates on toggle. Centered, inside existing `FadeUp` wrapper.
3. Wrap the render block for `moreAgents` + `agentGroups` (the closure mapping those rows + group headings) in `{showMore && (...)}`.
4. **Fix numbering:** change the closure's `let row = 0;` to `let row = 6;` so the additional agents are numbered 07, 08, 09, … continuously after the 6 flagship agents (Forge = 06). The `SplitRow` `index` prop derives the "01"/"02" label, so this single change renumbers the entire additional-fleet block.
   - No data changes; the 6 flagship agents keep their indices 0–5.

## Result
- Page loads with the 6 flagship agents (01–06) + Command Center + Agent Builder.
- "Show all agents" reveals 19 additional agents numbered 07–25, grouped under the 4 headings; clicking again hides them.

## Verification
- Playwright: load `/agents`, confirm flagship rows show 01–06 and button reads "Show all agents"; click → additional rows appear starting at 07–Scout, 08–Aria, 09–Prism, 10–Harbor, continuing through the groups; button reads "Hide agents"; click → hidden.
