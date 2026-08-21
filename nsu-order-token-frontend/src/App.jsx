import { useState } from 'react'
import { useOrders } from './hooks/useOrders.js'
import { useTokenLookup } from './hooks/useTokenLookup.js'
import OrderConfirmation from './components/OrderConfirmation.jsx'
import OrderHistoryList from './components/OrderHistoryList.jsx'
import TokenLookup from './components/TokenLookup.jsx'
import SimulateOrderForm from './components/SimulateOrderForm.jsx'

const TABS = [
  { id: 'confirm', label: 'Order confirmation' },
  { id: 'history', label: 'Order history' },
  { id: 'vendor', label: 'Vendor lookup' },
]

export default function App() {
  const { orders, status, placeOrder, lastConfirmedOrder } = useOrders()
  const lookup = useTokenLookup()
  const [tab, setTab] = useState('confirm')

  return (
    <div className="min-h-screen bg-paper pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <p className="stamp text-xs uppercase tracking-wider text-teal">
            NSU Companion · Pickup Tokens
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            Order Token Generation
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            FR-5.1–5.3 · generated on payment confirmation, shown to the
            student, and looked up by vendors at pickup
          </p>
        </div>
      </header>

      <nav className="mx-auto flex max-w-3xl gap-1 px-4 pt-5 sm:px-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-teal text-white'
                : 'text-ink/60 hover:bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        {tab === 'confirm' && (
          <div className="space-y-6">
            <SimulateOrderForm onConfirm={placeOrder} />
            {lastConfirmedOrder ? (
              <OrderConfirmation order={lastConfirmedOrder} />
            ) : (
              <p className="text-center text-sm text-ink/40">
                Confirm a demo order above to see the generated token.
              </p>
            )}
          </div>
        )}

        {tab === 'history' && (
          <OrderHistoryList orders={orders} status={status} />
        )}

        {tab === 'vendor' && <TokenLookup {...lookup} />}
      </main>
    </div>
  )
}
