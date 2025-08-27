'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  Calculator, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Activity,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  Shield,
  Globe,
  Building,
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';

const TaxCompliancePage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [reportForm, setReportForm] = useState({
    jurisdiction: 'United States',
    taxYear: '2024',
    period: 'Q4',
    includeNetworks: true,
    includeSources: true
  });

  // Mock tax compliance data - would come from API
  const taxReports = [
    {
      id: 1,
      title: 'Q4 2024 Tax Report - United States',
      jurisdiction: 'United States',
      taxYear: '2024',
      period: 'Q4',
      status: 'completed',
      generatedAt: '2024-12-15T10:30:00Z',
      dueDate: '2025-01-31T23:59:59Z',
      totalIncome: 12500,
      currency: 'USD',
      taxableIncome: 11250,
      estimatedTax: 2250,
      networks: ['Ethereum', 'Polygon', 'Solana'],
      incomeSources: ['Phala Network', 'Gitcoin Grants', 'Uniswap DAO', 'Superteam'],
      documentHash: 'Qm1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isVerified: true,
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 2,
      title: 'Annual Tax Report 2024 - Germany',
      jurisdiction: 'Germany',
      taxYear: '2024',
      period: 'Annual',
      status: 'pending',
      generatedAt: '2024-12-10T14:20:00Z',
      dueDate: '2025-05-31T23:59:59Z',
      totalIncome: 18000,
      currency: 'EUR',
      taxableIncome: 16200,
      estimatedTax: 3240,
      networks: ['Ethereum', 'Polygon'],
      incomeSources: ['Phala Network', 'Uniswap DAO'],
      documentHash: 'Qmabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      isVerified: false,
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 3,
      title: 'Q3 2024 Tax Report - Singapore',
      jurisdiction: 'Singapore',
      taxYear: '2024',
      period: 'Q3',
      status: 'completed',
      generatedAt: '2024-10-15T16:45:00Z',
      dueDate: '2024-11-30T23:59:59Z',
      totalIncome: 8500,
      currency: 'SGD',
      taxableIncome: 7650,
      estimatedTax: 765,
      networks: ['Ethereum', 'Solana'],
      incomeSources: ['Superteam', 'Gitcoin Grants'],
      documentHash: 'Qm7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      isVerified: true,
      downloadUrl: '#',
      viewUrl: '#'
    }
  ];

  const jurisdictions = [
    { id: 'all', name: 'All Jurisdictions', count: taxReports.length },
    { id: 'United States', name: 'United States', count: taxReports.filter(r => r.jurisdiction === 'United States').length },
    { id: 'Germany', name: 'Germany', count: taxReports.filter(r => r.jurisdiction === 'Germany').length },
    { id: 'Singapore', name: 'Singapore', count: taxReports.filter(r => r.jurisdiction === 'Singapore').length },
    { id: 'United Kingdom', name: 'United Kingdom', count: 0 },
    { id: 'Canada', name: 'Canada', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'overdue':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getJurisdictionIcon = (jurisdiction: string) => {
    switch (jurisdiction) {
      case 'United States':
        return '🇺🇸';
      case 'Germany':
        return '🇩🇪';
      case 'Singapore':
        return '🇸🇬';
      case 'United Kingdom':
        return '🇬🇧';
      case 'Canada':
        return '🇨🇦';
      default:
        return '🌍';
    }
  };

  const filteredReports = taxReports.filter(report => {
    const matchesFilter = selectedFilter === 'all' || report.jurisdiction === selectedFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCompletedReports = taxReports.filter(r => r.status === 'completed').length;
  const totalPendingReports = taxReports.filter(r => r.status === 'pending').length;
  const totalTaxLiability = taxReports
    .filter(r => r.status === 'completed')
    .reduce((sum, report) => sum + report.estimatedTax, 0);

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before managing tax compliance
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
                  Tax Compliance
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage tax calculations, reporting, and compliance across different jurisdictions
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setShowGenerateReport(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Tax Report
                </button>
              </div>
            </div>
          </div>

          {/* Tax Compliance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Reports</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{taxReports.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Completed</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalCompletedReports}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Pending</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalPendingReports}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Tax Liability</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalTaxLiability.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Filter by:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              >
                {jurisdictions.map(jurisdiction => (
                  <option key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name} ({jurisdiction.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tax reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors w-64 ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Tax Reports List */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Tax Reports
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{getJurisdictionIcon(report.jurisdiction)}</span>
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {report.title}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status}</span>
                        </div>
                        {report.isVerified && (
                          <div className="flex items-center text-green-600">
                            <Shield className="w-4 h-4 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Jurisdiction:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{report.jurisdiction}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total Income:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {report.totalIncome.toLocaleString()} {report.currency}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Taxable Income:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {report.taxableIncome.toLocaleString()} {report.currency}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Estimated Tax:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {report.estimatedTax.toLocaleString()} {report.currency}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Generated:</span>
                          <span className="text-sm text-slate-500">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Due Date:</span>
                          <span className="text-sm text-slate-500">
                            {new Date(report.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Period:</span>
                          <span className="text-sm text-slate-500">{report.period}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Networks:</span>
                          <div className="flex space-x-1">
                            {report.networks.map((network, index) => (
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
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Income Sources:</span>
                          <div className="flex space-x-1">
                            {report.incomeSources.map((source, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Document Hash:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {report.documentHash.slice(0, 10)}...{report.documentHash.slice(-8)}
                          </span>
                          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                            <ExternalLink className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <Download className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <Edit3 className="w-4 h-4 text-slate-500" />
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

      {/* Generate Report Modal */}
      {showGenerateReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Generate Tax Report
                </h2>
                <button
                  onClick={() => setShowGenerateReport(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Jurisdiction
                  </label>
                  <select
                    value={reportForm.jurisdiction}
                    onChange={(e) => setReportForm({...reportForm, jurisdiction: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <option value="United States">United States</option>
                    <option value="Germany">Germany</option>
                    <option value="Singapore">Singapore</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Tax Year
                  </label>
                  <select
                    value={reportForm.taxYear}
                    onChange={(e) => setReportForm({...reportForm, taxYear: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Period
                  </label>
                  <select
                    value={reportForm.period}
                    onChange={(e) => setReportForm({...reportForm, period: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Report Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportForm.includeNetworks}
                        onChange={(e) => setReportForm({...reportForm, includeNetworks: e.target.checked})}
                        className="mr-2"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        Include network breakdown
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportForm.includeSources}
                        onChange={(e) => setReportForm({...reportForm, includeSources: e.target.checked})}
                        className="mr-2"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        Include income sources
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'border-blue-600 bg-blue-900/30' : 'border-blue-300 bg-blue-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    Report Summary
                  </span>
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  This will generate a {reportForm.period} {reportForm.taxYear} tax report for {reportForm.jurisdiction} 
                  {reportForm.includeNetworks && ', including network breakdowns'} 
                  {reportForm.includeSources && ', including income source details'}.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowGenerateReport(false)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would implement the actual report generation
                  console.log('Generating report with:', reportForm);
                  setShowGenerateReport(false);
                  // Redirect to reports page or show success message
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCompliancePage;
