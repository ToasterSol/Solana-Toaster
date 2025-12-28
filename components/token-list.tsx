"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { fetchTokenAccounts, type TokenAccount } from "@/lib/solana"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BurnDialog } from "@/components/burn-dialog"
import { Flame } from "lucide-react"

export function TokenList() {
  const { publicKey, connected } = useWallet()
  const [tokens, setTokens] = useState<TokenAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenAccount | null>(null)
  const [burnDialogOpen, setBurnDialogOpen] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      loadTokens()
    } else {
      setTokens([])
      setError(null)
    }
  }, [connected, publicKey])

  const loadTokens = async () => {
    if (!publicKey) return

    setLoading(true)
    setError(null)

    try {
      const tokenAccounts = await fetchTokenAccounts(publicKey.toString())
      setTokens(tokenAccounts)
    } catch (err) {
      console.error("Failed to load tokens:", err)
      setError("Failed to load tokens. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBurnClick = (token: TokenAccount) => {
    setSelectedToken(token)
    setBurnDialogOpen(true)
  }

  const handleBurnComplete = () => {
    loadTokens()
  }

  if (!connected) {
    return (
      <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <Flame className="w-8 h-8 text-primary/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">No Wallet Connected</h3>
            <p className="text-sm text-muted-foreground font-mono">Connect your wallet to view and burn tokens</p>
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Loading tokens...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-destructive font-mono">{error}</p>
          <Button onClick={loadTokens} variant="outline" className="font-mono bg-transparent">
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  if (tokens.length === 0) {
    return (
      <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <Flame className="w-8 h-8 text-primary/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">No Tokens Found</h3>
            <p className="text-sm text-muted-foreground font-mono">This wallet doesn't have any SPL tokens</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground font-mono">
            Found <span className="text-primary font-bold">{tokens.length}</span> token{tokens.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={loadTokens} variant="outline" size="sm" className="font-mono bg-transparent">
            Refresh
          </Button>
        </div>

        <div className="grid gap-4">
          {tokens.map((token) => (
            <Card
              key={token.mint}
              className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {token.logoURI ? (
                    <img
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-mono font-bold">{token.symbol.charAt(0)}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground font-mono truncate">{token.symbol}</h3>
                    <p className="text-sm text-muted-foreground font-mono truncate">{token.name}</p>
                    <p className="text-xs text-muted-foreground/70 font-mono mt-1 truncate">{token.mint}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-mono">Balance</p>
                    <p className="text-lg font-bold text-foreground font-mono">{token.balance.toLocaleString()}</p>
                  </div>

                  <Button
                    onClick={() => handleBurnClick(token)}
                    variant="destructive"
                    size="sm"
                    className="font-mono gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    Burn
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BurnDialog
        token={selectedToken}
        open={burnDialogOpen}
        onOpenChange={setBurnDialogOpen}
        onBurnComplete={handleBurnComplete}
      />
    </>
  )
}
