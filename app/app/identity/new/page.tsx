'use client';

import { useRouter } from 'next/navigation';
import { usePortfolio, type IdentityType } from '@/context/PortfolioContext';
import { WalletBar } from '@/components/WalletBar';
import { useState } from 'react';

const IDENTITY_TYPES: { value: IdentityType; label: string; description: string }[] = [
  { value: 'TRADING', label: 'Trading', description: 'Short-term trading strategies' },
  { value: 'DEFI', label: 'DeFi', description: 'Decentralized finance interactions' },
  { value: 'YIELD', label: 'Yield', description: 'Yield farming and staking' },
  { value: 'LONG_TERM', label: 'Long-Term', description: 'Long-term holdings' },
  { value: 'APP', label: 'App', description: 'Application-specific context' },
  { value: 'VENUE', label: 'Venue', description: 'Venue or exchange specific' },
  { value: 'STRATEGY', label: 'Strategy', description: 'Custom strategy execution' },
  { value: 'CUSTOM', label: 'Custom', description: 'Custom portfolio context' },
];

export default function CreateIdentityPage() {
  const router = useRouter();
  const { createIdentity } = usePortfolio();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'TRADING' as IdentityType,
    purpose: '',
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    createIdentity({
      name: formData.name,
      type: formData.type,
      purpose: formData.purpose,
      balance: '0',
      allocation: 0,
      pnl: 0,
      riskScore: 'LOW',
      privacyStatus: 'INACTIVE',
      recentActivity: [],
    });

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletBar />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Step 1: Choose Purpose */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What is this identity for?</h2>
              <p className="text-gray-600 mb-8">Choose a category that best describes this execution context</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IDENTITY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 text-left rounded-lg border-2 transition ${
                      formData.type === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Name the Identity */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Name this execution identity</h2>
              <p className="text-gray-600 mb-8">Choose a descriptive name for this private context</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Identity Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Private Trading, DeFi Alpha, Long-Term Holdings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Describe the strategy or purpose of this identity..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* Step 3: Privacy Explanation */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Understanding Privacy</h2>
              <p className="text-gray-600 mb-6">Your private execution context uses STRK20 to separate activity</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4">How This Identity Stays Private</h3>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>This identity is designed to keep its activity separate from your other execution contexts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Transactions within this identity use STRK20 shielding where supported</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Only you can see the portfolio mapping of these identities</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">!</span>
                    <span>Deposit and withdrawal transactions remain visible on the public blockchain as ERC-20 transfers</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Privacy guarantees depend on the underlying STRK20 flow. Learn more in the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Center</a>
              </p>
            </div>
          )}

          {/* Step 4: Initialize Privacy */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Initialize Private Execution Context</h2>
              <p className="text-gray-600 mb-8">Prepare this identity for private operations on STRK20</p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-900 font-semibold mb-4">✓ Ready to create execution context</p>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Execution context will be stored locally on your device</li>
                  <li>• No private keys are ever shared with our servers</li>
                  <li>• Your identity data is encrypted in your browser</li>
                  <li>• You can export and manage your identities</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Private Execution Context Ready</h2>
              <p className="text-gray-600 mb-8">Your identity is prepared and waiting for first use</p>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Identity Name</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-lg font-semibold text-green-600">Ready for Funding</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Your next step: Fund this identity using STRK20 to begin private operations
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Back
            </button>

            <div className="flex gap-2">
              <span className="flex items-center text-sm text-gray-600">
                Step {step} of 5
              </span>
              <button
                onClick={step === 5 ? handleSubmit : handleNext}
                disabled={step === 2 && !formData.name}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {step === 5 ? 'Create Identity' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
