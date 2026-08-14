'use client';

import { WalletBar } from '@/components/WalletBar';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { IdentityCard } from '@/components/IdentityCard';
import { usePortfolio } from '@/context/PortfolioContext';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // const { identities } = usePortfolio();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* WalletBar temporarily disabled for testing */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PortfolioOverview temporarily disabled */}

        <div className="mb-8">
          <h1>Test Page</h1>
        </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Execution Identities</h2>
              <p className="text-gray-600 text-sm mt-1">Manage your private portfolio contexts</p>
            </div>
            <Link href="/identity/new">
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                + New Identity
              </button>
            </Link>
          </div>

          {identities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">No execution identities created yet</p>
              <Link href="/identity/new">
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                  Create Your First Identity
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {identities.map((identity) => (
                <IdentityCard key={identity.id} identity={identity} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/privacy">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Center</h3>
              <p className="text-gray-600">Learn about our privacy model and what STRK20 protects</p>
            </div>
          </Link>

          <Link href="/architecture">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
              <p className="text-gray-600">Understand how Veilfolio works under the hood</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
