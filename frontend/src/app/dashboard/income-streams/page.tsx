'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  DollarSign, 
  Plus, 
  Building, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Edit3,
  Trash2,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

const IncomeStreamsPage = () => {
  const { theme } = useTheme();
  const { hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock income streams data - would come from blockchain/API
  const incomeStreams = [
    {
      id: 1,
      source: 'Phala Network',
      role: 'DevRel Contributor',
      monthlyAmount: 2500,
      token: 'USDC',
      status: 'verified',
      lastPayment: '2024-12-15',
      frequency: 'Monthly',
      ensVerification: 'john.contributors.phala.eth',
      transactions: 8,
      network: 'Ethereum',
      startDate: '2024-01-15',
      isRecurring: true
    },
    {
      id: 2,
      source: 'Gitcoin Grants',
      role: 'Grant Reviewer',
      monthlyAmount: 1200,
      token: 'ETH',
      status: 'verified',
      lastPayment: '2024-12-10',
      frequency: 'Monthly',
      ensVerification: null,
      transactions: 6,
      network: 'Ethereum',
      startDate: '2024-03-01',
      isRecurring: true
    },
    {
      id: 3,
      source: 'Superteam',
      role: 'Content Creator',
      monthlyAmount: 500,
      token: 'SOL',
      status: 'pending',
      lastPayment: '2024-12-12',
      frequency: 'Project-based',
      ensVerification: null,
      transactions: 3,
      network: 'Solana',
      startDate: '2024-11-01',
      isRecurring: false
    },
    {
      id: 4,
      source: 'Uniswap DAO',
      role: 'Governance Contributor',
      monthlyAmount: 800,
      token: 'UNI',
      status: 'verified',
      lastPayment: '2024-12-08',
      frequency: 'Monthly',
      ensVerification: 'john.governance.uniswap.eth',
      transactions: 12,
      network: 'Ethereum',
      startDate: '2024-02-01',
      isRecurring: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'unverified':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'unverified':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredStreams = selectedFilter === 'all' 
    ? incomeStreams 
    : incomeStreams.filter(stream => stream.status === selectedFilter);

  const totalMonthlyIncome = incomeStreams
    .filter(stream => stream.status === 'verified')
    .reduce((sum, stream) => sum + stream.monthlyAmount, 0);

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before managing income streams
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
                  Income Streams
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage and track your Web3 income sources across different protocols
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Income Stream
                </button>
              </div>
            </div>
          </div>

          {/* Income Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Monthly Income</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalMonthlyIncome.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Active Streams</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {incomeStreams.filter(s => s.status === 'verified').length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">All verified</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Transactions</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {incomeStreams.reduce((sum, stream) => sum + stream.transactions, 0)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Networks</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {new Set(incomeStreams.map(s => s.network)).size}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Multi-chain</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Filter by:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              >
                <option value="all">All Streams</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Income Streams List */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Income Sources
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredStreams.map((stream) => (
                <div key={stream.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {stream.source}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
                          {getStatusIcon(stream.status)}
                          <span className="ml-1 capitalize">{stream.status}</span>
                        </div>
                        {stream.isRecurring && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            Recurring
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Role:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{stream.role}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Amount:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {stream.monthlyAmount.toLocaleString()} {stream.token}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Frequency:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{stream.frequency}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Network:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{stream.network}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Started: {new Date(stream.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Transactions:</span>
                          <span className="font-medium text-slate-900 dark:text-white">{stream.transactions}</span>
                        </div>
                        
                        {stream.ensVerification && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">{stream.ensVerification}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <Edit3 className="w-4 h-4 text-slate-500" />
                      </button>
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

export default IncomeStreamsPage;
