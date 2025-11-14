import { useEffect, useState } from 'react'
import './App.css'
import wallet from './wallet'

type ModalType = 'send' | 'receive' | null

const App = () => {
  const [balance, setBalance] = useState<number>(0)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [invoice, setInvoice] = useState<string>('')
  const [generatedInvoice, setGeneratedInvoice] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const FEDERATION_INVITE = "fed11qgqrgvnhwden5te0v9k8q6rp9ekh2arfdeukuet595cr2ttpd3jhq6rzve6zuer9wchxvetyd938gcewvdhk6tcqqysptkuvknc7erjgf4em3zfh90kffqf9srujn6q53d6r056e4apze5cw27h75"; // testnet

  useEffect(() => {
    const openWallet = async () => {
      try {
        await wallet.open();
      } catch (error) {
        console.error('Failed to open wallet:', error)
        await wallet.joinFederation(FEDERATION_INVITE);
      }
    };
    if (!wallet.isOpen()) openWallet();
  }, []);

  // WalletApp
  useEffect(() => {
    const handleSetup = async () => {
      await wallet.waitForOpen();
      wallet.balance.subscribeBalance((bal) => {
        // Msats to sats
        setBalance(bal * 0.001);
      });
    };

    handleSetup();
  }, []);

  const handleOpenSend = () => {
    setInvoice('')
    setActiveModal('send')
  }

  const handleOpenReceive = () => {
    setAmount('')
    setActiveModal('receive')
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setGeneratedInvoice('')
    setInvoice('')
    setAmount('')
  }

  const handleSendSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle send logic here
    console.log('Sending invoice:', invoice)

    const result = await wallet.lightning.payInvoice(invoice);
    console.error("PAY RESULT", result)
    handleCloseModal()
  }



  const handleReceiveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle receive logic here
    console.log('Receiving amount:', amount)
    e.preventDefault();
    const amountSats = parseInt(amount);

    const invoice = await wallet.lightning.createInvoice(
      amountSats * 1000,
      "Fedimint SDK!!!"
    );
    setGeneratedInvoice(invoice.invoice);
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Wallet Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Wallet
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your balance
          </p>
          
          {/* Balance Display */}
          <div className="mb-8">
            <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
              {balance.toFixed(0)} sats
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleOpenSend}
              onKeyDown={(e) => handleKeyDown(e, handleOpenSend)}
              className="flex-1 bg-slate-900 dark:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label="Send payment"
              tabIndex={0}
            >
              Send
            </button>
            <button
              onClick={handleOpenReceive}
              onKeyDown={(e) => handleKeyDown(e, handleOpenReceive)}
              className="flex-1 bg-slate-900 dark:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label="Receive payment"
              tabIndex={0}
            >
              Receive
            </button>
          </div>
        </div>

        {/* Send Modal */}
        {activeModal === 'send' && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-modal-title"
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="send-modal-title"
                className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
              >
                Send Payment
              </h2>
              <form onSubmit={handleSendSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="invoice"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Invoice
                  </label>
                  <input
                    id="invoice"
                    type="text"
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter invoice"
                    required
                    autoFocus
                    aria-label="Invoice input"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 dark:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    aria-label="Send payment"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receive Modal */}
        {activeModal === 'receive' && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="receive-modal-title"
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="receive-modal-title"
                className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
              >
                Receive Payment
              </h2>
              <form onSubmit={handleReceiveSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                    autoFocus
                    aria-label="Amount input"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 dark:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    aria-label="Receive payment"
                  >
                    Receive
                  </button>
                </div>
                {generatedInvoice && (
                  <div className="mb-4">
                    <label
                      htmlFor="generatedInvoice"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Generated Invoice: <br />
                      <textarea
                        id="generatedInvoice"
                        value={generatedInvoice}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        readOnly
                      />
                    </label>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
