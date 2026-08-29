'use client';

import { WalletBar } from '@/components/WalletBar';
import { AmbientBackground } from '@/components/AmbientBackground';

const SOURCES = [
  {
    title: 'The Cairo Book — The Cairo Programming Language',
    desc: 'The official, community-maintained book on Cairo, the language for writing provable programs.',
    url: 'https://www.starknet.io/cairo-book/',
  },
  {
    title: 'Cairo: A Turing-Complete STARK-Friendly CPU Architecture',
    desc: 'The original Cairo whitepaper (ePrint 2021/1063) by StarkWare.',
    url: 'https://eprint.iacr.org/2021/1063',
  },
  {
    title: 'Scalable, Transparent, and Post-Quantum Secure Computational Integrity',
    desc: 'The 2018 paper by Ben-Sasson, Bentov, Horesh & Riabzev that introduced STARKs (ePrint 2018/046).',
    url: 'https://eprint.iacr.org/2018/046',
  },
  {
    title: 'StarkWare integrates EY-built Nightfall privacy tech into Starknet',
    desc: 'The Block — confidential institutional transactions, private by default with selective disclosure.',
    url: 'https://www.theblock.co/post/390129/starkware-integrates-ey-built-nightfall-privacy-tech-into-starknet-to-provide-confidential-institutional-transactions-on-public-blockchains',
  },
  {
    title: 'StarkWare CEO blasts crypto complacency in quantum threat — Cointelegraph',
    desc: 'StarkWare\u2019s three-step quantum-resistant roadmap for Starknet (June 2026).',
    url: 'https://cointelegraph.com/news/starkware-ceo-blasts-crypto-complacency-in-quantum-threat-elliptic-illusion',
  },
  {
    title: 'StarkWare CEO advocates for privacy and post-quantum security',
    desc: 'CryptoBriefing — why privacy and quantum resistance belong in day-one design.',
    url: 'https://cryptobriefing.com/starkware-privacy-post-quantum-security/',
  },
  {
    title: 'Where Privacy meets Bitcoin, Zcash & NEAR',
    desc: 'Starknet blog — long-form conversation with Eli Ben-Sasson on privacy, STARKs and post-quantum security.',
    url: 'https://www.starknet.io/blog/where-privacy-meets-bitcoin-zcash-near/',
  },
  {
    title: 'The Power and Potential of Zero-Knowledge Proofs — Communications of the ACM',
    desc: '"Blockchain and ZKPs are two technologies that innovate on integrity." — Eli Ben-Sasson.',
    url: 'https://cacm.acm.org/news/the-power-and-potential-of-zero-knowledge-proofs',
  },
  {
    title: 'Zcash co-founder: The world is demanding more privacy — The Block',
    desc: 'Eli Ben-Sasson on privacy payments and integrity on public blockchains.',
    url: 'https://www.theblock.co/post/378549/zcash-co-founder-the-world-is-demanding-more-privacy',
  },
  {
    title: 'Eli Ben-Sasson (@EliBenSasson) on X',
    desc: 'Co-founder & CEO of StarkWare, co-founder of Zcash, co-inventor of ZK-STARKs.',
    url: 'https://x.com/EliBenSasson',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground pattern={false} />
      <WalletBar />
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">Privacy Center</span>
          </h1>
          <p className="text-muted">The cryptography, the science, and the vision behind STRK20 — and why it matters for your portfolio</p>
        </div>

        {/* Thesis banner */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 sm:p-6 mb-10 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(124,92,252,0.2))' }}>
              <svg className="w-4.5 h-4.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-semibold mb-1">Privacy is a design choice, not a guarantee</p>
              <p className="text-sm text-muted">Veilfolio uses STRK20 to give each execution context its own veil of privacy — while the Starknet layer beneath it was designed by the people who invented modern zero-knowledge proofs.</p>
            </div>
          </div>
        </div>

        {/* The Vision: founder section */}
        <section className="mb-12 animate-fade-in-up reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">The Vision Behind the Layer</h2>
          <div className="p-6 bg-card border border-card-border rounded-xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(0,212,170,0.1))' }}>
                <svg className="w-5 h-5 text-accent-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Starknet was built by the co-founder of Zcash</p>
                <p className="text-sm text-muted leading-relaxed">
                  <a
                    href="https://x.com/EliBenSasson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Eli Ben-Sasson
                  </a>{' '}
                  — a proof theorist trained at the Hebrew University, MIT, Harvard and Princeton — co-founded Zcash, the first major privacy coin, before founding StarkWare and co-inventing the STARK proof system that Starknet runs on. His life's work: <em className="text-foreground">using brilliant math to reconcile personal privacy with institutional integrity.</em>
                </p>
              </div>
            </div>

            <blockquote className="border-l-2 border-accent pl-4 text-sm text-muted italic leading-relaxed">
              &ldquo;Public-by-default was a design shortcut, not a design goal. Traders shouldn&rsquo;t have to publish their entire strategy or
              compromise their right for anonymity just because they want to participate in a market.&rdquo;
              <footer className="not-italic text-xs text-accent mt-2 font-semibold">— Eli Ben-Sasson (@EliBenSasson)</footer>
            </blockquote>

            <p className="text-sm text-muted leading-relaxed">
              Veilfolio is the practical expression of that position: isolate your trading, DeFi and long-term holdings into separate private identities, and stop publishing your strategy by default.
            </p>
          </div>
        </section>

        {/* The Math */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">The Math of Privacy: STARK Proofs</h2>
          <div className="space-y-4">
            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-3">Zero-knowledge proofs, without trust</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                A zero-knowledge proof lets you convince an on-chain verifier that a statement is true <em className="text-foreground">without revealing what the statement is about</em>. STARKs — <strong className="text-foreground">S</strong>calable <strong className="text-foreground">T</strong>ransparent <strong className="text-foreground">AR</strong>guments of <strong className="text-foreground">K</strong>nowledge — are the generation of proofs Ben-Sasson and colleagues introduced in 2018. They were deliberately designed with four properties:
              </p>
              <ul className="text-sm text-muted space-y-2">
                {[
                  ['Transparency', 'No trusted setup. No secret "toxic waste" parameters that could be exploited. Public randomness only.'],
                  ['Post-quantum assumptions', 'Built on collision-resistant hash functions, not elliptic-curve pairings.'],
                  ['Scalability', 'Proofs verify in polylogarithmic time — a fraction of the cost of re-running the computation.'],
                  ['Soundness', 'The math behind them, called FRI, let Starknet compress months of transactions into one proof that settles on Ethereum.'],
                ].map(([t, d], i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-accent shrink-0 font-semibold">+</span>
                    <span><strong className="text-foreground font-semibold">{t}.</strong> {d}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted leading-relaxed mt-4">
                In the words of the 2018 paper that started it all: <em className="text-foreground">&ldquo;Human dignity demands that personal information be hidden from the public — but veils of secrecy designed to preserve privacy may also be abused.&rdquo;</em> ZK proofs enforce one without conceding the other.
              </p>
            </div>

            <div className="p-6 bg-card border border-card-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-3">Where the graph happens</h3>
              <div className="bg-surface p-4 rounded-xl text-xs font-mono text-muted space-y-1 border border-card-border">
                <p>WALLET &rarr; STRK20 POOL <span className="text-warning">(PUBLIC DEPOSIT)</span></p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr; (funds become shielded notes)</p>
                <p>POOL &rarr; PRIVATE OPS <span className="text-accent">(ZK-PROVEN, UNLINKABLE)</span></p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr; (proof &gt; trust)</p>
                <p>POOL &rarr; WALLET <span className="text-warning">(PUBLIC WITHDRAWAL)</span></p>
              </div>
              <p className="text-sm text-muted leading-relaxed mt-4">
                Every shielded balance and private transfer you see in Veilfolio is a set of cryptographic notes and nullifiers, validated on Starknet by STARK-proof-backed transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Post-quantum */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Post-Quantum Security: Built-In, Not Bolted On</h2>
          <div className="p-6 bg-accent-secondary/5 border border-accent-secondary/20 rounded-xl space-y-4">
            <h3 className="font-semibold text-accent-secondary mb-1">Why quantum computers threaten most chains</h3>
            <p className="text-sm text-muted leading-relaxed">
              Most blockchains secure their signatures and proofs with <strong className="text-foreground">elliptic-curve cryptography</strong>. Shor&rsquo;s algorithm — the kind of program a sufficiently large quantum computer would run — can break elliptic-curve and pairing-based schemes outright. That is why StarkWare&rsquo;s CEO calls the industry&rsquo;s inaction &ldquo;ironic for an industry born from rejecting legacy systems&rdquo;: the quantum-resistant tools have existed for decades.
            </p>
            <h3 className="font-semibold text-accent-secondary mb-1">Where Starknet already holds</h3>
            <p className="text-sm text-muted leading-relaxed">
              STARKs run on <strong className="text-foreground">hash functions</strong>, not elliptic curves. Quantum computers can attack hashes only with a quadratic speedup (Grover&rsquo;s), which is far from the exponential break that Shor&rsquo;s delivers on curves. This is <em className="text-foreground">structural</em>: the proving layer runs on post-quantum-secure assumptions, which is why cryptography researchers describe STARKs as &ldquo;the most scalable, safe, and secure post-quantum cryptography.&rdquo;
            </p>
            <h3 className="font-semibold text-accent-secondary mb-1">The roadmap to hardening</h3>
            <p className="text-sm text-muted leading-relaxed">
              StarkWare published a three-step quantum-resistance roadmap for Starknet (June 2026): first, replace the Pedersen hash with a quantum-resistant hash and add quantum-resistant signatures; second, build migration tools so existing contracts move automatically; third, coordinate the parts that depend on Ethereum&rsquo;s own upgrade path. Ben-Sasson is blunt about timing: switching a live chain is like &ldquo;replacing an airplane&rsquo;s engine mid-flight&rdquo; — you start planning long before the threat arrives.
            </p>
            <div className="flex items-start gap-3 rounded-lg p-3 bg-accent-secondary/10 border border-accent-secondary/20">
              <svg className="w-4 h-4 text-accent-secondary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <p className="text-xs text-muted">
                For Veilfolio this means your identities, shielded notes and privacy operations inherit a post-quantum posture at the layer that matters most. Like every Ethereum L2, the last-mile deposit from L1 still signs with ECDSA today — the industry-wide migration we are actively tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Cairo */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Cairo: Programs That Prove Themselves</h2>
          <div className="p-6 bg-card border border-card-border rounded-xl">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Starknet's smart contracts are written in <strong className="text-foreground">Cairo</strong> — a language built by StarkWare specifically so that programs can generate a STARK proof of their own execution. The <a href="https://www.starknet.io/cairo-book/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Cairo Book</a> puts it elegantly:
            </p>
            <blockquote className="border-l-2 border-accent pl-4 text-sm text-muted italic leading-relaxed">
              &ldquo;Just as C.S. Lewis defined integrity as <em className="text-foreground">doing the right thing, even when no one is watching</em>, Cairo enables programs to prove they&rsquo;ve done the right computation, even when executed on untrusted machines.&rdquo;
              <footer className="not-italic text-xs text-accent mt-2 font-semibold">— The Cairo Book</footer>
            </blockquote>
            <p className="text-sm text-muted leading-relaxed mt-4">
              Veilfolio's smart contracts — the IdentityManager and the Anonymizer — are written in Cairo 2024_07 and deployed on Sepolia. Your identity records, their activation state and your shielded operations are all provable programs in that language.
            </p>
          </div>
        </section>

        {/* Privacy model — STRK20 */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">The Privacy Model, In Practice</h2>
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

        {/* What STRK20 protects / remains public */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Exactly What &ldquo;Private&rdquo; Means Here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
              <h3 className="font-semibold text-accent mb-3">Shielded Inside the Pool</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Sender identity — hidden inside the pool', 'Recipient identity — private transfer destinations', 'Transaction amounts — shielded within the privacy pool', 'Token information — hidden for pool-internal transfers', 'Transaction details — private to other users and observers'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent shrink-0">+</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-warning/5 border border-warning/20 rounded-xl">
              <h3 className="font-semibold text-warning mb-3">Public on the Blockchain</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Deposit transactions — ERC-20 transfer to the pool is public', 'Withdrawal transactions — ERC-20 transfer to wallet is public', 'Deposit amounts — funding transactions show amounts', 'Block-level metadata — timing correlations are possible', 'Network metadata — IP addresses and node-level information'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-warning shrink-0">!</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Storage */}
        <section className="mb-12 reveal-target" data-reveal>
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
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Privacy Limitations, Stated Honestly</h2>
          <div className="p-6 bg-danger/5 border border-danger/20 rounded-xl">
            <h3 className="font-semibold text-danger mb-3">What Veilfolio Cannot Protect Against</h3>
            <ul className="text-sm text-muted space-y-2">
              {['Wallet compromise — all execution contexts are exposed', 'Browser compromise — malware can observe your activities', 'User-initiated linking — voluntarily connecting identities', 'Timing analysis — sophisticated observers may correlate transactions', 'IP-level tracking — network metadata can be observed', 'ERC-20 deposit/withdrawal correlation — public blockchain links'].map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-danger shrink-0">-</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Future */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">What Comes Next</h2>
          <div className="space-y-4">
            <div className="p-6 bg-accent-secondary/5 border border-accent-secondary/20 rounded-xl">
              <h3 className="font-semibold text-accent-secondary mb-3">Native STRK20 Private Sub-Accounts</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Protocol-level private sub-account management', 'Deeper separation of execution contexts', 'Reduced deposit/withdrawal correlation risk', 'Improved privacy without changing your experience'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent-secondary shrink-0">+</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
              <h3 className="font-semibold text-accent mb-3">The Road Ahead on Starknet</h3>
              <ul className="text-sm text-muted space-y-2">
                {['Confidential institutional rails — EY Nightfall brought private-by-default payments, treasury and DeFi to Starknet (2026)', 'Post-quantum hardening — StarkWare\u2019s roadmap replaces Pedersen hashing and adds quantum-resistant signatures', 'Asset-level privacy — STRK20 extends the standard so balances and transfers stay confidential by default when you choose them', 'A world demanding more privacy — the direction Ben-Sasson has charted since Zcash'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent shrink-0">+</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-12 reveal-target" data-reveal>
          <h2 className="text-xl font-bold text-foreground mb-5">Sources &amp; Further Reading</h2>
          <div className="space-y-2">
            {SOURCES.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-card border border-card-border rounded-xl hover:border-accent/20 hover-lift group"
              >
                <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{s.title}</p>
                  <p className="text-xs text-muted mt-0.5">{s.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}