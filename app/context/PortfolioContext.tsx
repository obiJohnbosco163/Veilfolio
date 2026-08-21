'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import {
  getIdentitiesForOwner,
  createOnChainIdentity,
  setIdentityStatus,
  getIdentityTypeName,
  humanReadableIdentityName,
  getStrkBalance,
  getTransactionHistory,
  type OnChainIdentity,
  type TransactionRecord,
} from '@/lib/strk20';

export type IdentityType = 'TRADING' | 'DEFI' | 'YIELD' | 'LONG_TERM' | 'APP' | 'VENUE' | 'STRATEGY' | 'CUSTOM';
export type PrivacyStatus = 'SHIELDED' | 'FUNDING' | 'ACTIVE' | 'INACTIVE';

export interface IdentityMetadata {
  identityId: string;
  balance: string;
  allocation: number;
  pnl: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyStatus: PrivacyStatus;
  shieldedMode: boolean;
  recentActivity: Array<{
    id: string;
    type: 'SHIELD' | 'TRANSFER' | 'SWAP' | 'UNSHIELD';
    amount: string;
    timestamp: number;
    txHash?: string;
  }>;
}

export interface ExecutionIdentity extends OnChainIdentity {
  type: IdentityType;
  humanName: string;
  balance: string;
  allocation: number;
  pnl: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyStatus: PrivacyStatus;
  shieldedMode: boolean;
  recentActivity: IdentityMetadata['recentActivity'];
}

interface PortfolioContextType {
  identities: ExecutionIdentity[];
  isLoading: boolean;
  error: string | null;
  walletBalance: string;
  totalIdentityBalance: string;
  transactions: TransactionRecord[];
  createIdentity: (name: string, typeName: IdentityType) => Promise<void>;
  toggleIdentity: (id: bigint, isActive: boolean) => Promise<void>;
  refreshIdentities: () => Promise<void>;
  refreshWalletBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  addActivity: (identityId: string, activity: IdentityMetadata['recentActivity'][0]) => void;
  toggleShieldedMode: (identityId: string, on: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const METADATA_KEY = 'veilfolio_identity_metadata';

function loadMetadataMap(): Record<string, IdentityMetadata> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(METADATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveMetadataMap(map: Record<string, IdentityMetadata>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(METADATA_KEY, JSON.stringify(map));
}

function getDefaultMetadata(id: bigint): IdentityMetadata {
  return {
    identityId: id.toString(),
    balance: '0',
    allocation: 0,
    pnl: 0,
    riskScore: 'LOW',
    privacyStatus: 'INACTIVE',
    shieldedMode: false,
    recentActivity: [],
  };
}

function mergeIdentity(onChain: OnChainIdentity, meta: IdentityMetadata): ExecutionIdentity {
  const typeName = getIdentityTypeName(onChain.identity_type) as IdentityType;
  return {
    ...onChain,
    type: typeName,
    humanName: humanReadableIdentityName(typeName, Number(onChain.id)),
    balance: meta.balance,
    allocation: meta.allocation,
    pnl: meta.pnl,
    riskScore: meta.riskScore,
    privacyStatus: meta.privacyStatus,
    shieldedMode: meta.shieldedMode,
    recentActivity: meta.recentActivity,
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { account, address, chainId } = useAccount();
  const [identities, setIdentities] = useState<ExecutionIdentity[]>([]);
  const [metadataMap, setMetadataMap] = useState<Record<string, IdentityMetadata>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState('0');
  const [totalIdentityBalance, setTotalIdentityBalance] = useState('0');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    setMetadataMap(loadMetadataMap());
  }, []);

  const refreshWalletBalance = useCallback(async () => {
    if (!address) {
      setWalletBalance('0');
      return;
    }
    try {
      // Skip balance fetch during network switch (chainId temporarily undefined)
      if (!chainId) return;
      const bal = await getStrkBalance(address, chainId);
      setWalletBalance(bal);
    } catch {
      setWalletBalance('0');
    }
  }, [address, chainId]);

  useEffect(() => {
    refreshWalletBalance();
  }, [refreshWalletBalance]);

  const refreshTransactions = useCallback(async () => {
    if (!address) {
      setTransactions([]);
      return;
    }
    try {
      if (!chainId) return;
      const txs = await getTransactionHistory(address, 30, chainId);
      setTransactions(txs);
    } catch {
      setTransactions([]);
    }
  }, [address, chainId]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const refreshIdentities = useCallback(async () => {
    if (!address) {
      setIdentities([]);
      setTotalIdentityBalance('0');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const onChainIds = await getIdentitiesForOwner(address);
      const meta = loadMetadataMap();
      setMetadataMap(meta);
      const merged = onChainIds.map((id) => {
        const key = id.id.toString();
        return mergeIdentity(id, meta[key] || getDefaultMetadata(id.id));
      });
      setIdentities(merged);

      // compute total identity balance
      const total = merged.reduce((acc, id) => {
        const bal = parseFloat(id.balance) || 0;
        return acc + bal;
      }, 0);
      setTotalIdentityBalance(total.toFixed(4));
    } catch (err) {
      console.error('Failed to refresh identities:', err);
      setError('Failed to load identities from chain');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    refreshIdentities();
  }, [refreshIdentities]);

  const createIdentity = useCallback(async (name: string, typeName: IdentityType) => {
    if (!account) throw new Error('Wallet not connected');
    setIsLoading(true);
    try {
      await createOnChainIdentity(account, name, typeName);
      await refreshIdentities();
    } finally {
      setIsLoading(false);
    }
  }, [account, refreshIdentities]);

  const toggleIdentity = useCallback(async (id: bigint, isActive: boolean) => {
    if (!account) throw new Error('Wallet not connected');
    setIsLoading(true);
    try {
      await setIdentityStatus(account, id, isActive);
      // Refresh after a short delay to allow RPC state to update
      await new Promise((r) => setTimeout(r, 2000));
      try {
        await refreshIdentities();
      } catch {
        // Identity status updated on-chain but refresh failed — non-critical
      }
    } finally {
      setIsLoading(false);
    }
  }, [account, refreshIdentities]);

  const addActivity = useCallback((identityId: string, activity: IdentityMetadata['recentActivity'][0]) => {
    setMetadataMap((prev) => {
      const existing = prev[identityId] || getDefaultMetadata(BigInt(identityId));
      const updated: IdentityMetadata = {
        ...existing,
        recentActivity: [activity, ...existing.recentActivity].slice(0, 20),
      };
      const next = { ...prev, [identityId]: updated };
      saveMetadataMap(next);
      return next;
    });
  }, []);

  const toggleShieldedMode = useCallback((identityId: string, on: boolean) => {
    setMetadataMap((prev) => {
      const existing = prev[identityId] || getDefaultMetadata(BigInt(identityId));
      const updated: IdentityMetadata = { ...existing, shieldedMode: on };
      const next = { ...prev, [identityId]: updated };
      saveMetadataMap(next);
      // also update identities state
      setIdentities((ids) =>
        ids.map((id) =>
          id.id.toString() === identityId ? { ...id, shieldedMode: on } : id
        )
      );
      return next;
    });
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        identities,
        isLoading,
        error,
        walletBalance,
        totalIdentityBalance,
        transactions,
        createIdentity,
        toggleIdentity,
        refreshIdentities,
        refreshWalletBalance,
        refreshTransactions,
        addActivity,
        toggleShieldedMode,
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
