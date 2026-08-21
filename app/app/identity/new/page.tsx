'use client';

import { useRouter } from 'next/navigation';
import { usePortfolio, type IdentityType } from '@/context/PortfolioContext';
import { WalletBar } from '@/components/WalletBar';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';

const IDENTITY_TYPES: { value: IdentityType; label: string; description: string; icon: string }[] = [
  { value: 'TRADING', label: 'Trading', description: 'Short-term trading strategies', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z' },
  { value: 'DEFI', label: 'DeFi', description: 'Decentralized finance interactions', icon: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418' },
  { value: 'YIELD', label: 'Yield', description: 'Yield farming and staking', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125' },
  { value: 'LONG_TERM', label: 'Long-Term', description: 'Long-term holdings', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375' },
  { value: 'APP', label: 'App', description: 'Application-specific context', icon: 'M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 7.41A2.25 2.25 0 0 1 2.25 5.495V5.25' },
  { value: 'VENUE', label: 'Venue', description: 'Venue or exchange specific', icon: 'M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21h3.64m-3.64 0h-3.64m3.64 0V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 10c.354 0 .696.044 1.025.125A2.993 2.993 0 0 0 15.75 10c.354 0 .696.044 1.025.125A2.993 2.993 0 0 0 9.75 10Z' },
  { value: 'STRATEGY', label: 'Strategy', description: 'Custom strategy execution', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z' },
  { value: 'CUSTOM', label: 'Custom', description: 'Custom portfolio context', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z' },
];

export default function CreateIdentityPage() {
  const router = useRouter();
  const { createIdentity, isLoading } = usePortfolio();
  const { isConnected } = useAccount();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', type: 'TRADING' as IdentityType, customType: '', purpose: '' });
  const [txError, setTxError] = useState<string | null>(null);

  const steps = ['Type', 'Name', 'Privacy', 'Confirm', 'Done'];

  const handleSubmit = async () => {
    setTxError(null);
    try {
      const typeName = formData.type === 'CUSTOM' && formData.customType.trim()
        ? formData.customType.trim().slice(0, 31)  // felt252 name limit
        : formData.type;
      await createIdentity(formData.name, typeName as IdentityType);
      setStep(5);
    } catch (err: any) {
      const msg = err?.message || 'Failed to create identity';
      if (msg.includes('User abort') || msg.includes('cancelled')) {
        setTxError('Transaction was cancelled in your wallet.');
      } else if (msg.includes('insufficient')) {
        setTxError('Insufficient funds for gas. Please add STRK to your wallet.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setTxError('Network error. Please check your connection and try again.');
      } else {
        setTxError(`Transaction failed: ${msg.slice(0, 200)}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WalletBar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 animate-fade-in-up">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-foreground' : 'text-muted'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i + 1 < step ? 'text-background' :
                    i + 1 === step ? 'text-background' :
                    'bg-surface text-muted border border-card-border'
                  }`}
                    style={i + 1 <= step ? { background: i + 1 <= step ? 'var(--accent-gradient)' : undefined } : undefined}
                  >
                    {i + 1 < step ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 sm:w-8 h-px mx-1 sm:mx-2 transition-colors duration-300 ${i + 1 < step ? 'bg-accent' : 'bg-card-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content with animation */}
          <div className="animate-fade-in" key={step}>
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">What is this identity for?</h2>
                <p className="text-sm text-muted mb-6">Choose a category that best describes this execution context</p>
                <div className="grid grid-cols-2 gap-3 stagger-children">
                  {IDENTITY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-4 text-left rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                        formData.type === type.value
                          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/5'
                          : 'border-card-border hover:border-card-hover bg-surface'
                      }`}
                    >
                      <svg className={`w-5 h-5 mb-2 ${formData.type === type.value ? 'text-accent' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                      </svg>
                      <p className="font-semibold text-sm text-foreground">{type.label}</p>
                      <p className="text-xs text-muted mt-0.5">{type.description}</p>
                    </button>
                  ))}
                </div>

                {/* Custom type input — visible when CUSTOM is selected */}
                {formData.type === 'CUSTOM' && (
                  <div className="mt-4 animate-fade-in">
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                      Type a custom identity type
                    </label>
                    <input
                      type="text"
                      value={formData.customType}
                      onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                      placeholder="e.g., NFT Collector, DAO Voter, Airdrop Farmer..."
                      className="w-full px-4 py-3 bg-surface border border-accent/30 rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition text-sm"
                      autoFocus
                    />
                    <p className="text-[10px] text-muted mt-1.5">This will be stored on-chain as your identity type label.</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Name this execution identity</h2>
                <p className="text-sm text-muted mb-6">Choose a descriptive name for this private context</p>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Identity Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Private Trading, DeFi Alpha"
                    className="w-full px-4 py-3 bg-surface border border-card-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Purpose (Optional)</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Describe the strategy or purpose..."
                    rows={3}
                    className="w-full px-4 py-3 bg-surface border border-card-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Understanding Privacy</h2>
                <p className="text-sm text-muted mb-6">How this identity protects your activity</p>
                <div className="bg-surface border border-card-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    How It Works
                  </h3>
                  <ul className="space-y-3 text-sm text-muted">
                    {[
                      'An on-chain identity is created and linked to your wallet',
                      'You can shield funds through this identity into the STRK20 pool',
                      'Private transfers between identities are unlinkable',
                    ].map((text, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-5 h-5 rounded-full text-background text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--accent-gradient)' }}>{i + 1}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                    <li className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-warning/20 text-warning text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
                      <span>On-chain creation and activation/deactivation are public</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Review &amp; Confirm</h2>
                <p className="text-sm text-muted mb-6">This will create an on-chain identity via a Starknet transaction</p>
                <div className="bg-surface border border-card-border rounded-xl p-6 mb-4 space-y-4">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-medium">Identity Name</p>
                    <p className="text-lg font-bold text-foreground">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-medium">Type</p>
                    <p className="text-lg font-bold gradient-text">
                      {formData.type === 'CUSTOM' && formData.customType.trim()
                        ? formData.customType.trim()
                        : formData.type}
                    </p>
                  </div>
                  {formData.purpose && (
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-medium">Purpose</p>
                      <p className="text-sm text-muted">{formData.purpose}</p>
                    </div>
                  )}
                </div>
                {!isConnected && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl text-warning text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Please connect your wallet first to create an on-chain identity.
                  </div>
                )}
                {txError && (
                  <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-start gap-3 animate-fade-in">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <div>
                      <p className="font-semibold mb-0.5">Transaction Failed</p>
                      <p className="text-danger/80 text-xs">{txError}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                  <svg className="w-8 h-8 text-background" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Identity Created!</h2>
                <p className="text-sm text-muted mb-6">Your on-chain identity is now active</p>
                <div className="bg-surface border border-card-border rounded-xl p-6 text-left">
                  <p className="text-accent font-semibold mb-3 text-sm">Ready for private operations</p>
                  <ul className="space-y-2 text-sm text-muted">
                    {['Shield funds via STRK20 to start using this identity privately', 'Use the Privacy Operations panel to manage tokens', 'You can deactivate this identity at any time'].map((text, i) => (
                      <li key={i} className="flex gap-2">
                        <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-card-border">
            <button
              onClick={() => step > 1 && step < 5 ? setStep(step - 1) : router.push('/')}
              disabled={step === 1 || step === 5}
              className="px-5 py-2.5 border border-card-border rounded-xl font-medium text-muted hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
            >
              {step === 5 ? 'Dashboard' : 'Back'}
            </button>
            <div className="flex gap-3 items-center">
              <span className="text-xs text-muted">Step {step} of 5</span>
              {step === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !isConnected || isLoading}
                  className="px-6 py-2.5 text-background rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {isLoading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating...</>
                  ) : (
                    <>Create Identity<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></>
                  )}
                </button>
              ) : step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 2 && !formData.name}
                  className="px-6 py-2.5 text-background rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Next<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              ) : (
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2.5 text-background rounded-xl font-bold hover:opacity-90 transition-all duration-300 hover:scale-105 text-sm"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
