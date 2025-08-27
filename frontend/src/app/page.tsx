'use client'
import React from 'react';
import { ChevronRight, Shield, FileText, Globe, Check, ArrowRight, Zap, TrendingUp, Wallet, Building, CreditCard, Eye, Link, Award, Clock, MapPin, DollarSign, Briefcase, UserCheck } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import ConnectWallet from './components/ConnectWallet';
import { useAccount } from 'wagmi';

import { useProfile } from './contexts/ProfileContext';
import { useRouter } from 'next/navigation';

const NosenLanding = () => {
  const { theme } = useTheme();
  const { profile, hasProfile } = useProfile();

  const coreFeatures = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "ENS Professional Identity",
      description: `Get ${hasProfile ? profile?.ensName : 'yourname.nosen.eth'} instead of 0x742d35... Create a professional, memorable crypto identity for visa applications and employers.`
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Official Payslip Generation", 
      description: "Convert crypto payments into legitimate payslips with fiat values, employer details, and tamper-proof verification hashes."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "DAO Employer Verification",
      description: "DAOs can issue verified subdomains (john.contributors.phala.eth) with automatic employer attestation in ENS records."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Income Indexing",
      description: "Auto-detect recurring crypto payments across EVM chains using Envio indexing. Label work type, duration, and project context."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Country Tax Compliance",
      description: "Tax calculations for Nigeria, India, Brazil, Germany with country-specific forms and filing guidance."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "ChainProof Registry",
      description: "Build verifiable work history and crypto creditworthiness. Employers can verify your contributions across platforms."
    }
  ];

  const useCases = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visa Applications",
      description: "Embassy-ready income proofs",
      detail: "Generate official documentation showing stable crypto income for visa applications. Accepted by embassies worldwide."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Bank Loans & Credit",
      description: "Prove income for financial services",
      detail: "Banks accept Nosen income verification for loans, credit cards, and account opening with crypto earnings."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Apartment Rentals",
      description: "Landlord-friendly documentation",
      detail: "Show consistent monthly income from DAO work with professional payslips landlords understand."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Tax Filing",
      description: "Compliant tax reporting",
      detail: "Generate country-specific tax forms with proper crypto income classification and fiat conversions."
    }
  ];

  const ensFeatures = [
    {
      title: "Professional Identity",
      before: "0x742d35Cc6634C0532925a3b8D...",
      after: hasProfile ? profile?.ensName : "yourname.nosen.eth",
      description: "Human-readable identity for professional use"
    },
    {
      title: "Employer Verification", 
      before: "Unverified freelancer",
      after: "john.contributors.phala.eth",
      description: "DAO-issued subdomain proves employment"
    },
    {
      title: "Credential Storage",
      before: "Lost paperwork",
      after: "ENS text records with income proofs",
      description: "Verifiable credentials stored on-chain"
    }
  ];

  const stats = [
    { number: "50M+", label: "Crypto Earners Globally", subtext: "Need income verification" },
    { number: "85%", label: "Visa Approval Rate", subtext: "With Nosen documentation" },
    { number: "12", label: "Countries Supported", subtext: "Expanding monthly" },
    { number: "99%", label: "Document Acceptance", subtext: "By institutions worldwide" }
  ];

  const GetStartedButton: React.FC = () => {
    const { isConnected } = useAccount();
    const { hasProfile, isLoading } = useProfile();
    const router = useRouter();

    if (isLoading) {
      return (
        <div className="px-8 py-4 rounded-xl font-semibold bg-slate-300 text-slate-600">
          Loading...
        </div>
      );
    }

    if (hasProfile) {
      return (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 border-2 ${
              theme === 'dark'
                ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-5 h-5" />
            View Profile
          </button>
        </div>
      );
    }

    if (isConnected) {
      return (
        <button
          onClick={() => router.push('/create-profile')}
          className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            theme === 'dark'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          Create Your ENS Profile
        </button>
      );
    }

    return (
      <div className="text-center">
        <ConnectWallet />
        <p className="text-sm mt-2 opacity-75">
          Connect your wallet to get started
        </p>
      </div>
    );
  };

  const targetUsers = [
    {
      avatar: "🇳🇬",
      name: "African DAO Contributors",
      income: "$2,500/month in USDC",
      challenge: "Need visa documentation for conferences",
      solution: "Nosen ENS identity + official payslips"
    },
    {
      avatar: "🇮🇳", 
      name: "Web3 Developers",
      income: "$4,000/month in ETH",
      challenge: "Can't get bank loans with crypto income",
      solution: "Verified income reports + tax compliance"
    },
    {
      avatar: "🇧🇷",
      name: "DeFi Protocol Contributors",
      income: "$3,200/month in tokens",
      challenge: "Landlords don't accept crypto payslips",
      solution: "Professional documentation + employer verification"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>


      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium mb-8 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
              <Link className="w-4 h-4 mr-2" />
              Built for Web3 Professionals
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              From Wallet to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Payslip
              </span>
            </h1>
            
            <p className={`text-xl mb-4 max-w-4xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              The first Web3-native income verification platform. Transform your crypto earnings 
              into legitimate documentation with <strong>ENS professional identities</strong>, 
              employer verification, and institutional-grade reports.
            </p>

            <p className="text-lg text-emerald-600 font-medium mb-8">
              Real Income, Recognized • john-devrel.nosen.eth instead of 0x742d35...
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <GetStartedButton />
            </div>

            {/* Example ENS Identity */}
            <div className={`mt-8 p-4 rounded-xl border max-w-md mx-auto ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
              <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {hasProfile ? 'Your Professional Identity:' : 'Example Professional Identity:'}
              </div>
              <div className="font-mono text-emerald-600 font-semibold">
                {hasProfile ? profile?.ensName : 'yourname-dev.nosen.eth'}
              </div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {hasProfile ? 'Active • Verified • Professional' : 'Verifiable • Professional • Memorable'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">{stat.number}</div>
                  <div className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{stat.label}</div>
                  <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className={`py-16 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Built for Web3 Professionals Worldwide
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Especially those in emerging markets who face the biggest barriers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {targetUsers.map((user, index) => (
              <div key={index} className={`rounded-2xl p-8 hover:shadow-lg transition-all ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{user.avatar}</span>
                  <div>
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                    <p className="text-emerald-600 font-medium">{user.income}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-red-600 font-medium">Challenge:</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{user.challenge}</div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">Nosen Solution:</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{user.solution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-emerald-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Web3 Income Legitimacy Suite
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              From blockchain indexing to institutional documentation - everything you need to make crypto income recognized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className={`rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 border h-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENS Integration Showcase */}
      <section id="ens-integration" className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
              <Link className="w-4 h-4 mr-2" />
              Professional Identity Layer for Web3
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Professional Identity Layer for Web3
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              First platform to use ENS for verifiable professional credentials and employer attestations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {ensFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                
                <div className="space-y-4">
                  {/* Before */}
                  <div className={`border rounded-lg p-4 ${theme === 'dark' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs text-red-600 font-medium mb-2">Before</div>
                    <div className={`font-mono text-sm break-all ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{feature.before}</div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-emerald-500" />
                  </div>
                  
                  {/* After */}
                  <div className={`border rounded-lg p-4 ${theme === 'dark' ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="text-xs text-emerald-600 font-medium mb-2">With Nosen</div>
                    <div className={`font-mono text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>{feature.after}</div>
                  </div>
                </div>
                
                <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* ENS Benefits */}
          <div className={`rounded-2xl p-8 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-emerald-900/30' : 'bg-gradient-to-r from-blue-50 to-emerald-50'}`}>
            <h3 className={`text-xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Why ENS Integration Matters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Cross-Platform Verification</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Your ENS identity works across all Web3 platforms</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Employer Attestations</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>DAOs can verify your work history on-chain</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Document Authenticity</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Payslips linked to ENS records for verification</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Global Recognition</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Professional identity recognized worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
              Real-World Applications
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-200'}`}>
              Where Nosen documentation opens doors for Web3 professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className={`rounded-2xl p-6 hover:bg-slate-700 transition-all ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-700'}`}>
                <div className="text-emerald-400 mb-4">
                  {useCase.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-slate-300 text-sm mb-3">{useCase.description}</p>
                <p className="text-xs text-slate-400">{useCase.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className={`inline-block rounded-2xl p-8 max-w-4xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-700'}`}>
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Success Story</h3>
              <blockquote className="text-slate-300 italic text-lg">
                &ldquo;I got my UK visa approved using Nosen payslips showing my $3,500/month DAO income. 
                The embassy officer could verify my john-dev.nosen.eth identity and see 8 months of consistent payments from Gitcoin.&rdquo;
              </blockquote>
              <div className="mt-4 text-slate-400">
                - Adebayo K., Lagos → London visa approved
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Simple 4-Step Process
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              From crypto transactions to institutional documentation in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Link your wallet to auto-detect recurring crypto payments across EVM chains.",
                icon: <Wallet className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "Claim ENS Identity",
                description: "Get your professional ENS name: yourname-dev.nosen.eth",
                icon: <Link className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Add Work Context",
                description: "Label transactions with project details, work type, and get employer verification.",
                icon: <Briefcase className="w-8 h-8" />
              },
              {
                step: "04",
                title: "Generate Documents",
                description: "Download professional payslips, tax reports, and income verification letters.",
                icon: <FileText className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className={`rounded-2xl p-8 hover:shadow-lg transition-all ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                  <div className="text-6xl font-bold text-emerald-100 mb-4">{step.step}</div>
                  <div className="text-emerald-600 mb-4 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Legitimize Your Crypto Income?
          </h2>
          <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-100'}`}>
            Join 10,000+ Web3 professionals who&apos;ve made their crypto income officially recognized
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConnectWallet />
            <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 hover:text-white transition-all">
              View Documentation
            </button>
          </div>
          

        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold text-white">nosen</span>
              </div>
              <p className="text-slate-400 mb-4">
                Making crypto income recognized worldwide through ENS-powered professional identity.
              </p>
              <div className="text-xs text-slate-500">
                Built for ENS Everywhere Hackathon
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>ENS Integration</div>
                <div>Income Verification</div>
                <div>Document Generation</div>
                <div>Tax Compliance</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Use Cases</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>Visa Applications</div>
                <div>Bank Loans</div>
                <div>Apartment Rentals</div>
                <div>Tax Filing</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <div>Documentation</div>
                <div>ENS Setup Guide</div>
                <div>Contact Support</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">&copy; 2025 Nosen. All rights reserved.</p>
            <div className="mt-4 md:mt-0 text-slate-400 text-sm">
              Built on Ethereum
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default NosenLanding;