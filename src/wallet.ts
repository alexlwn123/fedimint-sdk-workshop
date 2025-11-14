// wallet.ts

import { WalletDirector } from "@fedimint/core"
import { WasmWorkerTransport } from '@fedimint/transport-web'


// Create the Wallet client
const director = new WalletDirector(new WasmWorkerTransport())

const wallet = await director.createWallet()
try {
  await director.generateMnemonic()
} catch (error) {
  console.error('Failed to generate mnemonic:', error)
}

// @ts-expect-error - globalthis for testing
globalThis.wallet = wallet

director.setLogLevel('debug')

export default wallet
