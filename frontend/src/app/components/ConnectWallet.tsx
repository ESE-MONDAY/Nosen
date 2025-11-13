'use client';

import React from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useTheme } from '../contexts/ThemeContext';

const ConnectWallet: React.FC = () => {
  const { theme } = useTheme();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        type="button"
        className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
          theme === 'dark'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 7v12c0 1.1.9 2 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0-2 2v4h-4v-4a2 2 0 0 0-4 0v4H4v-4a2 2 0 0 0-2-2" />
        </svg>
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => open({ view: 'Networks' })}
        type="button"
        className={`px-3 py-2 rounded-lg font-medium transition-all ${
          theme === 'dark'
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
        }`}
      >
        Lisk Sepolia
      </button>

      <button
        onClick={() => open({ view: 'Account' })}
        type="button"
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          theme === 'dark'
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
        }`}
      >
        {address && formatAddress(address)}
      </button>
    </div>
  );
};

export default ConnectWallet;
