// wallet.ts

import { WalletDirector } from "@fedimint/core"
import { WasmWorkerTransport } from '@fedimint/transport-web'

// Create the Wallet client
const director = new WalletDirector(new WasmWorkerTransport())

try {
  await director.initialize()
  const words = await director.generateMnemonic()
  await director.setMnemonic(words)
} catch (error) {
  console.error('Failed to generate mnemonic:', error)
}

const wallet = await director.createWallet()

// @ts-expect-error - globalthis for testing
globalThis.wallet = wallet

director.setLogLevel('debug')

export default wallet
