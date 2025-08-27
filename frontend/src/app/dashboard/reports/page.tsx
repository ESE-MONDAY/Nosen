'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Eye,
  Filter,
  Search,
  Globe,
  Building,
  Wallet,
  FileText,
  PieChart,
  LineChart,
  Target,
  Zap
} from 'lucide-react';

const ReportsPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('income');

  // Mock analytics data - would come from API
  const analyticsData = {
    income: {
      total: 12500,
      change: 15.2,
      trend: 'up',
      breakdown: [
        { source: 'Phala Network', amount: 5000, percentage: 40 },
        { source: 'Gitcoin Grants', amount: 3000, percentage: 24 },
        { source: 'Uniswap DAO', amount: 2500, percentage: 20 },
        { source: 'Superteam', amount: 2000, percentage: 16 }
      ]
    },
    transactions: {
      total: 89,
      change: -5.8,
      trend: 'down',
      breakdown: [
        { network: 'Ethereum', count: 45, percentage: 50.6 },
        { network: 'Polygon', count: 25, percentage: 28.1 },
        { network: 'Solana', count: 19, percentage: 21.3 }
      ]
    },
    networks: {
      total: 5,
      change: 0,
      trend: 'stable',
      breakdown: [
        { network: 'Ethereum', income: 8000, percentage: 64 },
        { network: 'Polygon', income: 2500, percentage: 20 },
        { network: 'Solana', income: 2000, percentage: 16 }
      ]
    }
  };

  const reportTypes = [
    { id: 'income', name: 'Income Analysis', icon: DollarSign, description: 'Income trends and breakdowns' },
    { id: 'transactions', name: 'Transaction Report', icon: Activity, description: 'Transaction patterns and volumes' },
    { id: 'networks', name: 'Network Analysis', icon: Globe, description: 'Cross-chain income distribution' },
    { id: 'employers', name: 'Employer Report', icon: Building, description: 'Employer relationship insights' },
    { id: 'tax', name: 'Tax Summary', icon: FileText, description: 'Tax compliance overview' },
    { id: 'comprehensive', name: 'Comprehensive Report', icon: BarChart3, description: 'Complete platform overview' }
  ];

  const periods = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before viewing reports
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
                  Analytics & Reports
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Comprehensive insights into your Web3 income and professional activities
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Reports
                </button>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Time Period:</span>
              <div className="flex space-x-1">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedPeriod === period.id
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(analyticsData.income.trend)}`}>
                  {getTrendIcon(analyticsData.income.trend)}
                  <span className="text-sm font-medium">{analyticsData.income.change}%</span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${analyticsData.income.total.toLocaleString()}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Income
              </p>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(analyticsData.transactions.trend)}`}>
                  {getTrendIcon(analyticsData.transactions.trend)}
                  <span className="text-sm font-medium">{analyticsData.transactions.change}%</span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {analyticsData.transactions.total}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Transactions
              </p>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(analyticsData.networks.trend)}`}>
                  {getTrendIcon(analyticsData.networks.trend)}
                  <span className="text-sm font-medium">{analyticsData.networks.change}%</span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {analyticsData.networks.total}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Networks
              </p>
            </div>
          </div>

          {/* Report Types */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Available Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => {
                const IconComponent = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-6 rounded-xl border text-left transition-colors hover:border-emerald-300 hover:shadow-md ${
                      selectedReport === report.id
                        ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                        : theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-600' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {report.name}
                      </h3>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {report.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Report Content */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {reportTypes.find(r => r.id === selectedReport)?.name}
                </h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export Report
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedReport === 'income' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Income Breakdown
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.income.breakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                              {item.source}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                ${item.amount.toLocaleString()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Quick Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Average per source:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            ${(analyticsData.income.total / analyticsData.income.breakdown.length).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Top source:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {analyticsData.income.breakdown[0].source}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Growth rate:</span>
                          <span className={`font-medium ${getTrendColor(analyticsData.income.trend)}`}>
                            {analyticsData.income.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center space-x-2 text-slate-500">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Income visualization charts would be displayed here</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'transactions' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Network Distribution
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.transactions.breakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                              {item.network}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {item.count}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Transaction Insights
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Average per day:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {(analyticsData.transactions.total / 30).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Most active network:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {analyticsData.transactions.breakdown[0].network}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Trend:</span>
                          <span className={`font-medium ${getTrendColor(analyticsData.transactions.trend)}`}>
                            {analyticsData.transactions.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'networks' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Income by Network
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.networks.breakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                              {item.network}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                ${item.income.toLocaleString()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Network Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total networks:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {analyticsData.networks.total}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Primary network:</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {analyticsData.networks.breakdown[0].network}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Status:</span>
                          <span className={`font-medium ${getTrendColor(analyticsData.networks.trend)}`}>
                            {analyticsData.networks.trend === 'stable' ? 'Stable' : 'Growing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'comprehensive' && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Comprehensive Report
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      This report combines all analytics into a single comprehensive overview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
