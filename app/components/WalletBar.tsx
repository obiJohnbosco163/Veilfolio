'use client';

import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import { useMemo } from 'react';

export function WalletBar() {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const networkStatus = process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'mainnet';

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Veilfolio</h1>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          ● {networkStatus.toUpperCase()}
        </span>
      </div>

      {address ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Connected: <span className="font-mono font-semibold text-gray-900">{shortenedAddress}</span>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
