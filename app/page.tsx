"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

const W_MEAT_BASE = "0xa0ff877E3d4f3a108B1B3d5eB3e4369301D2b2D7";
const BUY_TOKEN = `eip155:8453/erc20:${W_MEAT_BASE}`;
const SELL_TOKEN = "eip155:8453/native"; // Base ETH

export default function Home() {
  const [price, setPrice] = useState<string | null>(null);
  const [swapResult, setSwapResult] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState("0.01");

  useEffect(() => {
    sdk.actions.ready();

    // Fetch price from CoinGecko
    fetch(
      "https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=0xa0ff877E3d4f3a108B1B3d5eB3e4369301D2b2D7&vs_currencies=usd"
    )
      .then((r) => r.json())
      .then((data) => {
        const p = data?.["0xa0ff877e3d4f3a108b1b3d5eb3e4369301d2b2d7"]?.usd;
        if (p) setPrice(p.toFixed(6));
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
        setSwapResult("Meat acquired! Tx: " + result.swap.transactions[0]?.slice(0, 10) + "...");
      } else {
        setSwapResult(result.reason === "rejected_by_user" ? "Cancelled" : "Swap failed");
      }
    } catch {
      setSwapResult("Swap not available in this client");
    }
  }, []);

  const handleQuote = useCallback(async () => {
    setQuoteText(null);
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) throw new Error("Wallet provider unavailable");
      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      const swapper = accounts?.[0];
      if (!swapper) throw new Error("No wallet connected");

      const [whole, frac = ""] = ethAmount.split(".");
      const fracPadded = (frac + "000000000000000000").slice(0, 18);
      const amountWei = `${whole || "0"}${fracPadded}`.replace(/^0+/, "") || "0";

      const res = await fetch("/api/uniswap/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapper,
          amount: amountWei,
          tokenIn: "0x0000000000000000000000000000000000000000",
          tokenOut: "0xa0ff877E3d4f3a108B1B3d5eB3e4369301D2b2D7",
          chainId: 8453,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Quote failed");

      const out = data?.data?.quote?.output?.amount;
      if (!out) throw new Error("No quote output");

      const outHuman = (Number(out) / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 });
      const gasUsd = data?.data?.quote?.gasFeeUSD || "?";
      setQuoteText(`${ethAmount} ETH ≈ ${outHuman} w🍖 (est. gas $${gasUsd})`);
    } catch (e: any) {
      setQuoteText(`Quote error: ${e?.message || "unknown"}`);
    }
  }, [ethAmount]);

  const handleViewToken = useCallback(async () => {
    const chartUrl = "https://www.dextools.io/app/en/base/pair-explorer/0xb9ce62df766ffc0bb0d5d530e2dde32ec3baa578";
    try {
      await sdk.actions.openUrl(chartUrl);
    } catch {
      window.open(chartUrl, "_blank");
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
      <div style={styles.card}>
        <div style={styles.priceLabel}>Preview swap quote</div>
        <input
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="0.01"
          style={styles.input}
        />
        <button style={styles.viewButton} onClick={handleQuote}>
          Get Uniswap Quote
        </button>
        {quoteText && <div style={styles.result}>{quoteText}</div>}
      </div>

      <button style={styles.swapButton} onClick={handleSwap}>
        GRIND SOME MEAT
      </button>

      <button style={styles.viewButton} onClick={handleViewToken}>
        View Chart
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
              "https://www.dextools.io/app/en/base/pair-explorer/0xb9ce62df766ffc0bb0d5d530e2dde32ec3baa578"
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
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    marginTop: "8px",
    marginBottom: "10px",
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
