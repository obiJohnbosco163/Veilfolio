'use client';

import React from 'react';
import { mainnet, sepolia } from '@starknet-react/chains';
import { StarknetConfig, jsonRpcProvider, useInjectedConnectors, argent, braavos } from '@starknet-react/core';

const RPC_URLS: Record<string, string> = {
  '1536725053037921711': process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-sepolia-rpc.publicnode.com',
  '23448594291968334': 'https://starknet-mainnet.public.blastapi.io',
};

function StarknetInner({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'always',
    order: 'alphabetical',
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      defaultChainId={sepolia.id}
      provider={jsonRpcProvider({
        rpc: (chain) => ({
          nodeUrl: RPC_URLS[chain.id.toString()] || RPC_URLS[sepolia.id.toString()],
        }),
      })}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetInner>
      {children}
    </StarknetInner>
  );
}
