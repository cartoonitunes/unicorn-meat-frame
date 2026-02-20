import type { Metadata } from "next";

const EMBED = JSON.stringify({
  version: "1",
  imageUrl: "https://unicornmeateth.com/og-farcaster.png",
  button: {
    title: "🍖 Grind Meat",
    action: {
      type: "launch_frame",
      name: "Unicorn Meat",
      url: "https://meat.unicornmeateth.com",
      splashImageUrl: "https://unicornmeateth.com/logo-200.png",
      splashBackgroundColor: "#0a2a2a",
    },
  },
});

export const metadata: Metadata = {
  title: "Unicorn Meat 🍖 | The OG Ethereum Token on Base",
  description:
    "Born in 2016 from the original Unicorn contract on Ethereum, now grinding on Base. Swap w🍖 directly from Farcaster.",
  other: {
    "fc:miniapp": EMBED,
    "fc:frame": EMBED,
  },
  openGraph: {
    title: "Unicorn Meat 🍖",
    description: "The OG Ethereum token, now on Base",
    images: ["https://unicornmeateth.com/og-farcaster.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
