'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { shield, privateTransfer, unshield } from '@/lib/strk20';
import { TOKENS, STRK20_PRIVACY_POOL_ADDRESS, type TokenSymbol } from '@/lib/contracts';
import { usePortfolio, type IdentityMetadata } from '@/context/PortfolioContext';

type Operation = 'shield' | 'transfer' | 'unshield';

const OPS: Record<Operation, { title: string; desc: string }> = {
  shield: { title: 'Shield', desc: 'Deposit tokens into the STRK20 privacy pool' },
  transfer: { title: 'Transfer', desc: 'Send tokens privately within the pool' },
  unshield: { title: 'Unshield', desc: 'Withdraw tokens back to a public address' },
};

// Check if the STRK20 privacy pool is deployed (non-zero address)
const POOL_AVAILABLE = STRK20_PRIVACY_POOL_ADDRESS &&
  STRK20_PRIVACY_POOL_ADDRESS !== '0x0000000000000000000000000000000000000000000000000000000000000000';

export function PrivacyOperations({ identityId, initialOp }: { identityId?: string; initialOp?: Operation }) {
  const { account } = useAccount();
  const { addActivity, refreshIdentities } = usePortfolio();
  const [activeOp, setActiveOp] = useState<Operation>(initialOp || 'shield');
  const [token, setToken] = useState<TokenSymbol>('STRK');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!account || !amount) return;

    // If the STRK20 privacy pool is not deployed, show coming soon message
    if (!POOL_AVAILABLE) {
      setError('STRK20 privacy pool is coming soon to sepolia. Shielding will be available once the pool is deployed. Stay tuned!');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setTxHash(null);

    try {
      if (parseFloat(amount) <= 0) throw new Error('Amount must be greater than zero');

      let hash: string;
      if (activeOp === 'shield') {
        hash = await shield(account, { token, amount, identityId: BigInt(identityId || 0) });
      } else if (activeOp === 'transfer') {
        if (!recipient) throw new Error('Recipient address required');
        if (!recipient.startsWith('0x') || recipient.length < 10) throw new Error('Invalid recipient address format');
        hash = await privateTransfer(account, { recipient, token, amount, sourceIdentityId: BigInt(identityId || 0) });
      } else {
        if (!recipient) throw new Error('Recipient address required');
        if (!recipient.startsWith('0x') || recipient.length < 10) throw new Error('Invalid recipient address format');
        hash = await unshield(account, { token, amount, sourceIdentityId: BigInt(identityId || 0), recipient });
      }

      setTxHash(hash);
      if (identityId) {
        addActivity(identityId, {
          id: `act_${Date.now()}`,
          type: activeOp.toUpperCase() as IdentityMetadata['recentActivity'][0]['type'],
          amount: `${amount} ${token}`,
          timestamp: Date.now(),
          txHash: hash,
        });
      }
      await refreshIdentities();
      setAmount('');
      setRecipient('');
    } catch (err: any) {
      const msg = err?.message || 'Transaction failed';
      if (msg.includes('User abort') || msg.includes('cancelled') || msg.includes('user rejected')) {
        setError('Transaction was cancelled in your wallet.');
      } else if (msg.includes('insufficient')) {
        setError('Insufficient funds for this transaction. Check your balance.');
      } else if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(msg.length > 200 ? msg.slice(0, 200) + '...' : msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-4">Privacy Operations</h3>

      {/* Coming Soon Banner */}
      {!POOL_AVAILABLE && (
        <div className="mb-5 p-4 rounded-xl border border-accent-blue/20 bg-accent-blue/5 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-blue/10 shrink-0">
              <svg className="w-4 h-4 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent-blue">Coming Soon</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                The STRK20 privacy pool is not yet deployed on sepolia. Shielding, private transfers, and unshielding will be available once the pool goes live. Your identity is ready — the privacy features will activate automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1.5 mb-5">
        {(Object.keys(OPS) as Operation[]).map((op) => (
          <button
            key={op}
            onClick={() => { setActiveOp(op); setError(null); setTxHash(null); }}
            className={`flex-1 sm:flex-none px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 min-h-[44px] ${
              activeOp === op
                ? 'text-background'
                : 'bg-surface text-muted hover:text-foreground border border-card-border'
            }`}
            style={activeOp === op ? { background: 'var(--accent-gradient)' } : undefined}
          >
            {OPS[op].title}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted mb-5">{OPS[activeOp].desc}</p>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5 font-medium">Token</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value as TokenSymbol)}
            className="w-full px-3 py-2.5 bg-surface border border-card-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          >
            {Object.keys(TOKENS).map((sym) => (
              <option key={sym} value={sym}>{TOKENS[sym as TokenSymbol].name} ({sym})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5 font-medium">Amount</label>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            className="w-full px-3 py-2.5 bg-surface border border-card-border rounded-lg text-foreground placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          />
        </div>

        {(activeOp === 'transfer' || activeOp === 'unshield') && (
          <div>
            <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5 font-medium">Recipient Address</label>
            <input
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2.5 bg-surface border border-card-border rounded-lg text-foreground placeholder:text-muted/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger flex items-start gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-xs text-success flex items-start gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Transaction submitted!{' '}
            <a
              href={`https://sepolia.voyager.online/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              TX: {txHash.slice(0, 16)}...
            </a>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!account || !amount || isSubmitting}
          className="w-full px-4 py-3 text-background font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm flex items-center justify-center gap-2"
          style={{ background: 'var(--accent-gradient)' }}
        >
          {isSubmitting ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</>
          ) : !POOL_AVAILABLE ? 'Coming Soon'
          : !account ? 'Connect Wallet' : OPS[activeOp].title}
        </button>
      </div>
    </div>
  );
}
