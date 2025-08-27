'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  Link, 
  Edit3, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  Shield,
  Activity,
  Globe,
  User,
  Calendar,
  Hash
} from 'lucide-react';

const ENSIdentityPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock ENS verification data - would come from blockchain
  const ensVerifications = [
    {
      id: 1,
      domain: 'john.contributors.phala.eth',
      issuer: 'Phala Network',
      role: 'DevRel Contributor',
      verifiedAt: '2024-01-15T10:30:00Z',
      status: 'active',
      network: 'Ethereum',
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    {
      id: 2,
      domain: 'john.governance.uniswap.eth',
      issuer: 'Uniswap DAO',
      role: 'Governance Contributor',
      verifiedAt: '2024-02-01T14:20:00Z',
      status: 'active',
      network: 'Ethereum',
      contractAddress: '0x9876543210fedcba9876543210fedcba98765432'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Link className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before managing your identity
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
                  ENS Identity
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage your professional ENS identity and verifications
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Profile Information
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {profile?.displayName || 'Your Name'}
                      </h3>
                      <p className={`text-lg font-mono text-emerald-600 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {profile?.ensName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Display Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={profile?.displayName || ''}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                          }`}
                        />
                      ) : (
                        <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {profile?.displayName || 'Not set'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          defaultValue={profile?.bio || ''}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg ${
                            theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                          }`}
                        />
                      ) : (
                        <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {profile?.bio || 'No bio added yet'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Profile Status:
                        </span>
                        <span className="text-green-600 font-medium">Verified & Active</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Created: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Link className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    ENS Domain
                  </h3>
                  <p className={`font-mono text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {profile?.ensName}
                  </p>
                  <button
                    onClick={() => copyToClipboard(profile?.ensName || '')}
                    className="mt-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Verifications
                  </h3>
                  <p className={`text-2xl font-bold text-green-600 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {ensVerifications.length}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Active verifications
                  </p>
                </div>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Network
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Lisk Sepolia
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Testnet
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ENS Verifications */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ENS Verifications
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Professional verifications linked to your ENS identity
              </p>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {ensVerifications.map((verification) => (
                <div key={verification.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {verification.domain}
                        </h3>
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          {verification.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Issuer:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{verification.issuer}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Role:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{verification.role}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Network:</span>
                          <p className="font-medium text-slate-900 dark:text-white">{verification.network}</p>
                        </div>
                        
                        <div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Verified:</span>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(verification.verifiedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-slate-500" />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Contract:</span>
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {verification.contractAddress.slice(0, 6)}...{verification.contractAddress.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                        <ExternalLink className="w-4 h-4 text-slate-500" />
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

export default ENSIdentityPage;
