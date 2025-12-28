# Burner
Toaster
A Solana token burner application that allows users to permanently burn SPL tokens from their wallet. With an option to also automate buy-backs.

## Features

- Connect with Phantom and Solflare wallets
- View all SPL tokens in your wallet with real-time balances
- Burn any amount of tokens with transaction confirmation
- Token metadata fetched from Birdeye API
- Dark cyber-themed UI optimized for mobile and desktop

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Solana Web3.js & Wallet Adapter
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Helius API key ([Get one here](https://www.helius.dev/))
- A Birdeye API key ([Get one here](https://birdeye.so/))

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ErenFlux/burner.git
cd burner
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file in the root directory and add your API keys:
\`\`\`env
HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY
BIRDEYE_API_KEY=YOUR_BIRDEYE_API_KEY
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Connect Wallet" and select either Phantom or Solflare
2. Approve the connection in your wallet
3. Your tokens will automatically load
4. Click "Burn" on any token to permanently destroy it
5. Enter the amount you want to burn and confirm
6. Sign the transaction in your wallet
7. View your transaction on Solscan

## Security

- All API keys are stored as environment variables and never exposed to the client
- Token burning is irreversible - use with caution
- Always verify the token and amount before confirming

## Developer

Built by [DevvingToRetire](https://x.com/DevvingToRetire)

- GitHub: [@ToasterSol](https://github.com/ToasterSol)

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
