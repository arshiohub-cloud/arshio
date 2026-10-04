# Build Aria — Voice Concierge (live, talk-to-it demo, powered by Vapi)

The second agent from the fleet, built as a real voice agent: visitors press a button, speak, and Aria answers out loud in real time. Voice runs on **Vapi** (vapi.ai), not ElevenLabs.

## What a visitor does

1. Opens the Aria page (or the demo section on the AI Agents page).
2. Reads a short note on what Aria can do and that the microphone is needed.
3. Presses "Talk to Aria" and allows microphone access.
4. Speaks naturally. Aria listens, replies out loud, answers questions about InsightAI's services, qualifies what the visitor needs, and points them to booking a free AI audit.
5. A live panel shows the state — connecting, listening, Aria speaking — plus a running transcript of both sides.
6. Presses "End call" any time. Under the transcript: "Book a free AI audit" and "Start a new call".

## Rules

- Public, no sign-in. Nothing is stored — ending the call or refreshing clears the transcript. No database work.
- Microphone is only requested after the visitor presses the button, with a plain-language explanation first.
- If the microphone is blocked or the voice service is unavailable, Aria shows a friendly message and a link to the contact page instead of failing silently.
- Clearly labelled as a live demonstration.
- Everything else on the AI Agents page stays exactly as it is — the 6 flagship rows, the show/hide toggle, the 07–25 numbering, the group headings, the Quill demo section, and the commented-out voice sections stay commented out.
- Same visual language as Quill's demo: dark panel, violet/cyan accents, animated voice orb that pulses while Aria speaks or listens (reusing the orb/waveform style already built for the voice showcase).

## What I need from you

1. A **Vapi account** (free tier is fine to start) at vapi.ai.
2. From your Vapi dashboard: your **public API key** (safe to use in the browser) and an **assistant** for Aria — I will give you the exact system prompt, first message, and voice settings to paste in, so Aria knows InsightAI's services, qualifies callers, and offers to book a free AI audit. If you'd rather, Vapi also supports creating the assistant inline from code, so we can start without a pre-made assistant and refine later.
3. I'll request the key through a secure form once you confirm — it is stored safely and never hardcoded.

## Technical notes

- Install `@vapi-ai/web`; `src/components/site/ai/AriaVoice.tsx` creates a `Vapi` client, starts the call with the assistant (inline assistant config or your assistant ID), and renders call state, `isSpeaking`, live transcript from `message` events, and the animated orb. Client-side only — lazy-loaded so SSR never touches browser audio APIs.
- Vapi's public key is a publishable key intended for browser use, so no server token-minting function is needed (unlike ElevenLabs). If you later want call recordings or server-side control, a private key can be added as a secret then.
- `src/routes/agents.aria.tsx` — new page with its own `head()` (unique title, description, og/twitter, canonical), `PageHero`, a three-step "how it works" strip, the voice demo, and a closing CTA — same structure as `agents.quill.tsx`.
- `src/routes/agents.tsx` — Aria's row (currently 08 in the expanded list) gains a "Talk to Aria" button, and a new `#aria-demo` section is added alongside the Quill demo section. No other rows touched.

## Verification

Load `/agents/aria` and `/agents` in a headless browser: page renders, button and permission messaging behave, no console errors. Actual spoken conversation needs a real microphone and your Vapi key, so final voice quality is confirmed by you in the preview.
