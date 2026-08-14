'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type IdentityType = 'TRADING' | 'DEFI' | 'YIELD' | 'LONG_TERM' | 'APP' | 'VENUE' | 'STRATEGY' | 'CUSTOM';
export type PrivacyStatus = 'SHIELDED' | 'FUNDING' | 'ACTIVE' | 'INACTIVE';

export interface ExecutionIdentity {
  id: string;
  name: string;
  type: IdentityType;
  purpose: string;
  createdAt: number;
  balance: string; // Will be calculated from STRK20
  allocation: number; // Percentage of total portfolio
  pnl: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyStatus: PrivacyStatus;
  recentActivity: Array<{
    id: string;
    type: 'SHIELD' | 'TRANSFER' | 'SWAP' | 'UNSHIELD';
    amount: string;
    timestamp: number;
    txHash?: string;
  }>;
}

interface PortfolioContextType {
  identities: ExecutionIdentity[];
  createIdentity: (identity: Omit<ExecutionIdentity, 'id' | 'createdAt'>) => void;
  updateIdentity: (id: string, updates: Partial<ExecutionIdentity>) => void;
  deleteIdentity: (id: string) => void;
  addActivity: (identityId: string, activity: ExecutionIdentity['recentActivity'][0]) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [identities, setIdentities] = useState<ExecutionIdentity[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem('veilfolio_identities');
    if (stored) {
      try {
        setIdentities(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load identities:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever identities change (client-side only)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('veilfolio_identities', JSON.stringify(identities));
    }
  }, [identities, isHydrated]);

  const createIdentity = (identity: Omit<ExecutionIdentity, 'id' | 'createdAt'>) => {
    const newIdentity: ExecutionIdentity = {
      ...identity,
      id: `identity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    setIdentities([...identities, newIdentity]);
  };

  const updateIdentity = (id: string, updates: Partial<ExecutionIdentity>) => {
    setIdentities(
      identities.map((identity) =>
        identity.id === id ? { ...identity, ...updates } : identity
      )
    );
  };

  const deleteIdentity = (id: string) => {
    setIdentities(identities.filter((identity) => identity.id !== id));
  };

  const addActivity = (identityId: string, activity: ExecutionIdentity['recentActivity'][0]) => {
    setIdentities(
      identities.map((identity) =>
        identity.id === identityId
          ? {
              ...identity,
              recentActivity: [activity, ...identity.recentActivity].slice(0, 20), // Keep last 20
            }
          : identity
      )
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        identities,
        createIdentity,
        updateIdentity,
        deleteIdentity,
        addActivity,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}
