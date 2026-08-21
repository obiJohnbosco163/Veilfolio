'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { useAccount } from '@starknet-react/core';
import { WalletBar } from '@/components/WalletBar';
import { IdentityCard } from '@/components/IdentityCard';
import { DashboardBackground } from '@/components/DashboardBackground';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ value, decimals = 4 }: { value: string; decimals?: number }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = parseFloat(value) || 0;
    if (target === 0) { setDisplay('0.0000'); return; }
    const duration = 800;
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, decimals]);

  return <span ref={ref} className="animate-count-up">{display}</span>;
}

const WHY_FEATURES = [
  {
    num: '01',
    title: 'Isolated Identities',
    desc: 'Keep trading, DeFi, and long-term holdings in separate private execution contexts.',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  },
  {
    num: '02',
    title: 'STRK20 Privacy Pool',
    desc: 'Shield your DeFi activity via zero-knowledge proofs. Full financial privacy.',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  },
  {
    num: '03',
    title: 'On-Chain Transparency',
    desc: 'All identity data lives on Starknet. Verify everything, reveal nothing.',
    icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
  },
];

export default function Home() {
  const { identities, isLoading, error, walletBalance, totalIdentityBalance } = usePortfolio();
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background relative">
      <DashboardBackground />
      <WalletBar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {!isConnected ? (
          /* ── Disconnected: Clean Hero ── */
          <div className="flex flex-col items-center justify-center pt-20 sm:pt-32 pb-20">
            {/* Hero */}
            <div className="relative mb-16 text-center max-w-xl mx-auto">
              <div className="absolute -inset-32 bg-gradient-to-b from-accent/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-[11px] font-medium mb-6 tracking-wide uppercase">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  Starknet
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
                  <span className="gradient-text">Your portfolio.</span>
                  <br />
                  <span className="text-foreground">Your identities.</span>
                </h1>

                <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed mb-10">
                  Private by design. Create isolated identities, shield your DeFi activity, and manage your portfolio on Starknet.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/identity/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-background rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/20"
                    style={{ background: 'var(--accent-gradient)' }}
                  >
                    Get started
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-muted rounded-xl border border-card-border transition-all duration-200 hover:text-foreground hover:border-accent/20"
                  >
                    How privacy works
                  </Link>
                </div>
              </div>
            </div>

            {/* Features — nestor.name.ng numbered layout */}
            <div className="w-full max-w-2xl space-y-0 stagger-reveal">
              {WHY_FEATURES.map((feat, i) => (
                <div key={feat.num} className="numbered-section group py-6 sm:py-7 cursor-default">
                  <span className="section-number">{feat.num}</span>
                  {i < WHY_FEATURES.length - 1 && <div className="section-line" />}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-surface border border-card-border/60 transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/5">
                      <svg className="w-4.5 h-4.5 text-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">{feat.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Connected: Dashboard ── */
          <div className="pt-8 sm:pt-12 pb-16 animate-fade-in">
            {/* Balance hero */}
            <div className="mb-10">
              <div className="flex items-end justify-between gap-4 mb-1">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-widest font-medium mb-2">Total Balance</p>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                      <AnimatedCounter value={walletBalance} />
                    </h1>
                    <span className="text-lg font-medium text-muted">STRK</span>
                  </div>
                </div>
                <Link
                  href="/identity/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-background rounded-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/15 shrink-0"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Identity
                </Link>
              </div>

              {/* Compact stat pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-card-border/60 rounded-lg text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-muted">Identities</span>
                  <span className="font-semibold text-foreground">{identities.length}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-card-border/60 rounded-lg text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                  <span className="text-muted">Identity Value</span>
                  <span className="font-semibold text-foreground">{parseFloat(totalIdentityBalance).toFixed(2)} STRK</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-card-border/60 rounded-lg text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  <span className="text-muted">Active</span>
                  <span className="font-semibold text-foreground">{identities.filter(i => i.is_active).length}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-danger/8 border border-danger/15 rounded-xl text-danger text-sm mb-6 animate-fade-in flex items-center gap-2.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span className="text-xs">{error}</span>
              </div>
            )}

            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Identities
                {identities.length > 0 && (
                  <span className="text-muted font-normal ml-1.5">({identities.length})</span>
                )}
              </h2>
              {identities.length > 0 && (
                <button
                  onClick={() => window.location.reload()}
                  className="text-[11px] text-muted hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Refresh
                </button>
              )}
            </div>

            {isLoading && identities.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-5 rounded-2xl shimmer-bg h-44 border border-card-border/60" />
                ))}
              </div>
            ) : identities.length === 0 ? (
              /* Empty state */
              <div className="text-center py-16 sm:py-20 bg-card border border-card-border/60 rounded-2xl animate-fade-in-up">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-surface border border-card-border/60">
                  <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0Zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0Z" />
                  </svg>
                </div>
                <p className="text-foreground font-semibold mb-1">No identities yet</p>
                <p className="text-muted text-sm mb-6 max-w-xs mx-auto">Create your first identity to start managing your portfolio privately.</p>
                <Link
                  href="/identity/new"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-background rounded-xl transition-all duration-200 hover:scale-[1.03]"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Create your first identity
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              /* Identity grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {identities.map((identity, i) => (
                  <IdentityCard key={identity.id.toString()} identity={identity} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-card-border/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="Veilfolio" fill className="object-cover" />
            </div>
            <span className="text-xs font-semibold gradient-text">Veilfolio</span>
          </div>
          <p className="text-[11px] text-muted">Privacy-first portfolio management for Starknet</p>
        </div>
      </footer>
    </div>
  );
}
