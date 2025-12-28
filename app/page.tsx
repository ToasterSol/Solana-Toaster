"use client"

import { WalletProvider } from "@/components/wallet-provider"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenList } from "@/components/token-list"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl flex items-center justify-center">
                  <span className="text-primary font-bold text-xl sm:text-2xl">B</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">BURNER</h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wider">TOKEN ELIMINATION</p>
                </div>
              </div>

              <WalletConnect />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 sm:mb-12 text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Burn Your Tokens
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Connect your wallet to view and permanently burn SPL tokens from your Solana wallet
              </p>
            </div>

            <TokenList />
          </div>
        </main>

        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-md mt-16 sm:mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">›</span>
                <span>Developed by ErenFlux</span>
              </div>
              <div className="flex items-center gap-6 text-muted-foreground">
                <a
                  href="https://erenflux.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  erenflux.dev
                </a>
                <a
                  href="https://github.com/ErenFlux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  )
}
