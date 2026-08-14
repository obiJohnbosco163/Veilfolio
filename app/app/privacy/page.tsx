'use client';

import { WalletBar } from '@/components/WalletBar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WalletBar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Center</h1>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
            <p className="text-gray-900 font-semibold mb-2">
              🔒 Privacy is a design choice, not a guarantee
            </p>
            <p className="text-gray-700 text-sm">
              Veilfolio uses STRK20 to enable privacy-aware execution contexts. This page explains exactly what is and isn't protected.
            </p>
          </div>

          {/* What STRK20 Protects */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What STRK20 Protects</h2>

            <div className="space-y-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">✓ Shielded Inside the Pool</h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• <strong>Sender identity</strong> — Hidden from observers inside the pool</li>
                  <li>• <strong>Recipient identity</strong> — Private transfer destinations are not exposed</li>
                  <li>• <strong>Transaction amounts</strong> — Shielded within the privacy pool</li>
                  <li>• <strong>Token information</strong> — Hidden for transfers within the pool</li>
                  <li>• <strong>Transaction details</strong> — Private to other users and observers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What Remains Public */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Remains Public</h2>

            <div className="space-y-4">
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-3">! Public on the Blockchain</h3>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• <strong>Deposit transactions</strong> — ERC-20 transfer from wallet to STRK20 pool is public</li>
                  <li>• <strong>Withdrawal transactions</strong> — ERC-20 transfer from pool to wallet is public</li>
                  <li>• <strong>Deposit amounts</strong> — Funding transactions show public amounts</li>
                  <li>• <strong>Block-level metadata</strong> — Timing and ordering correlations are possible</li>
                  <li>• <strong>Network metadata</strong> — IP addresses and node-level information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* The Privacy Model */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding the Privacy Model</h2>

            <div className="space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Entry and Exit</h3>
                <p className="text-gray-700 text-sm mb-4">
                  When you fund an execution identity, two things happen:
                </p>
                <div className="bg-gray-50 p-4 rounded text-sm font-mono text-gray-700 space-y-1">
                  <p>WALLET → STRK20 POOL (PUBLIC ERC-20 TRANSFER)</p>
                  <p>         ↓ (funds enter pool)</p>
                  <p>POOL → PRIVATE EXECUTION CONTEXT (SHIELDED)</p>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Your wallet's deposit to the pool is visible on the public blockchain. Once inside the pool, your execution context's balance is shielded.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Private Operations</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Once funded, your execution identity can:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✓ Send <strong>private transfers</strong> to other STRK20-shielded recipients</li>
                  <li>✓ Interact with <strong>private DeFi</strong> (where supported by STRK20)</li>
                  <li>✓ Execute <strong>proof-backed</strong> privacy transactions</li>
                  <li>✓ Maintain <strong>separate strategy activity</strong> from other identities</li>
                </ul>
                <p className="text-gray-600 text-sm mt-4">
                  These operations remain private inside the pool. External observers cannot easily link them to your wallet.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Withdrawal</h3>
                <p className="text-gray-700 text-sm mb-4">
                  When you withdraw from an execution identity:
                </p>
                <div className="bg-gray-50 p-4 rounded text-sm font-mono text-gray-700 space-y-1">
                  <p>PRIVATE CONTEXT → STRK20 POOL (UNSHIELD, SHIELDED)</p>
                  <p>              ↓ (funds exit pool)</p>
                  <p>POOL → WALLET (PUBLIC ERC-20 TRANSFER)</p>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Your withdrawal back to your wallet is public. An observer could potentially link multiple execution contexts to your wallet by analyzing withdrawal transactions.
                </p>
              </div>
            </div>
          </section>

          {/* What This Application Stores */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Veilfolio Stores</h2>

            <div className="space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Stored Locally (In Your Browser)</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Execution identity configuration (names, types, purposes)</li>
                  <li>• Your portfolio organization (which identities you use)</li>
                  <li>• Transaction history (your local record)</li>
                  <li>• Account preferences</li>
                </ul>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">We NEVER Store Server-Side</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Private keys</li>
                  <li>• Viewing keys or proving secrets</li>
                  <li>• Raw note data</li>
                  <li>• Wallet recovery information</li>
                  <li>• Secret seed phrases</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Limitations</h2>

            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-4">What Veilfolio Cannot Protect Against</h3>
              <ul className="text-sm text-red-800 space-y-2">
                <li>• <strong>Wallet compromise</strong> — If your wallet is compromised, all execution contexts are exposed</li>
                <li>• <strong>Browser compromise</strong> — Malware or malicious extensions can observe your activities</li>
                <li>• <strong>User-initiated linking</strong> — If you voluntarily connect identities or disclose information</li>
                <li>• <strong>Timing analysis</strong> — Sophisticated observers may correlate transactions by timing</li>
                <li>• <strong>IP-level tracking</strong> — Network metadata can be observed by ISPs and sophisticated adversaries</li>
                <li>• <strong>ERC-20 deposit/withdrawal correlation</strong> — Public blockchain deposits/withdrawals can still be linked to your wallet</li>
              </ul>
            </div>
          </section>

          {/* Future Improvements */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Future Improvements</h2>

            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-4">Native STRK20 Private Sub-Accounts</h3>
              <p className="text-sm text-purple-800 mb-3">
                When native STRK20 private sub-account support launches, Veilfolio will be able to offer:
              </p>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>• Protocol-level private sub-account management</li>
                <li>• Deeper separation of execution contexts</li>
                <li>• Reduced ERC-20 deposit/withdrawal correlation risk</li>
                <li>• Improved privacy without changing your experience</li>
              </ul>
            </div>
          </section>

          {/* Questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Have Questions?</h2>
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-4">
                For more technical details, see:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <a href="https://github.com/veilfolio" className="underline">Veilfolio GitHub</a> — Full documentation and source code</li>
                <li>• <a href="#" className="underline">Threat Model</a> — Detailed security analysis</li>
                <li>• <a href="https://strk20.io" className="underline">STRK20 Documentation</a> — Official privacy pool docs</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
