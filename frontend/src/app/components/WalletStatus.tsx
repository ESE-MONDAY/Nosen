'use client';

import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Wallet } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const WalletStatus: React.FC = () => {
  const { theme } = useTheme();
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  if (!isConnected || !address) {
    return (
      <div className={`p-6 rounded-lg border-2 border-dashed ${
        theme === 'dark' 
          ? 'border-slate-600 text-slate-400' 
          : 'border-slate-300 text-slate-600'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          <Wallet className="w-6 h-6" />
          <span className="text-lg font-medium">No Wallet Connected</span>
        </div>
        <p className="text-center mt-2 text-sm opacity-75">
          Connect your wallet to view your status and balance
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border ${
      theme === 'dark' 
        ? 'border-slate-600 bg-slate-800' 
        : 'border-slate-300 bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Wallet Status
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          theme === 'dark' 
            ? 'bg-green-900 text-green-300' 
            : 'bg-green-100 text-green-800'
        }`}>
          Connected
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Address:
          </span>
          <span className={`font-mono text-sm ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Network:
          </span>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {chain?.name || 'Unknown'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Balance:
          </span>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
