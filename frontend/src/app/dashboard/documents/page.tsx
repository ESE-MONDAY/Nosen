'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  FileText, 
  Download, 
  Plus, 
  Search, 
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
  Building
} from 'lucide-react';

const DocumentsPage = () => {
  const { theme } = useTheme();
  const { hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  // Mock documents data - would come from generated income verification docs
  const documents = [
    {
      id: 1,
      title: 'Income Verification Letter - Q4 2024',
      type: 'income_verification',
      purpose: 'Visa Application',
      status: 'generated',
      generatedAt: '2024-12-15T10:30:00Z',
      validUntil: '2025-03-15T10:30:00Z',
      incomeAmount: 12500,
      currency: 'USD',
      period: 'Q4 2024',
      networks: ['Ethereum', 'Polygon'],
      sources: ['Phala Network', 'Gitcoin Grants', 'Uniswap DAO'],
      documentHash: 'Qm1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isVerified: true,
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 2,
      title: 'Employment Verification - DevRel Role',
      type: 'employment_verification',
      purpose: 'Job Application',
      status: 'pending',
      generatedAt: '2024-12-10T14:20:00Z',
      validUntil: '2025-03-10T14:20:00Z',
      incomeAmount: 8000,
      currency: 'USD',
      period: 'Q4 2024',
      networks: ['Ethereum'],
      sources: ['Phala Network'],
      documentHash: 'Qmabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      isVerified: false,
      downloadUrl: '#',
      viewUrl: '#'
    },
    {
      id: 3,
      title: 'Loan Application - Income Proof',
      type: 'loan_application',
      purpose: 'Bank Loan',
      status: 'generated',
      generatedAt: '2024-12-08T16:45:00Z',
      validUntil: '2025-03-08T16:45:00Z',
      incomeAmount: 15000,
      currency: 'USD',
      period: 'Q4 2024',
      networks: ['Ethereum', 'Solana'],
      sources: ['Phala Network', 'Superteam', 'Uniswap DAO'],
      documentHash: 'Qm7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      isVerified: true,
      downloadUrl: '#',
      viewUrl: '#'
    }
  ];

  const documentTypes = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'income_verification', name: 'Income Verification', count: documents.filter(d => d.type === 'income_verification').length },
    { id: 'employment_verification', name: 'Employment Verification', count: documents.filter(d => d.type === 'employment_verification').length },
    { id: 'loan_application', name: 'Loan Application', count: documents.filter(d => d.type === 'loan_application').length },
    { id: 'tax_documentation', name: 'Tax Documentation', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'expired':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income_verification':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'employment_verification':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'loan_application':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalGeneratedDocuments = documents.filter(d => d.status === 'generated').length;
  const totalVerifiedDocuments = documents.filter(d => d.isVerified).length;
  const totalIncomeAmount = documents
    .filter(d => d.status === 'generated')
    .reduce((sum, doc) => sum + doc.incomeAmount, 0);

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before generating documents
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
                  Income Verification Documents
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Generate and manage professional income verification documents for visas, loans, and employment
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Document
                </button>
              </div>
            </div>
          </div>

          {/* Document Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Documents</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{documents.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Generated</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalGeneratedDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Income</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalIncomeAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Verified</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalVerifiedDocuments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
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
                {documentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors w-64 ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Documents List */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Generated Documents
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getTypeIcon(doc.type)}
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {doc.title}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status}</span>
                        </div>
                        {doc.isVerified && (
                          <div className="flex items-center text-green-600">
                            <Shield className="w-4 h-4 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Purpose:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.purpose}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Income Amount:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            ${doc.incomeAmount.toLocaleString()} {doc.currency}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Period:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.period}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Networks:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.networks.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Generated:</span>
                          <span className="text-sm text-slate-500">
                            {new Date(doc.generatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Valid Until:</span>
                          <span className="text-sm text-slate-500">
                            {new Date(doc.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Sources:</span>
                          <div className="flex space-x-1">
                            {doc.sources.map((source, index) => (
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
                            {doc.documentHash.slice(0, 10)}...{doc.documentHash.slice(-8)}
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
    </div>
  );
};

export default DocumentsPage;
