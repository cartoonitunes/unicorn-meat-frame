import { NextResponse } from "next/server";

// The accountAssociation must be signed by the Farcaster account owner.
// Julian: Use the Farcaster developer tools to generate this signature.
// 1. Go to https://farcaster.xyz/~/settings/developer-tools
// 2. Create a new Mini App manifest
// 3. Copy the accountAssociation object here

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "PLACEHOLDER_NEEDS_SIGNING",
      payload: "PLACEHOLDER",
      signature: "PLACEHOLDER",
    },
    frame: {
      version: "1",
      name: "Unicorn Meat",
      iconUrl: "https://unicorn-meat-frame.vercel.app/logo-200.png",
      homeUrl: "https://unicorn-meat-frame.vercel.app",
      splashImageUrl: "https://unicorn-meat-frame.vercel.app/logo-200.png",
      splashBackgroundColor: "#0a2a2a",
      subtitle: "The OG Ethereum Token on Base",
      description:
        "Unicorn Meat — born in 2016 from the original Unicorn contract on Ethereum, now on Base. Swap w🍖 directly from Farcaster.",
      primaryCategory: "social",
      tags: ["defi", "meme", "ethereum", "base", "history"],
      heroImageUrl: "https://unicorn-meat-frame.vercel.app/og-farcaster.png",
      tagline: "Grind some meat 🔪🦄🍖",
      ogTitle: "Unicorn Meat 🍖",
      ogDescription: "The OG Ethereum token, now on Base. Swap directly in Farcaster.",
      ogImageUrl: "https://unicorn-meat-frame.vercel.app/og-farcaster.png",
    },
  });
}
