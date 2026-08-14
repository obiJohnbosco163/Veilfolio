'use client';

import { usePortfolio, type ExecutionIdentity } from '@/context/PortfolioContext';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function IdentityCard({ identity }: { identity: ExecutionIdentity }) {
  const riskColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  const privacyStatusColors = {
    SHIELDED: 'bg-blue-100 text-blue-800',
    FUNDING: 'bg-amber-100 text-amber-800',
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link href={`/identity/${identity.id}`}>
      <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition cursor-pointer bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{identity.name}</h3>
            <p className="text-sm text-gray-500">{identity.type}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${privacyStatusColors[identity.privacyStatus]}`}>
              {identity.privacyStatus}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${riskColors[identity.riskScore]}`}>
              {identity.riskScore}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Balance</p>
            <p className="text-lg font-semibold text-gray-900">${parseFloat(identity.balance) / 1e18 || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Allocation</p>
            <p className="text-lg font-semibold text-gray-900">{identity.allocation.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">PnL</p>
            <p className={`text-lg font-semibold ${identity.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {identity.pnl >= 0 ? '+' : ''}{identity.pnl.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Created {formatDistanceToNow(new Date(identity.createdAt), { addSuffix: true })}
          </p>
          <p className="text-xs font-medium text-blue-600">View Details →</p>
        </div>
      </div>
    </Link>
  );
}
