import { NextResponse } from "next/server";

// The accountAssociation must be signed by the Farcaster account owner.
// Julian: Use the Farcaster developer tools to generate this signature.
// 1. Go to https://farcaster.xyz/~/settings/developer-tools
// 2. Create a new Mini App manifest
// 3. Copy the accountAssociation object here

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "eyJmaWQiOjExNDg2NDksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1ZTcyQ0FGRDcxZmQxZkQ3QjUyMmQ3MWZjY0QxYTcyMTIwRmZBMjY5In0",
      payload: "eyJkb21haW4iOiJ1bmljb3JuLW1lYXQtZnJhbWUudmVyY2VsLmFwcCJ9",
      signature: "iM9DUC1X3sQSzhAp8FIZ/0P5iwbRgut+9LgRF83fH5EU4Qa2wFPMu2nzLTagrSZy5aS4Wl69+NNykvAlslWjQRs=",
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
        "Unicorn Meat -- born in 2016 from the original Unicorn contract on Ethereum, now on Base. Swap directly from Farcaster.",
      primaryCategory: "social",
      tags: ["defi", "meme", "ethereum", "base", "history"],
      heroImageUrl: "https://unicorn-meat-frame.vercel.app/og-farcaster.png",
      tagline: "Grind some meat",
      ogTitle: "Unicorn Meat",
      ogDescription: "The OG Ethereum token, now on Base. Swap directly in Farcaster.",
      ogImageUrl: "https://unicorn-meat-frame.vercel.app/og-farcaster.png",
    },
  });
}
