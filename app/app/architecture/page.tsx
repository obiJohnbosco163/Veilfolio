'use client';

import { WalletBar } from '@/components/WalletBar';
import { AmbientBackground } from '@/components/AmbientBackground';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground pattern={false} />
      <WalletBar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">Architecture</span>
          </h1>
          <p className="text-muted">
            How Veilfolio organizes privacy-aware portfolio management across 5 layers — written, end to end, in Cairo.
          </p>
        </div>

        {/* Thesis banner */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 sm:p-6 mb-10 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(124,92,252,0.2))' }}>
              <svg className="w-4.5 h-4.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-semibold mb-1">Programs that prove themselves</p>
              <p className="text-sm text-muted">
                Every layer below runs on Starknet, whose STARK proof system is <em className="text-foreground">transparent, scalable and post-quantum secure</em> by design. Veilfolio&rsquo;s own contracts — the IdentityManager and the Anonymizer — are written in Cairo 2024_07, the language the <a href="https://www.starknet.io/cairo-book/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Cairo Book</a> describes as &ldquo;the language in which provable programs are written.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Layer 1: User Wallet */}
        <section className="mb-12 animate-fade-in-up reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Layer 1: User Wallet</h2>
          <p className="text-sm text-muted mb-5">The keys never leave your custody.</p>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-4">
            <p className="text-sm text-muted">
              Veilfolio uses <strong className="text-foreground">existing Starknet wallets</strong> rather than forcing custom wallet adoption.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Supports Argent, Braavos, and other standard Starknet wallets</li>
              <li>✓ Uses official Starknet wallet connection APIs</li>
              <li>✓ User controls private keys (never shared with our servers)</li>
              <li>✓ Wallet continues to work for all other Starknet dapps</li>
            </ul>
          </div>
        </section>

        {/* Layer 2: STRK20 Privacy */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Layer 2: STRK20 Privacy Layer</h2>
          <p className="text-sm text-muted mb-5">Zero-knowledge shielding, transfers and unshielding.</p>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-4">
            <p className="text-sm text-muted">
              The STRK20 privacy pool handles shielding, private transfers, and unshielding operations — each backed by a STARK proof that hides sender, recipient, amount and token, while the network verifies integrity.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Privacy Wallet API (Primary)</h4>
                <p className="text-sm text-muted">
                  Standard application-level integration for wallet-initiated privacy operations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Privacy SDK (Secondary)</h4>
                <p className="text-sm text-muted">
                  Lower-level API used only when the wallet API is insufficient (e.g., for direct proving or custom note management).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Anonymizer Contract (Cairo)</h4>
                <p className="text-sm text-muted">
                  A minimal Cairo contract implementing the <span className="font-mono text-xs bg-surface border border-card-border rounded px-1.5 py-0.5">privacy_invoke</span> pattern for private DeFi execution — deployed on Sepolia at 0x0066&hellip;b3.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 3: Execution Identity Manager */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Layer 3: Execution Identity Manager</h2>
          <p className="text-sm text-muted mb-5">The core innovation: portfolio buckets that separate strategy, venue and execution context.</p>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-4">
            <p className="text-sm text-muted">
              The IdentityManager Cairo contract is the on-chain registry that mints each execution identity. Its metadata lives client-side; the registry only tracks <em className="text-foreground">that an identity exists</em>, never what it does.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-surface border border-card-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Execution Identity</h4>
                <p className="text-sm text-muted mb-2">A privacy-aware portfolio bucket with:</p>
                <ul className="text-sm text-muted space-y-1 ml-4">
                  <li>• Unique on-chain identity ID (from the Cairo contract)</li>
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
            <p className="text-sm text-muted">
              <strong className="text-warning">Critical:</strong> Identity mappings are stored locally in your browser. We do not maintain a public on-chain registry linking identities to your wallet address — that linkage would be a privacy leak.
            </p>
          </div>
        </section>

        {/* Layer 4: Portfolio Aggregation */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Layer 4: Portfolio Aggregation Engine</h2>
          <p className="text-sm text-muted mb-5">One unified view across private buckets.</p>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-surface border border-card-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Calculations</h4>
                <ul className="text-sm text-muted space-y-1 ml-4">
                  <li>• <strong className="text-foreground">Total Balance</strong> = Sum of all identity balances</li>
                  <li>• <strong className="text-foreground">Allocation</strong> = (Identity Balance / Total Balance) × 100</li>
                  <li>• <strong className="text-foreground">Portfolio PnL</strong> = Weighted average PnL across identities</li>
                  <li>• <strong className="text-foreground">Risk Score</strong> = Concentration + volatility + exposure analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 5: Mainnet Execution */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Layer 5: Mainnet Execution</h2>
          <p className="text-sm text-muted mb-5">Real operations, real proofs, real transactions.</p>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-4">
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Real STRK20 pool interaction</li>
              <li>✓ Real transaction execution, verifiable on <a href="https://voyager.online" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Voyager</a></li>
              <li>✓ No fake or simulated operations</li>
            </ul>
          </div>
        </section>

        {/* Under the hood: STARKs, Cairo, Post-quantum */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Under the Hood: STARKs, Cairo &amp; Post-Quantum Security</h2>
          <div className="space-y-4">
            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Written in the language designed for proofs</h3>
              <p className="text-sm text-muted leading-relaxed">
                The IdentityManager and the Anonymizer are written in <strong className="text-foreground">Cairo 2024_07</strong> — the direct descendant of the CPU architecture StarkWare introduced in <a href="https://eprint.iacr.org/2021/1063" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Cairo: A Turing-Complete STARK-Friendly CPU Architecture</a> (ePrint 2021/1063). Cairo is not a language compiled to proofs as an afterthought: it <em className="text-foreground">is</em> the program, and the program is the proof. The <a href="https://www.starknet.io/cairo-book/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Cairo Book</a> opens with the integrity the language is built around:
              </p>
              <blockquote className="border-l-2 border-accent pl-4 mt-3 text-sm text-muted italic leading-relaxed">
                &ldquo;C.S. Lewis said, &lsquo;Integrity is doing the right thing, even when no one is watching.&rsquo; Cairo is the crypto-community&rsquo;s answer to this: a language that lets you prove, with certainty, you did the right thing.&rdquo;
                <footer className="not-italic text-xs text-accent mt-2 font-semibold">— The Cairo Book</footer>
              </blockquote>
            </div>

            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Polylog verification: privacy proofs that scale</h3>
              <p className="text-sm text-muted leading-relaxed">
                STARK proofs verify in <em className="text-foreground">polylogarithmic time</em> — confirming a computation bigger than the entire Starknet block history takes barely more work than a single transaction. That is what lets STRK20 verify a privacy proof for every pool operation without a trusted setup: the 2018 paper by Ben-Sasson, Bentov, Horesh &amp; Riabzev (<a href="https://eprint.iacr.org/2018/046" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">ePrint 2018/046</a>) is titled <em className="text-foreground">Scalable, Transparent, and Post-Quantum Secure Computational Integrity</em> — the three properties, declared up front.
              </p>
            </div>

            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Post-quantum by architecture, not by bolt-on</h3>
              <p className="text-sm text-muted leading-relaxed">
                Most chains rest on elliptic-curve cryptography, which a sufficiently powerful quantum computer would break with Shor&rsquo;s algorithm — an <em className="text-foreground">exponential</em> speedup. STARKs use only hash functions, which a quantum computer attacks with at best a <em className="text-foreground">quadratic</em> speedup (Grover&rsquo;s). That is structural: the proving layer runs on post-quantum-secure assumptions. StarkWare&rsquo;s roadmap is already replacing Pedersen hashes and signatures with post-quantum primitives — Ben-Sasson compares the migration to &ldquo;changing an airplane&rsquo;s engine mid-flight.&rdquo;
              </p>
              <p className="text-sm text-muted mt-3 leading-relaxed">
                For Veilfolio this means your identities and shielded notes inherit a post-quantum posture at the layer that matters most. As on every Ethereum L2, the last-mile L1 deposit still signs with ECDSA today — an industry-wide migration we track closely.
              </p>
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-2">Core Data Flow: Funding an Execution Identity</h2>
          <p className="text-sm text-muted mb-5">Wallet → pool (public) → private note (shielded).</p>
          <div className="p-6 bg-card border border-card-border rounded-xl">
            <div className="space-y-3 font-mono text-sm text-muted overflow-x-auto">
              <p>User Selects &ldquo;Fund Identity&rdquo; on Dashboard</p>
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
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Future Evolution: Native Private Sub-Accounts</h2>
          <div className="p-6 rounded-xl space-y-4 border border-accent-secondary/30" style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(0,212,170,0.05))' }}>
            <p className="text-sm text-foreground">
              When STRK20 launches native private sub-account support, Layers 2 and 3 evolve without requiring changes to Layers 1, 4, or 5:
            </p>
            <div className="bg-card p-4 rounded-lg text-sm text-muted space-y-2 border border-card-border">
              <p>Layer 2 will upgrade from:</p>
              <p className="ml-4">Manual Privacy Wallet API ↓</p>
              <p className="ml-4 text-accent">→ Native Protocol-Level Private Sub-Accounts</p>
              <p className="mt-2">Layer 3 will upgrade from:</p>
              <p className="ml-4">Client-Side Identity Abstraction ↓</p>
              <p className="ml-4 text-accent">→ Protocol-Level Identity Support</p>
            </div>
            <p className="text-sm text-muted">
              This architecture lets Veilfolio evolve with Starknet&rsquo;s privacy infrastructure—including institutional privacy via EY&rsquo;s Nightfall integration — without forcing users to rebuild their portfolios or strategies.
            </p>
          </div>
        </section>

        {/* Footer note */}
        <div className="p-5 bg-surface border border-card-border rounded-xl animate-fade-in-up">
          <p className="text-sm text-muted">
            <strong className="text-foreground">Deeper dive:</strong> the math, the founder&rsquo;s vision and the quantum-resistance roadmap in full — with sources — live in the{' '}
            <a href="/privacy" className="text-accent hover:underline">Privacy Center</a>.
          </p>
        </div>
      </main>
    </div>
  );
}