# Carte (Next.js 14 + Tailwind)

Mobile-first menu translator and advisor using Claude vision.

## Setup

1. Install deps

```bash
pnpm i
# or npm i / yarn
```

2. Env

Create `.env.local` in project root:

```
ANTHROPIC_API_KEY='your-anthropic-api-key-here'
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

3. Run

```bash
pnpm dev
```

## How it works
- Client captures or uploads a menu photo.
- Sends to `/api/parse` (Edge runtime) which calls Claude with strict JSON instructions.
- UI displays sections and items, allergens, badges, spice levels, and prices.
- Sticky action bar shows count and total; order summary supports a full-screen "Show to Waiter" mode.
