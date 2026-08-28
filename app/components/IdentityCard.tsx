'use client';

import { type ExecutionIdentity } from '@/context/PortfolioContext';
import { IDENTITY_TYPE_LABEL } from '@/lib/strk20';
import Link from 'next/link';

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

const TYPE_DOT_COLORS: Record<string, string> = {
  TRADING: 'bg-accent-blue',
  DEFI: 'bg-accent-secondary',
  YIELD: 'bg-accent',
  LONG_TERM: 'bg-amber-400',
  APP: 'bg-pink-400',
  VENUE: 'bg-orange-400',
  STRATEGY: 'bg-cyan-400',
  CUSTOM: 'bg-muted',
};

const TYPE_PURPOSE: Record<number, string> = {
  0: 'Active trading across DEXs, perps, and arbitrage strategies',
  1: 'DeFi interactions — lending, borrowing, and liquidity provision',
  2: 'Yield farming and staking strategies',
  3: 'Long-term holdings and DCA strategies',
  4: 'dApp-specific identity for on-chain interactions',
  5: 'Venue-specific trading accounts and market making',
  6: 'Custom algorithmic and automated strategies',
  7: 'General purpose identity',
};

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

export function IdentityCard({ identity, index }: { identity: ExecutionIdentity; index?: number }) {
  const createdAt = Number(identity.created_at) * 1000;
  const typeColor = TYPE_COLORS[identity.type] || 'text-muted';
  const dotColor = TYPE_DOT_COLORS[identity.type] || 'bg-muted';
  const iconName = TYPE_ICONS[identity.type] || TYPE_ICONS.CUSTOM;
  const typeName = IDENTITY_TYPE_LABEL[identity.type] ?? identity.type;
  const purpose = TYPE_PURPOSE[identity.identity_type] || '';
  const displayNum = index ?? Number(identity.id);

  return (
    <Link href={`/identity/${identity.id.toString()}`}>
      <div className="group relative numbered-card bg-card border border-card-border/60 rounded-2xl p-5 hover-lift cursor-pointer overflow-hidden hover:border-accent/15">
        {/* Top row: number + type dot + name + status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            {/* Large index number */}
            <span className="text-2xl font-black text-muted/20 leading-none tracking-tighter select-none transition-colors group-hover:text-accent/30">
              {String(displayNum).padStart(2, '0')}
            </span>
            <div className="min-w-0 pt-0.5">
              <h3 className="text-sm font-bold text-foreground truncate leading-tight mb-1">{identity.name || `${typeName} #${displayNum}`}</h3>
              {purpose && (
                <p className="text-[11px] text-muted leading-snug line-clamp-2">{purpose}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${typeColor}`}>{typeName}</span>
              </div>
            </div>
          </div>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${identity.is_active ? 'bg-success' : 'bg-muted/30'}`} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex-1 min-w-0">
            <p className="text-muted text-[10px] uppercase tracking-wider mb-0.5">Balance</p>
            <p className="font-semibold text-foreground truncate tnum">{Number(identity.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })} STRK</p>
          </div>
          <div className="w-px h-6 bg-card-border/60 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-muted text-[10px] uppercase tracking-wider mb-0.5">PnL</p>
            <p className={`font-semibold tnum ${identity.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {identity.pnl >= 0 ? '+' : ''}{identity.pnl.toFixed(2)}%
            </p>
          </div>
          <div className="w-px h-6 bg-card-border/60 shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-muted text-[10px] uppercase tracking-wider mb-0.5">Created</p>
            <p className="font-medium text-foreground truncate">
              {createdAt > 0 ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'On-chain'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
