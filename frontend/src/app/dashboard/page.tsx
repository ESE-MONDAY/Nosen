'use client'
import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Shield, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  Globe,
  Link,
  Edit3,
  Filter,
  Search,
  User,
  ChevronDown,
  ExternalLink,
  Target,
  Menu
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProfile } from '../contexts/ProfileContext';
import SimpleSidebar from '../components/SimpeSidebar';


const NosenDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { profile, hasProfile, isLoading } = useProfile();

  // Mock data - would come from API/blockchain
  const incomeStats = {
    totalMonthly: 4200,
    totalYearly: 48600,
    verifiedSources: 3,
    complianceScore: 85,
    documentsGenerated: 12,
    taxLiability: 8900
  };

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
      transactions: 8
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
      transactions: 6
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
      transactions: 3
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      date: '2024-12-15',
      source: 'Phala Network',
      amount: 2500,
      token: 'USDC',
      status: 'labeled',
      type: 'Monthly Salary',
      txHash: '0xabc123...'
    },
    {
      id: 2,
      date: '2024-12-12',
      source: 'Superteam',
      amount: 500,
      token: 'SOL',
      status: 'unlabeled',
      type: null,
      txHash: '0xdef456...'
    },
    {
      id: 3,
      date: '2024-12-10',
      source: 'Gitcoin Grants',
      amount: 1200,
      token: 'ETH',
      status: 'labeled',
      type: 'Grant Review Payment',
      txHash: '0xghi789...'
    }
  ];

  const documents = [
    {
      id: 1,
      type: 'Payslip',
      period: 'December 2024',
      status: 'ready',
      createdAt: '2024-12-16',
      useCase: 'Visa Application'
    },
    {
      id: 2,
      type: 'Income Verification',
      period: 'Q4 2024',
      status: 'ready',
      createdAt: '2024-12-15',
      useCase: 'Bank Loan'
    },
    {
      id: 3,
      type: 'Tax Report',
      period: '2024 Annual',
      status: 'generating',
      createdAt: '2024-12-16',
      useCase: 'Tax Filing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return theme === 'dark' ? 'text-green-400 bg-green-900/30 border-green-700' : 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return theme === 'dark' ? 'text-yellow-400 bg-yellow-900/30 border-yellow-700' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unlabeled': return theme === 'dark' ? 'text-red-400 bg-red-900/30 border-red-700' : 'text-red-600 bg-red-50 border-red-200';
      case 'ready': return theme === 'dark' ? 'text-blue-400 bg-blue-900/30 border-blue-700' : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'generating': return theme === 'dark' ? 'text-orange-400 bg-orange-900/30 border-orange-700' : 'text-orange-600 bg-orange-50 border-orange-200';
      default: return theme === 'dark' ? 'text-slate-400 bg-slate-900/30 border-slate-700' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'unlabeled': return <AlertCircle className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'generating': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding for users without profile
  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            } border-2 border-dashed border-slate-400`}>
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Welcome to Nosen! 🎉
            </h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You&apos;re almost ready to start managing your Web3 income. Let&apos;s set up your profile.
            </p>
            
            <div className={`p-8 rounded-xl border max-w-2xl mx-auto ${
              theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Complete Your Profile Setup
              </h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                To get started, you&apos;ll need to:
              </p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    1
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Create Your ENS Subdomain
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Choose a unique username.nosen.eth identity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    2
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Add Income Sources
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Connect your Web3 income streams and employers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    3
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Generate Documents
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Create professional income verification documents
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => window.location.href = '/create-profile'}
                className={`mt-8 px-8 py-3 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Go to Profile Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main dashboard for users with profile
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
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <SimpleSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Welcome back, {profile?.displayName || 'User'}! 👋
                </h1>
                <p className={`mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Here&apos;s your Web3 income overview for December 2024
                </p>
                {profile && (
                  <div className={`mt-3 p-3 rounded-lg border ${theme === 'dark' ? 'border-blue-600/30 bg-blue-900/20' : 'border-blue-300 bg-blue-50'}`}>
                    <div className="flex items-center space-x-2">
                      <Link className="w-4 h-4 text-blue-600" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                        Your ENS Identity:
                      </span>
                      <span className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                        {profile.ensName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 3 months</option>
                  <option value="365d">Last year</option>
                </select>
                
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Monthly Income</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${incomeStats.totalMonthly.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Verified Sources</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{incomeStats.verifiedSources}</p>
                  <p className="text-xs text-blue-600 mt-1">All income streams active</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Compliance Score</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{incomeStats.complianceScore}%</p>
                  <p className="text-xs text-orange-600 mt-1">Needs tax filing update</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Documents Ready</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{incomeStats.documentsGenerated}</p>
                  <p className="text-xs text-slate-500 mt-1">Last generated today</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            {/* ENS Identity Card */}
            <div className={`rounded-xl p-6 border hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>ENS Identity</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {hasProfile ? profile?.ensName.split('.')[0] : 'Not Set'}
                  </p>
                  <p className={`text-xs mt-1 ${hasProfile ? 'text-green-600' : 'text-slate-500'}`}>
                    {hasProfile ? 'Active & Verified' : 'Setup Required'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  hasProfile ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <Link className={`w-6 h-6 ${hasProfile ? 'text-blue-600' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Income Streams */}
            <div className="lg:col-span-2 space-y-6">
              {/* ENS Identity Card */}
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border-emerald-700' : 'bg-gradient-to-r from-blue-50 to-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Link className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Professional ENS Identity</h3>
                      <p className="text-emerald-600 font-mono text-sm">{profile?.ensName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      Verified
                    </span>
                    <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'}`}>
                      <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Income Streams */}
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Income Streams</h2>
                    <button className={`px-4 py-2 text-emerald-600 rounded-lg transition-colors flex items-center text-sm font-medium ${theme === 'dark' ? 'hover:bg-emerald-900/30' : 'hover:bg-emerald-50'}`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stream
                    </button>
                  </div>
                </div>

                <div className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {incomeStreams.map((stream) => (
                    <div key={stream.id} className={`p-6 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stream.source}</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{stream.role}</p>
                            {stream.ensVerification && (
                              <p className="text-xs text-blue-600 font-mono mt-1">{stream.ensVerification}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            ${stream.monthlyAmount.toLocaleString()} {stream.token}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stream.frequency}</p>
                          <div className="flex items-center justify-end mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(stream.status)}`}>
                              {getStatusIcon(stream.status)}
                              <span className="capitalize">{stream.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-4 flex items-center justify-between text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>Last payment: {stream.lastPayment}</span>
                        <span>{stream.transactions} transactions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h2>
                    <div className="flex items-center space-x-2">
                      <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                        <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className={`p-6 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tx.source}</h4>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                              {tx.type || 'Unlabeled transaction'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            ${tx.amount.toLocaleString()} {tx.token}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{tx.date}</p>
                          <div className="flex items-center justify-end mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(tx.status)}`}>
                              {getStatusIcon(tx.status)}
                              <span className="capitalize">{tx.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {tx.status === 'unlabeled' && (
                        <div className={`mt-3 p-3 rounded-lg border ${theme === 'dark' ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'}`}>This transaction needs labeling for compliance</span>
                            <button className={`text-xs font-medium flex items-center ${theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-800'}`}>
                              <Edit3 className="w-3 h-3 mr-1" />
                              Label Now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Actions & Documents */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${theme === 'dark' ? 'bg-emerald-900/30 hover:bg-emerald-900/50' : 'bg-emerald-50 hover:bg-emerald-100'}`}>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Generate Payslip</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>For visa or loan application</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 rotate-[-90deg] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`} />
                  </button>

                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${theme === 'dark' ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50 hover:bg-blue-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Verify Income</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Get employer attestation</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 rotate-[-90deg] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`} />
                  </button>

                  <button className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${theme === 'dark' ? 'bg-orange-900/30 hover:bg-orange-900/50' : 'bg-orange-50 hover:bg-orange-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tax Compliance</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Update tax information</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 rotate-[-90deg] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Generate Reports */}
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Generate Reports</h3>
                    <button 
                      onClick={() => window.location.href = '/dashboard/reports'}
                      className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Generate New Report
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => window.location.href = '/dashboard/documents'}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Income Verification</h4>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Generate documents for visas, loans, employment</p>
                    </div>
                    
                    <div 
                      onClick={() => window.location.href = '/dashboard/tax-compliance'}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tax Reports</h4>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Create tax compliance reports for multiple jurisdictions</p>
                    </div>
                    
                    <div 
                      onClick={() => window.location.href = '/dashboard/reports'}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                        <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Analytics Reports</h4>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>View income trends and comprehensive analytics</p>
                    </div>
                    
                    <div 
                      onClick={() => window.location.href = '/dashboard/employer-verification'}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-orange-600" />
                        </div>
                        <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Employer Reports</h4>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Generate employer verification documents</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recent Documents</h3>
                    <button className={`text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>View all</button>
                  </div>
                </div>

                <div className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {documents.map((doc) => (
                    <div key={doc.id} className={`p-4 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{doc.type}</h4>
                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{doc.period}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                            {doc.status === 'ready' ? 'Ready' : 'Processing'}
                          </span>
                          {doc.status === 'ready' && (
                            <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                              <Download className={`w-3 h-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>For: {doc.useCase}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Status */}
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Compliance Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Income Documentation</span>
                    <span className="text-sm font-medium text-green-600">Complete</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>ENS Verification</span>
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Tax Filing Status</span>
                    <span className="text-sm font-medium text-orange-600">Pending</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Employer Attestation</span>
                    <span className="text-sm font-medium text-blue-600">2/3 Complete</span>
                  </div>

                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Overall Score</span>
                      <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{incomeStats.complianceScore}%</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${incomeStats.complianceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NosenDashboard;