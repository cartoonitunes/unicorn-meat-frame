import { NextRequest, NextResponse } from "next/server";

const TRADE_API = "https://trade-api.gateway.uniswap.org/v1/quote";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.UNISWAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "UNISWAP_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      swapper,
      amount,
      tokenIn = "0x0000000000000000000000000000000000000000", // native ETH
      tokenOut = "0xa0ff877E3d4f3a108B1B3d5eB3e4369301D2b2D7", // w🍖 on Base
      chainId = 8453,
      slippageTolerance = 1,
    } = body || {};

    if (!swapper || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing swapper or amount" },
        { status: 400 }
      );
    }

    const payload = {
      swapper,
      tokenIn,
      tokenOut,
      tokenInChainId: String(chainId),
      tokenOutChainId: String(chainId),
      amount,
      type: "EXACT_INPUT",
      slippageTolerance,
      routingPreference: "BEST_PRICE",
    };

    const res = await fetch(TRADE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-universal-router-version": "2.0",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data?.detail || "Quote failed", raw: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
