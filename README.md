# 🍖 Unicorn Meat — Farcaster Mini App

A Farcaster Mini App for **Unicorn Meat (w🍖)** on Base chain. Users can check the price and swap directly from their Farcaster feed.

## Features

- 🔪 **Swap w🍖** directly via Farcaster's native swap UI (Base chain)
- 📊 **Live price** from GeckoTerminal
- 🏛️ **Heritage story** — one of the earliest Ethereum tokens (2015)
- 🔗 Links to website, Telegram, and charts

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect to Vercel, deploy
3. Set your domain (e.g. `meat.unicornmeateth.com`)

## Before Sharing on Farcaster

### 1. Create OG images

You need two images hosted at unicornmeateth.com:
- `og-farcaster.png` — 3:2 aspect ratio (e.g. 1200x800) — the embed card image
- `logo-200.png` — 200x200 — splash screen icon

### 2. Sign the manifest

The `/.well-known/farcaster.json` manifest needs an `accountAssociation` signed by the `@unicornmeat` Farcaster account:

1. Go to https://farcaster.xyz/~/settings/developer-tools
2. Enable Developer Mode
3. Use the Mini App developer tools to create/sign the manifest
4. Copy the `accountAssociation` object (header, payload, signature) into `app/.well-known/farcaster.json/route.ts`
5. Redeploy

### 3. Update URLs

If not using `meat.unicornmeateth.com`, update all URLs in:
- `app/layout.tsx` (meta tags)
- `app/.well-known/farcaster.json/route.ts` (manifest)

### 4. Share on Farcaster

Once deployed and manifest signed, cast the app URL from the `@unicornmeat` account. The mini app embed will render automatically with the "🍖 Grind Meat" button.

## Tech Stack

- Next.js 15 (App Router)
- Farcaster MiniApp SDK
- GeckoTerminal API for pricing
- Vercel for hosting
