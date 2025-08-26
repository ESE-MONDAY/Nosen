'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Wallet,
  DollarSign,
  FileText,
  Settings,
  Link as LinkIcon,
  Building,
  Globe,
  User,
  CheckCircle,
  X,
  CreditCard,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | null;
  verified?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Mock user data - would come from context/store
  const userProfile = {
    ensName: 'john-devrel.nosen.eth',
    walletAddress: '0x742d35Cc6634C0532925a3b8D...',
    verificationStatus: 'verified',
  };

  // Mock stats - would come from context/store  
  const stats = {
    verifiedSources: 3,
    pendingTransactions: 2,
    complianceScore: 85
  };

  const sidebarNavigation: NavigationItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'wallets',
      name: 'Add Wallets',
      href: '/dashboard/wallets',
      icon: <Wallet className="w-5 h-5" />,
      badge: 'Setup'
    },
    {
      id: 'income-streams',
      name: 'Income Streams',
      href: '/dashboard/income-streams',
      icon: <DollarSign className="w-5 h-5" />,
      badge: stats.verifiedSources.toString()
    },
    {
      id: 'transactions',
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: <CreditCard className="w-5 h-5" />,
      badge: stats.pendingTransactions > 0 ? stats.pendingTransactions.toString() : null
    },
    {
      id: 'ens-identity',
      name: 'ENS Identity',
      href: '/dashboard/ens-identity',
      icon: <LinkIcon className="w-5 h-5" />,
      verified: true
    },
    {
      id: 'documents',
      name: 'Documents',
      href: '/dashboard/documents',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'employer-verify',
      name: 'Employer Verification',
      href: '/dashboard/employer-verification',
      icon: <Building className="w-5 h-5" />
    },
    {
      id: 'tax-compliance',
      name: 'Tax Compliance',
      href: '/dashboard/tax-compliance',
      icon: <Globe className="w-5 h-5" />,
      badge: `${stats.complianceScore}%`
    },
    {
      id: 'reports',
      name: 'Reports',
      href: '/dashboard/reports',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  const bottomNavigation: NavigationItem[] = [
    {
      id: 'settings',
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'help',
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getBadgeStyles = (badge: string | null | undefined) => {
    if (!badge) return '';
    
    switch (badge) {
      case 'Setup':
        return theme === 'dark' 
          ? 'bg-orange-900/50 text-orange-300 border-orange-700' 
          : 'bg-orange-100 text-orange-800 border-orange-200';
      case `${stats.complianceScore}%`:
        if (stats.complianceScore < 70) {
          return theme === 'dark' 
            ? 'bg-red-900/50 text-red-300 border-red-700' 
            : 'bg-red-100 text-red-800 border-red-200';
        } else if (stats.complianceScore < 90) {
          return theme === 'dark' 
            ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' 
            : 'bg-yellow-100 text-yellow-800 border-yellow-200';
        } else {
          return theme === 'dark' 
            ? 'bg-green-900/50 text-green-300 border-green-700' 
            : 'bg-green-100 text-green-800 border-green-200';
        }
      default:
        return theme === 'dark' 
          ? 'bg-slate-700 text-slate-300 border-slate-600' 
          : 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        theme === 'dark' 
          ? 'bg-slate-900 border-r border-slate-700' 
          : 'bg-white border-r border-slate-200'
      }`}>
        
        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-6 border-b ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>nosen</span>
          </Link>
          
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {userProfile.ensName}
              </p>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Verified Professional
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Online"></div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarNavigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group border ${
                isActive(item.href)
                  ? theme === 'dark'
                    ? 'bg-emerald-900/30 text-emerald-400 border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800 border-transparent'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`transition-colors ${
                  isActive(item.href) 
                    ? 'text-emerald-500' 
                    : theme === 'dark' 
                      ? 'text-slate-400 group-hover:text-slate-300' 
                      : 'text-slate-500 group-hover:text-slate-600'
                }`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {item.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 border ${getBadgeStyles(item.badge)}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className={`border-t p-4 space-y-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          {bottomNavigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? theme === 'dark'
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : 'bg-emerald-50 text-emerald-700'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={`transition-colors ${
                isActive(item.href) 
                  ? 'text-emerald-500' 
                  : theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-slate-300' 
                    : 'text-slate-500 group-hover:text-slate-600'
              }`}>
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
