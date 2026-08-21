'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { useMemo } from 'react';

export function PortfolioOverview() {
  const { identities } = usePortfolio();

  const stats = useMemo(() => {
    const active = identities.filter((id) => id.is_active);
    const totalBalance = identities.reduce((sum, id) => {
      const val = parseFloat(id.balance.replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0);
    const totalPnL = identities.length > 0
      ? identities.reduce((sum, id) => sum + id.pnl, 0) / identities.length
      : 0;

    return {
      totalBalance: totalBalance.toFixed(2),
      activeCount: active.length,
      totalCount: identities.length,
      totalPnL: totalPnL.toFixed(2),
      shieldedCount: identities.filter((id) => id.privacyStatus === 'SHIELDED').length,
    };
  }, [identities]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 stagger-children">
      {[
        { label: 'Total Value', value: `$${stats.totalBalance}`, sub: `Across ${stats.totalCount} identities`, color: 'text-foreground' },
        { label: 'Active', value: stats.activeCount.toString(), sub: 'Execution contexts', color: 'text-accent' },
        { label: 'Avg PnL', value: `${parseFloat(stats.totalPnL) >= 0 ? '+' : ''}${stats.totalPnL}%`, sub: 'All positions', color: parseFloat(stats.totalPnL) >= 0 ? 'text-success' : 'text-danger' },
        { label: 'Shielded', value: stats.shieldedCount.toString(), sub: 'Privacy pool', color: 'text-accent-secondary' },
      ].map((stat) => (
        <div key={stat.label} className="p-4 bg-card border border-card-border rounded-xl">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-medium">{stat.label}</p>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-[10px] text-muted mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
