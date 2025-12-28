import { type Connection, PublicKey, Transaction } from "@solana/web3.js"
import { createBurnInstruction, getAssociatedTokenAddress } from "@solana/spl-token"

export interface TokenAccount {
  mint: string
  balance: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

export async function fetchTokenAccounts(walletAddress: string): Promise<TokenAccount[]> {
  try {
    const response = await fetch(`/api/tokens?wallet=${walletAddress}`)

    if (!response.ok) {
      throw new Error("Failed to fetch tokens")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token accounts:", error)
    throw error
  }
}

export async function burnToken(
  connection: Connection,
  owner: PublicKey,
  mint: string,
  amount: number,
  decimals: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
): Promise<string> {
  try {
    const mintPublicKey = new PublicKey(mint)
    const tokenAccount = await getAssociatedTokenAddress(mintPublicKey, owner)

    const burnAmount = amount * Math.pow(10, decimals)

    const transaction = new Transaction().add(createBurnInstruction(tokenAccount, mintPublicKey, owner, burnAmount))

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = owner

    const signed = await signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signed.serialize())

    await connection.confirmTransaction(signature, "confirmed")

    return signature
  } catch (error) {
    console.error("Error burning token:", error)
    throw error
  }
}
