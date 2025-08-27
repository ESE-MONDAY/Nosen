'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Activity,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Video,
  FileText,
  Users,
  Globe,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

const HelpPage = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: 'How do I create my ENS profile?',
      answer: 'To create your ENS profile, navigate to the "Create Profile" page after connecting your wallet. Choose a unique subdomain (e.g., "john.nosen.eth"), fill in your details, and confirm the transaction. Gas fees will apply.',
      category: 'profile',
      tags: ['ENS', 'Profile', 'Setup']
    },
    {
      id: 2,
      question: 'How do I add income streams?',
      answer: 'Go to the "Income Streams" page and click "Add Income Stream". You can connect wallets, add DAO contributions, or manually input income sources. Each stream will be tracked and can be used for document generation.',
      category: 'income',
      tags: ['Income', 'Streams', 'Tracking']
    },
    {
      id: 3,
      question: 'What documents can I generate?',
      answer: 'You can generate Income Verification Letters, Employment Verification documents, and Loan Application proofs. These documents are blockchain-verified and suitable for visas, loans, and employment verification.',
      category: 'documents',
      tags: ['Documents', 'Verification', 'Proof']
    },
    {
      id: 4,
      question: 'How does tax compliance work?',
      answer: 'Our platform automatically calculates taxable income across all your Web3 activities. You can generate tax reports for different jurisdictions and export them for your tax filings.',
      category: 'tax',
      tags: ['Tax', 'Compliance', 'Reports']
    },
    {
      id: 5,
      question: 'Which networks are supported?',
      answer: 'We support Ethereum, Polygon, Arbitrum, Optimism, Solana, and Avalanche. You can manage wallets across multiple networks and consolidate income from all sources.',
      category: 'networks',
      tags: ['Networks', 'Multi-chain', 'Wallets']
    },
    {
      id: 6,
      question: 'How secure is my data?',
      answer: 'Your data is stored on IPFS (InterPlanetary File System) and secured with blockchain technology. We never store sensitive information on centralized servers.',
      category: 'security',
      tags: ['Security', 'Privacy', 'IPFS']
    }
  ];

  const helpCategories = [
    { id: 'all', name: 'All Topics', count: faqs.length },
    { id: 'profile', name: 'Profile Setup', count: faqs.filter(f => f.category === 'profile').length },
    { id: 'income', name: 'Income Management', count: faqs.filter(f => f.category === 'income').length },
    { id: 'documents', name: 'Document Generation', count: faqs.filter(f => f.category === 'documents').length },
    { id: 'tax', name: 'Tax Compliance', count: faqs.filter(f => f.category === 'tax').length },
    { id: 'networks', name: 'Network Support', count: faqs.filter(f => f.category === 'networks').length },
    { id: 'security', name: 'Security & Privacy', count: faqs.filter(f => f.category === 'security').length }
  ];

  const quickActions = [
    { name: 'Create ENS Profile', icon: Globe, description: 'Set up your professional identity', action: '/create-profile' },
    { name: 'Add Income Stream', icon: Zap, description: 'Connect your Web3 income sources', action: '/dashboard/income-streams' },
    { name: 'Generate Documents', icon: FileText, description: 'Create verification documents', action: '/dashboard/documents' },
    { name: 'View Reports', icon: BookOpen, description: 'Access analytics and insights', action: '/dashboard/reports' }
  ];

  const supportChannels = [
    { name: 'Email Support', icon: Mail, description: 'Get help via email', contact: 'support@nosen.eth' },
    { name: 'Live Chat', icon: MessageCircle, description: 'Chat with our support team', status: 'Available' },
    { name: 'Community Forum', icon: Users, description: 'Connect with other users', status: 'Active' },
    { name: 'Documentation', icon: BookOpen, description: 'Comprehensive guides', status: 'Updated' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before accessing help resources
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
            <div className="text-center">
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Help & Support
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Get help with using the Nosen platform and managing your Web3 income
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for help topics, questions, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-lg transition-colors ${
                  theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      theme === 'dark' ? 'border-slate-600 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {action.name}
                      </h3>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {action.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Channels */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Get Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportChannels.map((channel, index) => {
                const IconComponent = channel.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border ${
                      theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {channel.name}
                      </h3>
                    </div>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {channel.description}
                    </p>
                    {channel.contact ? (
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {channel.contact}
                      </p>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">{channel.status}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Frequently Asked Questions
              </h2>
              <div className="flex items-center space-x-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      category.id === 'all'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : theme === 'dark'
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`border rounded-lg transition-all ${
                    theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className={`w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <h3 className="font-medium">{faq.question}</h3>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <Video className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Video Tutorials
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Watch step-by-step guides on setting up your profile, managing income streams, and generating documents.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Watch Tutorials <ExternalLink className="w-4 h-4 inline ml-1" />
                </button>
              </div>

              <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <FileText className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Documentation
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Comprehensive guides covering all platform features, API documentation, and integration examples.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Read Docs <ExternalLink className="w-4 h-4 inline ml-1" />
                </button>
              </div>

              <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <Users className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Community
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Join our community forum to connect with other users, share experiences, and get help.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Join Community <ExternalLink className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
