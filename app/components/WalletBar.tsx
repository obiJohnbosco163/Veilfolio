'use client';

import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { sfx, isSoundEnabled, setSoundEnabled } from '@/lib/sounds';

function SoundToggle() {
  const [on, setOn] = useState(isSoundEnabled());

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) sfx.pop();
  };

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-150"
      title={on ? 'Mute sounds' : 'Enable sounds'}
      aria-label="Toggle sound effects"
      aria-pressed={on}
    >
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        {!on && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" className="text-danger" />
        )}
      </svg>
    </button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const cycle = () => {
    const order: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % 3]);
    sfx.click();
  };

  return (
    <button
      onClick={cycle}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-150"
      title={`Theme: ${theme}${theme === 'system' ? ` (${resolvedTheme})` : ''}`}
    >
      {theme === 'system' ? (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) : resolvedTheme === 'dark' ? (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

export function WalletBar() {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shortenedAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <nav className={`sticky top-0 z-50 glass border-b border-card-border/50 transition-[background-color,box-shadow,border-color] duration-300 ${scrolled ? 'bar-elevated' : ''}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-accent/30 group-hover:ring-accent/60 transition-all duration-300">
            <Image src="/logo.png" alt="Veilfolio" fill className="object-cover" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block tracking-tight">Veilfolio</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className="hidden sm:block px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-muted hover:text-foreground rounded-lg transition-all duration-200 hover:bg-white/5">
            Dashboard
          </Link>
          <Link href="/privacy" className="hidden sm:block px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-muted hover:text-foreground rounded-lg transition-all duration-200 hover:bg-white/5">
            Privacy
          </Link>

          <SoundToggle />
          <ThemeToggle />

          {isConnected && address ? (
            <div className="flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2">
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs sm:text-sm font-mono text-foreground bg-surface rounded-lg border border-card-border">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="hidden sm:inline">{shortenedAddress}</span>
                <span className="sm:hidden">{address?.slice(0, 4)}...{address?.slice(-2)}</span>
              </div>
              <button
                onClick={() => { sfx.disconnect(); disconnect(); }}
                className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors duration-150 min-h-[44px]"
              >
                <span className="hidden sm:inline">Disconnect</span>
                <svg className="sm:hidden w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5 ml-1 sm:ml-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => { if (!isPending) { sfx.connect(); connect({ connector }); } }}
                  disabled={isPending}
                  className="press-scale px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-background rounded-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px]"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  {isPending ? '...' : connector.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
