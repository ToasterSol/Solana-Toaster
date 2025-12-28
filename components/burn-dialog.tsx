"use client"

import { useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { burnToken, type TokenAccount } from "@/lib/solana"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Flame, ExternalLink } from "lucide-react"

interface BurnDialogProps {
  token: TokenAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBurnComplete: () => void
}

export function BurnDialog({ token, open, onOpenChange, onBurnComplete }: BurnDialogProps) {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [amount, setAmount] = useState("")
  const [burning, setBurning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)

  const handleBurn = async () => {
    if (!token || !publicKey || !signTransaction) return

    const burnAmount = Number.parseFloat(amount)
    if (isNaN(burnAmount) || burnAmount <= 0 || burnAmount > token.balance) {
      setError("Invalid amount")
      return
    }

    setBurning(true)
    setError(null)
    setSignature(null)

    try {
      const txSignature = await burnToken(
        connection,
        publicKey,
        token.mint,
        burnAmount,
        token.decimals,
        signTransaction,
      )

      setSignature(txSignature)
      setTimeout(() => {
        onBurnComplete()
        handleClose()
      }, 2000)
    } catch (err: any) {
      console.error("Burn failed:", err)
      setError(err.message || "Failed to burn tokens. Please try again.")
    } finally {
      setBurning(false)
    }
  }

  const handleClose = () => {
    setAmount("")
    setError(null)
    setSignature(null)
    onOpenChange(false)
  }

  const setMaxAmount = () => {
    if (token) {
      setAmount(token.balance.toString())
    }
  }

  if (!token) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive" />
            Burn Tokens
          </DialogTitle>
          <DialogDescription className="font-mono text-sm">
            Permanently destroy {token.symbol} tokens from your wallet
          </DialogDescription>
        </DialogHeader>

        {signature ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">Burn Successful!</h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                {amount} {token.symbol} has been burned
              </p>
              <a
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-mono"
              >
                View on Solscan
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-primary/20 bg-card/50">
                {token.logoURI ? (
                  <img
                    src={token.logoURI || "/placeholder.svg"}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-mono font-bold">{token.symbol.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground font-mono">{token.symbol}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{token.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-mono">Balance</p>
                  <p className="font-semibold text-foreground font-mono">{token.balance.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="font-mono">
                  Amount to Burn
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono"
                    disabled={burning}
                    step="any"
                    min="0"
                    max={token.balance}
                  />
                  <Button
                    onClick={setMaxAmount}
                    variant="outline"
                    className="font-mono bg-transparent"
                    disabled={burning}
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-mono">{error}</p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs text-muted-foreground font-mono">
                  Warning: This action is irreversible. Burned tokens cannot be recovered.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} variant="outline" className="font-mono bg-transparent" disabled={burning}>
                Cancel
              </Button>
              <Button
                onClick={handleBurn}
                variant="destructive"
                className="font-mono gap-2"
                disabled={burning || !amount || Number.parseFloat(amount) <= 0}
              >
                {burning ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Burning...
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    Burn Tokens
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
