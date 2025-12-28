import { type NextRequest, NextResponse } from "next/server"
import { HELIUS_RPC, BIRDEYE_API_KEY } from "@/lib/env"

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("wallet")

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const response = await fetch(HELIUS_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "token-accounts",
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress,
          { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
          { encoding: "jsonParsed" },
        ],
      }),
    })

    const data = await response.json()

    if (!data.result?.value) {
      return NextResponse.json([])
    }

    const tokenAccounts = await Promise.all(
      data.result.value.map(async (account: any) => {
        const parsedInfo = account.account.data.parsed.info
        const mint = parsedInfo.mint
        const balance = parsedInfo.tokenAmount.uiAmount
        const decimals = parsedInfo.tokenAmount.decimals

        if (balance === 0) return null

        const tokenInfo = await fetchTokenInfo(mint)

        return {
          mint,
          balance,
          decimals,
          symbol: tokenInfo.symbol || "UNKNOWN",
          name: tokenInfo.name || "Unknown Token",
          logoURI: tokenInfo.logoURI,
        }
      }),
    )

    return NextResponse.json(tokenAccounts.filter((token) => token !== null))
  } catch (error) {
    console.error("Error fetching token accounts:", error)
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 })
  }
}

async function fetchTokenInfo(mint: string): Promise<{ symbol: string; name: string; logoURI?: string }> {
  try {
    const response = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${mint}`, {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
      },
    })

    if (!response.ok) {
      return { symbol: "UNKNOWN", name: "Unknown Token" }
    }

    const data = await response.json()

    return {
      symbol: data.data?.symbol || "UNKNOWN",
      name: data.data?.name || "Unknown Token",
      logoURI: data.data?.logoURI,
    }
  } catch (error) {
    console.error("Error fetching token info:", error)
    return { symbol: "UNKNOWN", name: "Unknown Token" }
  }
}
