export const HELIUS_RPC = process.env.HELIUS_RPC!
export const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY!

// Validate environment variables
if (!HELIUS_RPC) {
  throw new Error("HELIUS_RPC environment variable is required")
}

if (!BIRDEYE_API_KEY) {
  throw new Error("BIRDEYE_API_KEY environment variable is required")
}
