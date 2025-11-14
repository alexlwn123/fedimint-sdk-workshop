// src/wallet.ts
import { WalletDirector } from "@fedimint/core"
import { WasmWorkerTransport } from '@fedimint/transport-web'

const director = new WalletDirector(new WasmWorkerTransport())
director.setLogLevel('debug')

await director.initialize()
await director.generateMnemonic().catch(() => { })

const wallet = await director.createWallet()
// @ts-expect-error - globalthis for testing
globalThis.wallet = wallet

export default wallet
