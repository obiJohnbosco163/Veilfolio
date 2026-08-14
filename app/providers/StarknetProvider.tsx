'use client';

import React from 'react';
import { StarknetConfig, braavos, argent } from '@starknet-react/core';

// Minimal chain configuration for Starknet mainnet
const mainnetChain = {
  id: 'SN_MAIN',
  name: 'Starknet Mainnet',
} as any;

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnetChain]}
      provider={{} as any}
      connectors={[braavos(), argent()]}
    >
      {children}
    </StarknetConfig>
  );
}
