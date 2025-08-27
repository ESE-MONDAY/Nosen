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
  TrendingUp,
  Search,
  X,
  ChevronRight,
  Globe,
  Building,
  Zap
} from 'lucide-react';

const WalletsPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Wallet connection options inspired by Koinly
  const walletOptions = {
    popular: [
      { id: 'metamask', name: 'MetaMask', logo: '🦊', category: 'wallets', description: 'Browser extension wallet' },
      { id: 'rainbow', name: 'Rainbow', logo: '🌈', category: 'wallets', description: 'Mobile wallet app' },
      { id: 'coinbase', name: 'Coinbase Wallet', logo: '🪙', category: 'wallets', description: 'Exchange wallet' },
      { id: 'trust', name: 'Trust Wallet', logo: '🛡️', category: 'wallets', description: 'Mobile wallet' },
      { id: 'phantom', name: 'Phantom', logo: '👻', category: 'wallets', description: 'Solana wallet' }
    ],
    all: [
      // Wallets
      { id: 'metamask', name: 'MetaMask', logo: '🦊', category: 'wallets', description: 'Browser extension wallet' },
      { id: 'rainbow', name: 'Rainbow', logo: '🌈', category: 'wallets', description: 'Mobile wallet app' },
      { id: 'coinbase', name: 'Coinbase Wallet', logo: '🪙', category: 'wallets', description: 'Exchange wallet' },
      { id: 'trust', name: 'Trust Wallet', logo: '🛡️', category: 'wallets', description: 'Mobile wallet' },
      { id: 'phantom', name: 'Phantom', logo: '👻', category: 'wallets', description: 'Solana wallet' },
      { id: 'imtoken', name: 'imToken', logo: '🔐', category: 'wallets', description: 'Mobile wallet' },
      { id: 'argent', name: 'Argent', logo: '🦄', category: 'wallets', description: 'Smart contract wallet' },
      { id: 'gnosis', name: 'Gnosis Safe', logo: '🛡️', category: 'wallets', description: 'Multi-sig wallet' },
      
      // Exchanges
      { id: 'binance', name: 'Binance', logo: '🟡', category: 'exchanges', description: 'Centralized exchange' },
      { id: 'coinbase', name: 'Coinbase', logo: '🪙', category: 'exchanges', description: 'Centralized exchange' },
      { id: 'kraken', name: 'Kraken', logo: '🐙', category: 'exchanges', description: 'Centralized exchange' },
      { id: 'kucoin', name: 'KuCoin', logo: '🔵', category: 'exchanges', description: 'Centralized exchange' },
      { id: 'okx', name: 'OKX', logo: '⚫', category: 'exchanges', description: 'Centralized exchange' },
      
      // Blockchains
      { id: 'ethereum', name: 'Ethereum', logo: '🔷', category: 'blockchains', description: 'Smart contract platform' },
      { id: 'polygon', name: 'Polygon', logo: '🟣', category: 'blockchains', description: 'Layer 2 scaling' },
      { id: 'arbitrum', name: 'Arbitrum', logo: '🔵', category: 'blockchains', description: 'Layer 2 scaling' },
      { id: 'optimism', name: 'Optimism', logo: '🟠', category: 'blockchains', description: 'Layer 2 scaling' },
      { id: 'solana', name: 'Solana', logo: '🟢', category: 'blockchains', description: 'High-performance blockchain' },
      { id: 'avalanche', name: 'Avalanche', logo: '🔴', category: 'blockchains', description: 'DeFi platform' },
      
      // Services
      { id: 'uniswap', name: 'Uniswap', logo: '🦄', category: 'services', description: 'DEX protocol' },
      { id: 'aave', name: 'Aave', logo: '👻', category: 'services', description: 'Lending protocol' },
      { id: 'compound', name: 'Compound', logo: '🔷', category: 'services', description: 'Lending protocol' },
      { id: 'curve', name: 'Curve', logo: '📈', category: 'services', description: 'Stablecoin DEX' },
      { id: 'balancer', name: 'Balancer', logo: '⚖️', category: 'services', description: 'AMM protocol' }
    ]
  };

  const categories = [
    { id: 'all', name: 'All', count: walletOptions.all.length },
    { id: 'wallets', name: 'Wallets', count: walletOptions.all.filter(w => w.category === 'wallets').length },
    { id: 'exchanges', name: 'Exchanges', count: walletOptions.all.filter(w => w.category === 'exchanges').length },
    { id: 'blockchains', name: 'Blockchains', count: walletOptions.all.filter(w => w.category === 'blockchains').length },
    { id: 'services', name: 'Services', count: walletOptions.all.filter(w => w.category === 'services').length }
  ];

  const filteredOptions = walletOptions.all.filter(option => {
    const matchesCategory = selectedCategory === 'all' || option.category === selectedCategory;
    const matchesSearch = option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleAddWallet = (walletOption: any) => {
    console.log('Adding wallet:', walletOption);
    // Here you would implement the actual wallet connection logic
    setShowAddWallet(false);
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
                <button 
                  onClick={() => setShowAddWallet(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
                >
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

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Add your wallets
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Connect your cryptocurrency wallets and exchanges
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddWallet(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Paste your wallet address or search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm transition-colors ${
                    theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex space-x-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Popular Section */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  POPULAR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {walletOptions.popular.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAddWallet(option)}
                      className={`p-4 rounded-lg border text-left transition-colors hover:border-emerald-300 hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{option.logo}</div>
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {option.name}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Section */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  ALL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAddWallet(option)}
                      className={`p-4 rounded-lg border text-left transition-colors hover:border-emerald-300 hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{option.logo}</div>
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {option.name}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
