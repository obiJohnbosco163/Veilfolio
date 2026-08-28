'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { IDENTITY_TYPE_LABEL, humanReadableIdentityName } from '@/lib/strk20';
import { IDENTITY_MANAGER_ADDRESS } from '@/lib/contracts';
import { useParams, useRouter } from 'next/navigation';
import { WalletBar } from '@/components/WalletBar';
import { PrivacyOperations } from '@/components/PrivacyOperations';
import { useAccount } from '@starknet-react/core';
import { useState, useEffect } from 'react';

const TYPE_ICONS: Record<string, string> = {
  TRADING: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  DEFI: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  YIELD: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  LONG_TERM: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  APP: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z',
  VENUE: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-10.65 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 10a2.993 2.993 0 002.25 1.038A2.993 2.993 0 0015.75 10c.354 0 .696.044 1.025.125',
  STRATEGY: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605',
  CUSTOM: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z',
};

const TYPE_COLORS: Record<string, string> = {
  TRADING: 'text-accent-blue',
  DEFI: 'text-accent-secondary',
  YIELD: 'text-accent',
  LONG_TERM: 'text-amber-400',
  APP: 'text-pink-400',
  VENUE: 'text-orange-400',
  STRATEGY: 'text-cyan-400',
  CUSTOM: 'text-muted',
};

const IDENTITY_TYPE_PURPOSE: Record<number, string> = {
  0: 'Active trading across DEXs, perps, and arbitrage strategies',
  1: 'DeFi interactions — lending, borrowing, and liquidity provision',
  2: 'Yield farming and staking strategies',
  3: 'Long-term holdings and DCA strategies',
  4: 'dApp-specific identity for on-chain interactions',
  5: 'Venue-specific trading accounts and market making',
  6: 'Custom algorithmic and automated strategies',
  7: 'General purpose identity',
};

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState('0.0000');

  useEffect(() => {
    const target = typeof value === 'string' ? (parseFloat(value) || 0) : (Number.isFinite(value) ? value : 0);
    const duration = 700;
    const start = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((target * eased).toFixed(4));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <span className="animate-count-up tnum">{display}</span>;
}

type TabKey = 'overview' | 'activity' | 'settings';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'activity', label: 'Activity' },
  { key: 'settings', label: 'Settings' },
];

const STRK20_FEATURES = [
  {
    title: 'Shield',
    desc: 'Deposit funds into the privacy pool and receive shielded notes.',
    icon: 'M12 4.5v15m7.5-7.5h-15',
    accent: 'text-accent',
    border: 'border-accent/20',
    bg: 'from-accent/15 to-accent/5',
  },
  {
    title: 'Private Transfer',
    desc: 'Send shielded funds privately with zero-knowledge proofs.',
    icon: 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
    accent: 'text-accent-blue',
    border: 'border-accent-blue/20',
    bg: 'from-accent-blue/15 to-accent-blue/5',
  },
  {
    title: 'Unshield',
    desc: 'Withdraw shielded funds back to your public wallet.',
    icon: 'M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75',
    accent: 'text-accent-secondary',
    border: 'border-accent-secondary/20',
    bg: 'from-accent-secondary/15 to-accent-secondary/5',
  },
];

