'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Activity,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  Shield,
  UserCheck,
  Mail,
  Phone,
  Globe,
  DollarSign
} from 'lucide-react';

const EmployerVerificationPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmployer, setShowAddEmployer] = useState(false);

  // Mock employer verification data - would come from API
  const employers = [
    {
      id: 1,
      name: 'Phala Network',
      type: 'dao',
      status: 'verified',
      verificationDate: '2024-01-15T10:30:00Z',
      lastContact: '2024-12-15T10:30:00Z',
      contactPerson: 'Sarah Chen',
      email: 'hr@phala.network',
      phone: '+1 (555) 123-4567',
      website: 'https://phala.network',
      ensDomain: 'phala.eth',
      monthlyIncome: 2500,
      currency: 'USDC',
      networks: ['Ethereum', 'Polkadot'],
      verificationHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      isActive: true,
      documents: 3
    },
    {
      id: 2,
      name: 'Uniswap DAO',
      type: 'dao',
      status: 'verified',
      verificationDate: '2024-02-01T14:20:00Z',
      lastContact: '2024-12-08T16:45:00Z',
      contactPerson: 'Alex Rodriguez',
      email: 'governance@uniswap.org',
      phone: '+1 (555) 987-6543',
      website: 'https://uniswap.org',
      ensDomain: 'uniswap.eth',
      monthlyIncome: 800,
      currency: 'UNI',
      networks: ['Ethereum'],
      verificationHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      isActive: true,
      documents: 2
    },
    {
      id: 3,
      name: 'Superteam',
      type: 'company',
      status: 'pending',
      verificationDate: null,
      lastContact: '2024-12-12T09:15:00Z',
      contactPerson: 'Maria Garcia',
      email: 'verification@superteam.io',
      phone: '+1 (555) 456-7890',
      website: 'https://superteam.io',
      ensDomain: null,
      monthlyIncome: 500,
      currency: 'SOL',
      networks: ['Solana'],
      verificationHash: null,
      isActive: false,
      documents: 1
    }
  ];

  const employerTypes = [
    { id: 'all', name: 'All Employers', count: employers.length },
    { id: 'dao', name: 'DAOs', count: employers.filter(e => e.type === 'dao').length },
    { id: 'company', name: 'Companies', count: employers.filter(e => e.type === 'company').length },
    { id: 'protocol', name: 'Protocols', count: 0 },
    { id: 'individual', name: 'Individuals', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'rejected':
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
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dao':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'company':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'protocol':
        return <Globe className="w-5 h-5 text-green-600" />;
      default:
        return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesFilter = selectedFilter === 'all' || employer.type === selectedFilter;
    const matchesSearch = employer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalVerifiedEmployers = employers.filter(e => e.status === 'verified').length;
  const totalActiveEmployers = employers.filter(e => e.isActive).length;
  const totalMonthlyIncome = employers
    .filter(e => e.status === 'verified' && e.isActive)
    .reduce((sum, employer) => sum + employer.monthlyIncome, 0);

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before managing employer verifications
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
                  Employer Verification
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage your employer relationships and verification status for income documentation
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setShowAddEmployer(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Employer
                </button>
              </div>
            </div>
          </div>

          {/* Employer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Total Employers</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{employers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Verified</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalVerifiedEmployers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Active</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalActiveEmployers}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Monthly Income</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalMonthlyIncome.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
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
                {employerTypes.map(type => (
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
                placeholder="Search employers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors w-64 ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Employers List */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Employer Relationships
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredEmployers.map((employer) => (
                <div key={employer.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getTypeIcon(employer.type)}
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {employer.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employer.status)}`}>
                          {getStatusIcon(employer.status)}
                          <span className="ml-1 capitalize">{employer.status}</span>
                        </div>
                        {employer.isActive && (
                          <div className="flex items-center text-green-600">
                            <UserCheck className="w-4 h-4 mr-1" />
                            <span className="text-xs">Active</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Type:</span>
                          <p className="font-medium text-slate-900 dark:text-white capitalize">{employer.type}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Income:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {employer.monthlyIncome.toLocaleString()} {employer.currency}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Networks:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{employer.networks.join(', ')}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Documents:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{employer.documents}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Contact:</span>
                          <span className="text-sm text-slate-500">{employer.contactPerson}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Email:</span>
                          <span className="text-sm text-slate-500">{employer.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Website:</span>
                          <a href={employer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {employer.website.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {employer.verificationDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Verified:</span>
                            <span className="text-sm text-slate-500">
                              {new Date(employer.verificationDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Last Contact:</span>
                          <span className="text-sm text-slate-500">
                            {new Date(employer.lastContact).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {employer.ensDomain && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">{employer.ensDomain}</span>
                          </div>
                        )}
                      </div>
                      
                      {employer.verificationHash && (
                        <div className="mt-3">
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Verification Hash:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                              {employer.verificationHash.slice(0, 10)}...{employer.verificationHash.slice(-8)}
                            </span>
                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                              <ExternalLink className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <Eye className="w-4 h-4 text-slate-500" />
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

export default EmployerVerificationPage;
