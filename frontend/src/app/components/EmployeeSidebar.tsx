'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  History,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface EmployeeSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/employee',
      icon: LayoutDashboard,
      current: pathname === '/dashboard/employee'
    },
    {
      name: 'Wallet Balance',
      href: '/dashboard/employee/balance',
      icon: Wallet,
      current: pathname === '/dashboard/employee/balance'
    },
    {
      name: 'Withdraw',
      href: '/dashboard/employee/withdraw',
      icon: CreditCard,
      current: pathname === '/dashboard/employee/withdraw'
    },
    {
      name: 'Transaction History',
      href: '/dashboard/employee/transactions',
      icon: History,
      current: pathname === '/dashboard/employee/transactions'
    },
  ];

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/dashboard/employee/settings',
      icon: Settings,
      current: pathname === '/dashboard/employee/settings'
    }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          theme === 'dark' ? 'bg-slate-900 border-r border-slate-700' : 'bg-white border-r border-slate-200'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <Link href="/dashboard/employee" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Nosen
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.current
                      ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom navigation */}
          <div className="p-4 border-t border-slate-700">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.current
                      ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;

