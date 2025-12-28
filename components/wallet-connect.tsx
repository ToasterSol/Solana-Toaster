"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function WalletConnect() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      )}

      <div className="wallet-adapter-button-wrapper">
        <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !text-sm !px-3 sm:!px-4 !py-2 !rounded-lg !transition-all !font-medium" />
      </div>
    </div>
  )
}
