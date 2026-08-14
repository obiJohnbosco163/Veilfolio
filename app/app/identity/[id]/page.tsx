'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { useParams, useRouter } from 'next/navigation';
import { WalletBar } from '@/components/WalletBar';
import { formatDistanceToNow } from 'date-fns';

export default function IdentityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { identities } = usePortfolio();

  const identity = identities.find((id) => id.id === params.id);

  if (!identity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WalletBar />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Identity not found</p>
            <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletBar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{identity.name}</h1>
            <p className="text-blue-100">{identity.type} Execution Context</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-2">Balance</p>
              <p className="text-2xl font-bold text-gray-900">${parseFloat(identity.balance) / 1e18}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Allocation</p>
              <p className="text-2xl font-bold text-gray-900">{identity.allocation.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">PnL</p>
              <p className={`text-2xl font-bold ${identity.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {identity.pnl >= 0 ? '+' : ''}{identity.pnl.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Risk</p>
              <p className="text-2xl font-bold text-gray-900">{identity.riskScore}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-8">
            {/* Privacy Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Status</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="font-semibold text-blue-900">{identity.privacyStatus}</span>
                </div>
                <p className="text-sm text-blue-800">
                  This execution context is {identity.privacyStatus === 'ACTIVE' ? 'actively' : 'ready for'} private operations via STRK20.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {identity.recentActivity.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {identity.recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{activity.type}</p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{activity.amount}</p>
                      </div>
                      {activity.txHash && (
                        <p className="text-xs text-gray-500 font-mono">
                          TX: {activity.txHash.slice(0, 16)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-gray-200 flex gap-4">
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Fund Identity
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                Transfer
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                Private Swap
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
