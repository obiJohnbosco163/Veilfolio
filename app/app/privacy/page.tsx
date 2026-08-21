'use client';

import { WalletBar } from '@/components/WalletBar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <WalletBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">Privacy Center</span>
          </h1>
          <p className="text-muted">Understanding how STRK20 protects your activity</p>
        </div>

        {/* Banner */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 sm:p-6 mb-10 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(124,92,252,0.2))' }}>
              <svg className="w-4.5 h-4.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-semibold mb-1">Privacy is a design choice, not a guarantee</p>
              <p className="text-sm text-muted">Veilfolio uses STRK20 to enable privacy-aware execution contexts.</p>
            </div>
          </div>
        </div>

        {/* What STRK20 Protects */}
        <section className="mb-12 animate-fade-in-up">
          <h2 className="text-xl font-bold text-foreground mb-5">What STRK20 Protects</h2>
          <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
            <h3 className="font-semibold text-accent mb-3">Shielded Inside the Pool</h3>
            <ul className="text-sm text-muted space-y-2">
              {['Sender identity — Hidden from observers inside the pool', 'Recipient identity — Private transfer destinations are not exposed', 'Transaction amounts — Shielded within the privacy pool', 'Token information — Hidden for transfers within the pool', 'Transaction details — Private to other users and observers'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-accent shrink-0">+</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* What Remains Public */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-5">What Remains Public</h2>
          <div className="p-6 bg-warning/5 border border-warning/20 rounded-xl">
            <h3 className="font-semibold text-warning mb-3">Public on the Blockchain</h3>
            <ul className="text-sm text-muted space-y-2">
              {['Deposit transactions — ERC-20 transfer from wallet to STRK20 pool is public', 'Withdrawal transactions — ERC-20 transfer from pool to wallet is public', 'Deposit amounts — Funding transactions show public amounts', 'Block-level metadata — Timing and ordering correlations are possible', 'Network metadata — IP addresses and node-level information'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-warning shrink-0">!</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Privacy Model */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-5">Understanding the Privacy Model</h2>
          <div className="space-y-4">
            {[
              { title: 'Entry and Exit', content: (
                <>
                  <p className="text-muted text-sm mb-4">When you fund an execution identity:</p>
                  <div className="bg-surface p-4 rounded-xl text-xs font-mono text-muted space-y-1 border border-card-border">
                    <p>WALLET &rarr; STRK20 POOL <span className="text-warning">(PUBLIC)</span></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr; (funds enter pool)</p>
                    <p>POOL &rarr; EXECUTION CONTEXT <span className="text-accent">(SHIELDED)</span></p>
                  </div>
                </>
              )},
              { title: 'Private Operations', content: (
                <>
                  <p className="text-muted text-sm mb-4">Once funded, your identity can:</p>
                  <ul className="text-sm text-muted space-y-2">
                    {['Send private transfers to other STRK20-shielded recipients', 'Interact with private DeFi (where supported)', 'Execute proof-backed privacy transactions', 'Maintain separate strategy activity from other identities'].map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="text-accent shrink-0">+</span><span>{t}</span></li>
                    ))}
                  </ul>
                </>
              )},
              { title: 'Withdrawal', content: (
                <>
                  <p className="text-muted text-sm mb-4">When you withdraw from an identity:</p>
                  <div className="bg-surface p-4 rounded-xl text-xs font-mono text-muted space-y-1 border border-card-border">
                    <p>CONTEXT &rarr; STRK20 POOL <span className="text-accent">(UNSHIELD)</span></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr; (funds exit pool)</p>
                    <p>POOL &rarr; WALLET <span className="text-warning">(PUBLIC)</span></p>
                  </div>
                </>
              )},
            ].map((item) => (
              <div key={item.title} className="p-6 bg-card border border-card-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                {item.content}
              </div>
            ))}
          </div>
        </section>

        {/* Storage */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-5">What Veilfolio Stores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-3">Stored Locally (In Your Browser)</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Execution identity configuration', 'Your portfolio organization', 'Transaction history (your local record)', 'Account preferences'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent shrink-0">+</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-3">We NEVER Store Server-Side</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Private keys', 'Viewing keys or proving secrets', 'Raw note data', 'Wallet recovery information', 'Secret seed phrases'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-danger shrink-0">-</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-5">Privacy Limitations</h2>
          <div className="p-6 bg-danger/5 border border-danger/20 rounded-xl">
            <h3 className="font-semibold text-danger mb-3">What Veilfolio Cannot Protect Against</h3>
            <ul className="text-sm text-muted space-y-2">
              {['Wallet compromise — All execution contexts are exposed', 'Browser compromise — Malware can observe your activities', 'User-initiated linking — Voluntarily connecting identities', 'Timing analysis — Sophisticated observers may correlate transactions', 'IP-level tracking — Network metadata can be observed', 'ERC-20 deposit/withdrawal correlation — Public blockchain links'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-danger shrink-0">-</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Future */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-5">Future Improvements</h2>
          <div className="p-6 bg-accent-secondary/5 border border-accent-secondary/20 rounded-xl">
            <h3 className="font-semibold text-accent-secondary mb-3">Native STRK20 Private Sub-Accounts</h3>
            <ul className="text-sm text-muted space-y-2">
              {['Protocol-level private sub-account management', 'Deeper separation of execution contexts', 'Reduced deposit/withdrawal correlation risk', 'Improved privacy without changing your experience'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-accent-secondary shrink-0">+</span>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
