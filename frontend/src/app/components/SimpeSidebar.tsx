// components/SimpleSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
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

interface SimpleSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SimpleSidebar: React.FC<SimpleSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Add Wallets',
      href: '/dashboard/wallets',
      icon: Wallet,
      badge: 'Setup',
      current: pathname.startsWith('/dashboard/wallets')
    },
    {
      name: 'Income Streams',
      href: '/dashboard/income-streams',
      icon: DollarSign,
      badge: '3',
      current: pathname.startsWith('/dashboard/income-streams')
    },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      icon: CreditCard,
      badge: '2',
      current: pathname.startsWith('/dashboard/transactions')
    },
    {
      name: 'ENS Identity',
      href: '/dashboard/ens-identity',
      icon: LinkIcon,
      verified: true,
      current: pathname.startsWith('/dashboard/ens-identity')
    },
    {
      name: 'Documents',
      href: '/dashboard/documents',
      icon: FileText,
      current: pathname.startsWith('/dashboard/documents')
    },
    {
      name: 'Employer Verification',
      href: '/dashboard/employer-verification',
      icon: Building,
      current: pathname.startsWith('/dashboard/employer-verification')
    },
    {
      name: 'Tax Compliance',
      href: '/dashboard/tax-compliance',
      icon: Globe,
      badge: '85%',
      current: pathname.startsWith('/dashboard/tax-compliance')
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      current: pathname.startsWith('/dashboard/reports')
    },
  ];

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings')
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle,
      current: pathname.startsWith('/dashboard/help')
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 ${
        theme === 'dark'
          ? 'bg-slate-900 border-r border-slate-700'
          : 'bg-white border-r border-slate-200'
      }`}>
        
        {/* Mobile close button */}
        <div className={`flex items-center justify-end h-16 px-6 border-b lg:hidden ${
          theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-2 rounded-md transition-colors ${
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
          <div className="flex-1">
            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              john-devrel.nosen.eth
            </p>
            <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Verified Professional
            </p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? theme === 'dark'
                    ? 'bg-emerald-900/30 text-emerald-400 border-l-4 border-emerald-500'
                    : 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 ${
                    item.current ? 'text-emerald-500' : theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {item.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.badge === 'Setup'
                      ? theme === 'dark' ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'
                      : item.badge === '85%'
                      ? theme === 'dark' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                      : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className={`border-t p-2 space-y-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? theme === 'dark'
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : 'bg-emerald-50 text-emerald-700'
                  : theme === 'dark'
                    ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  item.current ? 'text-emerald-500' : theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
      </aside>
    </>
  );
};

export default SimpleSidebar;