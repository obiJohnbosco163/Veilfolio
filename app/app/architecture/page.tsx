'use client';

import { WalletBar } from '@/components/WalletBar';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WalletBar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Architecture</h1>
            <p className="text-lg text-gray-600">
              How Veilfolio organizes privacy-aware portfolio management across 5 layers
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="space-y-1 font-mono text-sm text-gray-700 whitespace-pre">
              {`
┌─────────────────────────────────────────────────────────────┐
│                        USER DASHBOARD                        │
│              (Unified Portfolio View)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│           PORTFOLIO AGGREGATION ENGINE (LAYER 4)             │
│  • Total Balance Calculation                                │
│  • Allocation Tracking (%)                                  │
│  • PnL Accounting (Realized + Unrealized)                   │
│  • Risk Scoring (Portfolio + Identity Level)                │
│  • Activity History & Filtering                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│       EXECUTION IDENTITY MANAGER (LAYER 3)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  TRADING ID  │  │   DEFI ID    │  │   YIELD ID   │  ...   │
│  │  (Private)   │  │   (Private)  │  │  (Private)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  • Metadata (name, type, purpose)                           │
│  • Shielded balance management                              │
│  • Privacy status tracking                                  │
│  • Activity logging (local)                                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│         STRK20 PRIVACY LAYER (LAYER 2)                       │
│  • Privacy Wallet API (Standard Operations)                 │
│  • Shield / Fund Operations                                 │
│  • Private Transfers (Inside Pool)                          │
│  • Private DeFi (Via privacy_invoke)                        │
│  • Unshield / Withdraw Operations                           │
│  • Proof-Backed Privacy Transactions                        │
│  • Note Discovery & Synchronization                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                  STARKNET WALLETS (LAYER 1)                  │
│              (Argent, Braavos, Custom)                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌──────────────────┐  ┌──────────────────┐
            │  STRK20 POOL     │  │ STARKNET NETWORK │
            │  (Mainnet)       │  │  (L2 Blockchain) │
            └──────────────────┘  └──────────────────┘
              `}
            </div>
          </div>

          {/* Layer 1: User Wallet */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layer 1: User Wallet</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <p className="text-gray-700">
                Veilfolio uses <strong>existing Starknet wallets</strong> rather than forcing custom wallet adoption.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Supports Argent, Braavos, and other standard Starknet wallets</li>
                <li>✓ Uses official Starknet wallet connection APIs</li>
                <li>✓ User controls private keys (never shared with our servers)</li>
                <li>✓ Wallet continues to work for all other Starknet dapps</li>
              </ul>
            </div>
          </section>

          {/* Layer 2: STRK20 Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layer 2: STRK20 Privacy Layer</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <p className="text-gray-700">
                The STRK20 privacy pool handles shielding, private transfers, and unshielding operations.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy Wallet API (Primary)</h4>
                  <p className="text-sm text-gray-700">
                    Standard application-level integration for wallet-initiated privacy operations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy SDK (Secondary)</h4>
                  <p className="text-sm text-gray-700">
                    Lower-level API used only when Privacy Wallet API is insufficient (e.g., for direct proving or custom note management).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Anonymizer Contracts (Optional)</h4>
                  <p className="text-sm text-gray-700">
                    Minimal Cairo contracts implementing privacy_invoke pattern for private DeFi execution.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Layer 3: Execution Identity Manager */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layer 3: Execution Identity Manager</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <p className="text-gray-700">
                The core innovation: Portfolio bucket abstraction that separates strategy, venue, and execution contexts.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">Execution Identity</h4>
                  <p className="text-sm text-gray-700 mb-2">A privacy-aware portfolio bucket with:</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Unique identifier (UUID)</li>
                    <li>• Type (Trading, DeFi, Yield, Long-Term, App, Venue, Strategy, Custom)</li>
                    <li>• Name and purpose (user-assigned)</li>
                    <li>• Shielded balance (from STRK20)</li>
                    <li>• Allocation % (calculated at portfolio level)</li>
                    <li>• PnL tracking (local calculation)</li>
                    <li>• Privacy status (Shielded, Funding, Active, Inactive)</li>
                    <li>• Activity history (local record only)</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Critical:</strong> Identity mappings are stored locally in your browser. We do not maintain a public on-chain registry linking identities to your wallet address (privacy risk).
              </p>
            </div>
          </section>

          {/* Layer 4: Portfolio Aggregation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layer 4: Portfolio Aggregation Engine</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <p className="text-gray-700">
                Aggregates execution identity data into unified portfolio view.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">Calculations</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>Total Balance</strong> = Sum of all identity balances</li>
                    <li>• <strong>Allocation</strong> = (Identity Balance / Total Balance) × 100</li>
                    <li>• <strong>Portfolio PnL</strong> = Weighted average PnL across identities</li>
                    <li>• <strong>Risk Score</strong> = Concentration + volatility + exposure analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Layer 5: Mainnet Execution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layer 5: Mainnet Execution</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-4">
              <p className="text-gray-700">
                All operations execute against the live STRK20 pool on Starknet mainnet.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Real STRK20 pool interaction</li>
                <li>✓ Real transaction execution</li>
                <li>✓ Verifiable on-chain via Starknet Explorer</li>
                <li>✓ No fake or simulated operations</li>
              </ul>
            </div>
          </section>

          {/* Data Flow */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Data Flow: Funding an Execution Identity</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="space-y-3 font-mono text-sm text-gray-700">
                <p>User Selects "Fund Identity" on Dashboard</p>
                <p>         ↓</p>
                <p>Execution Identity Manager Receives Request</p>
                <p>         ↓</p>
                <p>Wallet Connection Initiates</p>
                <p>         ↓</p>
                <p>User Approves in Connected Wallet</p>
                <p>         ↓</p>
                <p>Privacy Wallet API Calls Shield Operation</p>
                <p>         ↓</p>
                <p>Funds Transferred: Wallet → STRK20 Pool (Public)</p>
                <p>         ↓</p>
                <p>Funds Received: STRK20 Pool → Private Note (Shielded)</p>
                <p>         ↓</p>
                <p>Identity Balance Updated in Portfolio Engine</p>
                <p>         ↓</p>
                <p>Dashboard Refreshes with New Allocation</p>
              </div>
            </div>
          </section>

          {/* Future Evolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Future Evolution: Native Private Sub-Accounts</h2>
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg space-y-4">
              <p className="text-purple-900">
                When STRK20 launches native private sub-account support, Layers 2 and 3 will evolve without requiring changes to Layers 1, 4, or 5:
              </p>
              <div className="bg-white p-4 rounded text-sm text-gray-700 space-y-2">
                <p>Layer 2 will upgrade from:</p>
                <p className="ml-4">Manual Privacy Wallet API ↓</p>
                <p className="ml-4">→ Native Protocol-Level Private Sub-Accounts</p>
                <p className="mt-2">Layer 3 will upgrade from:</p>
                <p className="ml-4">Client-Side Identity Abstraction ↓</p>
                <p className="ml-4">→ Protocol-Level Identity Support</p>
              </div>
              <p className="text-sm text-purple-900">
                This architecture ensures Veilfolio can evolve with Starknet's privacy infrastructure without forcing users to rebuild their portfolios or strategies.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
