'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  Wallet, 
  Plus, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Trash2,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';

const WalletsPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock wallet data - would come from blockchain/API
  const wallets = [
    {
      id: 1,
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      name: 'Main Trading Wallet',
      balance: '2.45 ETH',
      balanceUSD: '$4,890',
      status: 'active',
      lastActivity: '2 hours ago',
      networks: ['Ethereum', 'Polygon', 'Arbitrum'],
      isVerified: true
    },
    {
      id: 2,
      address: '0x8ba1f109551bD432803012645Hac136c772c3c7c',
      name: 'DAO Contributions',
      balance: '1,250 USDC',
      balanceUSD: '$1,250',
      status: 'active',
      lastActivity: '1 day ago',
      networks: ['Ethereum', 'Optimism'],
      isVerified: true
    },
    {
      id: 3,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Staking Wallet',
      balance: '500 SOL',
      balanceUSD: '$45,000',
      status: 'inactive',
      lastActivity: '1 week ago',
      networks: ['Solana'],
      isVerified: false
    }
  ];

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before managing wallets
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-16 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          } shadow-lg`}
        >
          <Activity className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <SimpleSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Wallet Management
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage your connected wallets and track balances across networks
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Wallet
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Wallets</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{wallets.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Active Wallets</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {wallets.filter(w => w.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Balance</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$51,140</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Networks</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Wallets List */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Connected Wallets
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {wallet.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wallet.status)}`}>
                          {getStatusIcon(wallet.status)}
                          <span className="ml-1 capitalize">{wallet.status}</span>
                        </div>
                        {wallet.isVerified && (
                          <div className="flex items-center text-green-600">
                            <Shield className="w-4 h-4 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Address:</span>
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </span>
                          <button
                            onClick={() => copyAddress(wallet.address)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                          >
                            <Copy className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Balance:</span>
                          <span className="font-medium text-slate-900 dark:text-white">{wallet.balance}</span>
                          <span className="text-sm text-slate-500">({wallet.balanceUSD})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Networks:</span>
                          <div className="flex space-x-1">
                            {wallet.networks.map((network, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {network}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Last Activity:</span>
                          <span className="text-sm text-slate-500">{wallet.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsPage;