export default function IdentityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { identities, toggleIdentity, isLoading, walletBalance, toggleShieldedMode, transactions } = usePortfolio();
  const { isConnected, chainId } = useAccount();
  const MAINNET_IDS = new Set(['23448594291968334', '0x534e5f4d41494e4e4554']);
  const isMainnet = chainId ? MAINNET_IDS.has(chainId.toString()) : false;

  const identityId = params.id as string;
  const identity = identities.find((id) => id.id.toString() === identityId);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showPrivacyOps, setShowPrivacyOps] = useState(false);
  const [modalOp, setModalOp] = useState<'shield' | 'transfer' | 'unshield' | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  if (!identity) {
    return (
      <div className="min-h-screen bg-background">
        <WalletBar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center py-20 animate-fade-in">
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(124,92,252,0.1))' }}
            >
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-foreground font-semibold mb-1">
              {isConnected ? 'Identity not found' : 'Connect your wallet'}
            </p>
            <p className="text-muted text-sm mb-4">
              {isConnected ? 'This identity may not exist on-chain yet' : 'Connect your wallet to view identities'}
            </p>
            <button onClick={() => router.push('/')} className="text-accent hover:text-accent/80 text-sm font-semibold transition">
              &larr; Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const createdAtMs = Number(identity.created_at) * 1000;
  const createdLabel = createdAtMs > 0 ? new Date(createdAtMs).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown';
  const typeIcon = TYPE_ICONS[identity.type] || TYPE_ICONS.CUSTOM;
  const typeColor = TYPE_COLORS[identity.type] || 'text-muted';
  const typeLabel = IDENTITY_TYPE_LABEL[identity.type] || identity.type;
  const pnlValue = Number(identity.pnl) || 0;
  const pnlPositive = pnlValue >= 0;

  const handleToggleActive = async () => {
    setToggleError(null);
    try {
      await toggleIdentity(identity.id, !identity.is_active);
    } catch (err: any) {
      console.error('Failed to toggle identity:', err);
      const msg = err?.message || err?.toString() || 'Transaction failed';
      setToggleError(msg.includes('User reject') ? 'Transaction rejected by user' : 'Failed to update identity status. Check your wallet for details.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WalletBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back */}
        <button onClick={() => router.push('/')} className="text-muted hover:text-foreground mb-6 flex items-center gap-2 text-sm font-medium transition animate-fade-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Dashboard
        </button>

        <div className="bg-card border border-card-border rounded-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.05), rgba(124,92,252,0.05), rgba(56,189,248,0.05))' }} />
            <div className="relative">
              {/* Name + Purpose */}
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{identity.name || humanReadableIdentityName(typeLabel, Number(identity.id))}</h1>
              {(IDENTITY_TYPE_PURPOSE[identity.identity_type]) && (
                <p className="text-sm text-muted mt-1">{IDENTITY_TYPE_PURPOSE[identity.identity_type]}</p>
              )}
              {/* Meta row: ID, Type, Status, Created */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="text-xs font-mono text-muted tnum">#{identity.id.toString()}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeColor} bg-surface`}>
                  {typeLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${identity.is_active ? 'bg-success' : 'bg-muted/50'}`} />
                  <span className="text-[10px] text-muted uppercase tracking-wider font-medium">{identity.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <span className="text-[11px] text-muted">Created {createdLabel}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-card-border px-6 sm:px-8 pt-4">
            <nav className="flex gap-1 rounded-lg bg-surface p-1 w-full sm:w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.key ? 'text-background' : 'text-muted hover:text-foreground'
                  }`}
                  style={activeTab === tab.key ? { background: 'var(--accent-gradient)' } : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Hero Balance Card */}
                <div className="relative p-6 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(124,92,252,0.06), rgba(56,189,248,0.04))' }}>
                  <div className="absolute inset-0 border border-card-border rounded-2xl pointer-events-none" />
                  <div className="relative">
                    <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">Identity Balance</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-foreground">
                        <AnimatedValue value={parseFloat(identity.balance) || 0} />
                      </span>
                      <span className="text-lg text-muted font-medium">STRK</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted">Wallet:</span>
                        <span className="font-semibold text-foreground tnum">{parseFloat(walletBalance).toFixed(4)} STRK</span>
                      </div>
                      <div className="w-px h-4 bg-card-border" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted">PnL:</span>
                        <span className={`font-semibold tnum ${pnlPositive ? 'text-success' : 'text-danger'}`}>
                          {pnlPositive ? '+' : ''}{pnlValue.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {STRK20_FEATURES.map((feature) => {
                      const op = feature.title === 'Shield' ? 'shield' : feature.title === 'Private Transfer' ? 'transfer' : 'unshield';
                      return (
                        <button
                          key={feature.title}
                          onClick={() => setModalOp(op as 'shield' | 'transfer' | 'unshield')}
                          className={`group p-4 bg-card border ${feature.border} rounded-xl hover-lift cursor-pointer text-center`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-gradient-to-br ${feature.bg}`}>
                            <svg className={`w-5 h-5 ${feature.accent}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                            </svg>
                          </div>
                          <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shielded Mode + Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-card-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${identity.shieldedMode ? 'bg-accent/10' : 'bg-surface'}`}>
                        <svg className={`w-5 h-5 ${identity.shieldedMode ? 'text-accent' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Shielded Mode</p>
                        <p className="text-xs text-muted">{identity.shieldedMode ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleShieldedMode(identityId, !identity.shieldedMode)}
                      className={`shield-toggle ${identity.shieldedMode ? 'active' : ''}`}
                      aria-label="Toggle shielded mode"
                    >
                      <div className="shield-knob" />
                    </button>
                  </div>

                  <div className="bg-card border border-card-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface">
                        <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.05a4.5 4.5 0 00-6.364-6.364L4.5 8.25a4.5 4.5 0 006.364 6.364l4.5-4.5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Owner</p>
                        <p className="text-xs font-mono text-muted truncate max-w-[180px]">{identity.owner ? `${identity.owner.slice(0, 10)}...${identity.owner.slice(-4)}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`https://sepolia.voyager.online/contract/${IDENTITY_MANAGER_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-accent hover:underline"
                      >
                        View on Voyager &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                {/* On-Chain Details */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">On-Chain Details</h3>
                  <div className="bg-card border border-card-border rounded-xl divide-y divide-card-border">
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted">Identity ID</span>
                      <span className="font-mono text-xs text-foreground">{identity.id.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted">Owner</span>
                      <span className="font-mono text-xs text-foreground max-w-[200px] truncate">{identity.owner ? `${identity.owner.slice(0, 10)}...${identity.owner.slice(-4)}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-xs text-muted">Contract</span>
                      <a href={`https://sepolia.voyager.online/contract/${IDENTITY_MANAGER_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-accent hover:underline">View on Voyager</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="animate-fade-in space-y-6">
                {/* Local Activity */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Privacy Operations</h3>
                  {identity.recentActivity.length === 0 ? (
                    <div className="text-center py-10 bg-surface rounded-xl border border-card-border">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-card flex items-center justify-center">
                        <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                      </div>
                      <p className="text-foreground text-sm font-medium mb-0.5">No privacy operations yet</p>
                      <p className="text-muted text-xs">Shield funds to start using this identity privately.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 stagger-children">
                      {identity.recentActivity.map((activity) => (
                        <div key={activity.id} className="p-4 bg-surface rounded-xl border border-card-border hover-lift">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-semibold text-foreground text-sm">{activity.type}</p>
                              <p className="text-xs text-muted">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-bold text-foreground tnum">{activity.amount}</p>
                          </div>
                          {activity.txHash && (
                            <a
                              href={`https://sepolia.voyager.online/tx/${activity.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-accent font-mono mt-1 inline-block hover:underline"
                            >
                              View on Voyager
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* On-Chain Transaction History */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">On-Chain Transactions</h3>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-medium">{transactions.length} transactions</span>
                  </div>
                  {transactions.length === 0 ? (
                    <div className="text-center py-10 bg-surface rounded-xl border border-card-border">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-card flex items-center justify-center">
                        <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                      </div>
                      <p className="text-foreground text-sm font-medium mb-0.5">No transactions found</p>
                      <p className="text-muted text-xs">On-chain transactions will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 stagger-children">
                      {transactions.map((tx, i) => (
                        <div key={`${tx.txHash}-${i}`} className="p-4 bg-surface rounded-xl border border-card-border hover-lift">
                          <div className="flex justify-between items-start mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-card border border-card-border">
                                {tx.type === 'TRANSFER' ? (
                                  <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                  </svg>
                                ) : tx.type === 'INVOKE' ? (
                                  <svg className="w-3.5 h-3.5 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                  </svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5 text-accent-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-sm">{tx.type}</p>
                                <p className="text-[10px] text-muted font-mono">{tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'N/A'}</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-success/10 text-success">{tx.status}</span>
                          </div>
                          {tx.txHash && (
                            <a
                              href={`https://sepolia.voyager.online/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-accent font-mono hover:underline"
                            >
                              View on Voyager
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Identity Status</h3>
                  <div className="p-5 bg-surface rounded-xl border border-card-border space-y-4">
                    <p className="text-sm text-muted leading-relaxed">
                      This identity is currently{' '}
                      <span className={`font-semibold ${identity.is_active ? 'text-success' : 'text-muted'}`}>
                        {identity.is_active ? 'active' : 'inactive'}
                      </span>
                      . {identity.is_active
                        ? 'Deactivating will pause all automated operations for this identity.'
                        : 'Activate this identity to resume operations.'}
                    </p>
                    <button
                      onClick={handleToggleActive}
                      disabled={isLoading}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm disabled:opacity-50 border ${
                        identity.is_active
                          ? 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20'
                          : 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
                      }`}
                    >
                      {isLoading ? 'Processing...' : identity.is_active ? 'Deactivate Identity' : 'Activate Identity'}
                    </button>
                    {toggleError && (
                      <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger mt-2 animate-fade-in">
                        {toggleError}
                      </div>
                    )}
                  </div>
                </div>

                {identity.is_active && (
                  <div className="p-4 rounded-xl border border-danger/30 bg-danger/5 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-danger">Deactivation Warning</p>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                          Deactivating this identity is reversible, but any in-flight private operations may fail.
                          Funds remain safe on-chain and can be unshielded at any time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-card-border flex gap-3 flex-wrap">
              <button
                onClick={() => setShowPrivacyOps(!showPrivacyOps)}
                className="press-scale px-5 py-2.5 text-background rounded-xl font-bold transition-transform hover:scale-[1.02] text-sm flex items-center gap-2"
                style={{ background: 'var(--accent-gradient)' }}
              >
                {showPrivacyOps ? 'Hide Operations' : 'Privacy Operations'}
              </button>
            </div>

            {showPrivacyOps && (
              <div className="pt-4 animate-fade-in">
                <PrivacyOperations identityId={identity.id.toString()} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Privacy Operation Modal */}
      {modalOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto" onClick={() => setModalOp(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Modal */}
          <div
            className="relative w-full max-w-lg bg-card border border-card-border rounded-2xl shadow-2xl animate-fade-in-up overflow-hidden my-auto max-h-[calc(100dvh-2rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="absolute inset-0" style={{
                background: modalOp === 'shield'
                  ? 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.02))'
                  : modalOp === 'transfer'
                  ? 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(56,189,248,0.02))'
                  : 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(124,92,252,0.02))'
              }} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    modalOp === 'shield' ? 'bg-accent/15' : modalOp === 'transfer' ? 'bg-accent-blue/15' : 'bg-accent-secondary/15'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      modalOp === 'shield' ? 'text-accent' : modalOp === 'transfer' ? 'text-accent-blue' : 'text-accent-secondary'
                    }`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={
                        modalOp === 'shield'
                          ? 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
                          : modalOp === 'transfer'
                          ? 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
                          : 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
                      } />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {modalOp === 'shield' ? 'Shield Funds' : modalOp === 'transfer' ? 'Private Transfer' : 'Unshield Funds'}
                    </h2>
                    <p className="text-xs text-muted">
                      {modalOp === 'shield'
                        ? 'Deposit into the STRK20 privacy pool'
                        : modalOp === 'transfer'
                        ? 'Send tokens privately within the pool'
                        : 'Withdraw back to your public wallet'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOp(null)}
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-all duration-200 min-h-[44px] sm:min-h-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6">
              {isMainnet ? (
                <PrivacyOperations key={modalOp} identityId={identity.id.toString()} initialOp={modalOp} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-accent-blue/10">
                    <svg className="w-8 h-8 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">STRK20 on Sepolia Soon</h3>
                  <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
                    {modalOp === 'shield'
                      ? 'Shielding will be available once the STRK20 privacy pool is deployed on Sepolia.'
                      : modalOp === 'transfer'
                      ? 'Private transfers will be available once the STRK20 privacy pool is deployed on Sepolia.'
                      : 'Unshielding will be available once the STRK20 privacy pool is deployed on Sepolia.'}
                  </p>
                  <button
                    onClick={() => setModalOp(null)}
                    className="press-scale mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-background transition-opacity hover:opacity-90"
                    style={{ background: 'var(--accent-gradient)' }}
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
