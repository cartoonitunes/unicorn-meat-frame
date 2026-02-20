"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

const W_MEAT_BASE = "0xa0ff877E3d4f3a108B1B3d5eB3e4369301D2b2D7";
const BUY_TOKEN = `eip155:8453/erc20:${W_MEAT_BASE}`;
const SELL_TOKEN = "eip155:8453/native"; // Base ETH

export default function Home() {
  const [price, setPrice] = useState<string | null>(null);
  const [swapResult, setSwapResult] = useState<string | null>(null);

  useEffect(() => {
    sdk.actions.ready();

    // Fetch price from GeckoTerminal
    fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/tokens/${W_MEAT_BASE}`
    )
      .then((r) => r.json())
      .then((data) => {
        const p = data?.data?.attributes?.price_usd;
        if (p) setPrice(parseFloat(p).toFixed(6));
      })
      .catch(() => {});
  }, []);

  const handleSwap = useCallback(async () => {
    setSwapResult(null);
    try {
      const result = await sdk.actions.swapToken({
        buyToken: BUY_TOKEN,
        sellToken: SELL_TOKEN,
      });
      if (result.success) {
        setSwapResult("🍖 Meat acquired! Tx: " + result.swap.transactions[0]?.slice(0, 10) + "...");
      } else {
        setSwapResult(result.reason === "rejected_by_user" ? "Cancelled" : "Swap failed");
      }
    } catch {
      setSwapResult("Swap not available in this client");
    }
  }, []);

  const handleViewToken = useCallback(async () => {
    try {
      await sdk.actions.viewToken({
        token: BUY_TOKEN,
      });
    } catch {
      // Fallback: open in browser
      sdk.actions.openUrl("https://www.geckoterminal.com/base/tokens/" + W_MEAT_BASE);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.emoji}>🦄🍖</div>
        <h1 style={styles.title}>UNICORN MEAT</h1>
        <p style={styles.subtitle}>The OG Ethereum Token — Now on Base</p>
      </div>

      {/* Price Card */}
      <div style={styles.card}>
        <div style={styles.priceLabel}>w🍖 Price</div>
        <div style={styles.price}>{price ? `$${price}` : "Loading..."}</div>
        <div style={styles.chain}>Base Chain</div>
      </div>

      {/* Action Buttons */}
      <button style={styles.swapButton} onClick={handleSwap}>
        🔪 GRIND SOME MEAT
      </button>

      <button style={styles.viewButton} onClick={handleViewToken}>
        📊 View Token
      </button>

      {swapResult && <div style={styles.result}>{swapResult}</div>}

      {/* Heritage Section */}
      <div style={styles.heritage}>
        <h2 style={styles.heritageTitle}>🏛️ Heritage</h2>
        <p style={styles.heritageText}>
          Unicorn Meat was born in 2016 from the original Unicorn contract —
          one of the earliest tokens on Ethereum. Grind a unicorn, get meat.
          A piece of blockchain archaeology, now bridged to Base for the next
          generation of onchain degens.
        </p>
      </div>

      {/* Links */}
      <div style={styles.links}>
        <a
          style={styles.link}
          onClick={() => sdk.actions.openUrl("https://unicornmeateth.com")}
        >
          🌐 Website
        </a>
        <a
          style={styles.link}
          onClick={() => sdk.actions.openUrl("https://t.me/UnicornMeatEth")}
        >
          💬 Telegram
        </a>
        <a
          style={styles.link}
          onClick={() =>
            sdk.actions.openUrl(
              "https://www.geckoterminal.com/base/tokens/" + W_MEAT_BASE
            )
          }
        >
          📈 Chart
        </a>
      </div>

      <div style={styles.footer}>
        Built with 🍖 on Base
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a2a2a 0%, #0d1a1a 50%, #0a1f1f 100%)",
    color: "#fff",
    fontFamily: "'Inter', -apple-system, sans-serif",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "-100px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(42,120,120,0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1,
  },
  emoji: {
    fontSize: "48px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 900,
    letterSpacing: "2px",
    margin: 0,
    background: "linear-gradient(135deg, #d4a843, #f0c050, #e8a830)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "14px",
    color: "#d4a843",
    marginTop: "6px",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px 32px",
    textAlign: "center",
    marginBottom: "20px",
    border: "1px solid rgba(212,168,67,0.2)",
    width: "100%",
    maxWidth: "320px",
  },
  priceLabel: {
    fontSize: "13px",
    color: "#d4a843",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  price: {
    fontSize: "32px",
    fontWeight: 800,
    margin: "4px 0",
  },
  chain: {
    fontSize: "12px",
    color: "#6b7280",
  },
  swapButton: {
    width: "100%",
    maxWidth: "320px",
    padding: "16px",
    fontSize: "18px",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg, #d4a843, #e8a830)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    letterSpacing: "1px",
    marginBottom: "10px",
  },
  viewButton: {
    width: "100%",
    maxWidth: "320px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#d4a843",
    background: "rgba(212,168,67,0.1)",
    border: "1px solid rgba(212,168,67,0.3)",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  result: {
    fontSize: "14px",
    color: "#4ade80",
    marginBottom: "16px",
    textAlign: "center",
  },
  heritage: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "320px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  heritageTitle: {
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 8px 0",
  },
  heritageText: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#d1d5db",
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
  },
  link: {
    fontSize: "13px",
    color: "#d4a843",
    cursor: "pointer",
    textDecoration: "none",
  },
  footer: {
    fontSize: "12px",
    color: "#4b5563",
    marginTop: "auto",
    paddingTop: "16px",
  },
};
