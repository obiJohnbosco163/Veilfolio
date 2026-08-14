'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { useMemo } from 'react';

export function PortfolioOverview() {
  const { identities } = usePortfolio();

  const stats = useMemo(() => {
    const totalBalance = identities.reduce((sum, id) => sum + parseFloat(id.balance || '0'), 0);
    const totalPnL = identities.length > 0 ? identities.reduce((sum, id) => sum + id.pnl, 0) / identities.length : 0;
    const avgAllocation = identities.length > 0 ? 100 / identities.length : 0;

    return {
      totalBalance: (totalBalance / 1e18).toFixed(2),
      activeIdentities: identities.filter((id) => id.privacyStatus === 'ACTIVE').length,
      totalPnL: totalPnL.toFixed(2),
      avgAllocation,
    };
  }, [identities]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-600 mb-2">Total Portfolio Value</p>
        <p className="text-3xl font-bold text-blue-900">${stats.totalBalance}</p>
        <p className="text-xs text-blue-600 mt-2">All execution identities</p>
      </div>

      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
        <p className="text-sm font-medium text-green-600 mb-2">Active Identities</p>
        <p className="text-3xl font-bold text-green-900">{stats.activeIdentities}</p>
        <p className="text-xs text-green-600 mt-2">Private execution contexts</p>
      </div>

      <div className={`p-6 bg-gradient-to-br rounded-lg border ${
        parseFloat(stats.totalPnL) >= 0
          ? 'from-emerald-50 to-emerald-100 border-emerald-200'
          : 'from-red-50 to-red-100 border-red-200'
      }`}>
        <p className={`text-sm font-medium mb-2 ${parseFloat(stats.totalPnL) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          Avg Portfolio PnL
        </p>
        <p className={`text-3xl font-bold ${parseFloat(stats.totalPnL) >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
          {parseFloat(stats.totalPnL) >= 0 ? '+' : ''}{stats.totalPnL}%
        </p>
        <p className={`text-xs mt-2 ${parseFloat(stats.totalPnL) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          Across all positions
        </p>
      </div>

      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
        <p className="text-sm font-medium text-purple-600 mb-2">Status</p>
        <p className="text-3xl font-bold text-purple-900">Ready</p>
        <p className="text-xs text-purple-600 mt-2">STRK20 connected</p>
      </div>
    </div>
  );
}
