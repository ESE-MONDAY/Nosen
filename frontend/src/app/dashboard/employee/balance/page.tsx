'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeft, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import EmployeeSidebar from '../../../components/EmployeeSidebar';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useAccount } from 'wagmi';

const BalancePage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { address } = useAccount();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const balance = '$0.00';
  const monthlySalary = '$0.00';
  const nextPayment = 'Not scheduled';

  return (
    <RoleGuard allowedRole="employee">
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <EmployeeSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="md:ml-64">
          <div className={`sticky top-0 z-30 border-b ${
            theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <main className="p-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 text-teal-500 mb-6">
                      <Wallet className="w-10 h-10" />
                    </div>
                    <div className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {balance}
                    </div>
                    <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Current Wallet Balance
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-teal-500/10 text-teal-500">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Monthly Salary
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {monthlySalary}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-teal-500/10 text-teal-500">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Next Payment
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {nextPayment}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className={`mt-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-6">
                  <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Your Wallet Address
                  </h3>
                  <p className={`font-mono text-sm p-4 rounded-lg bg-slate-800 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {address || 'Not connected'}
                  </p>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Your monthly salary will be automatically deposited to this address
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default BalancePage;

