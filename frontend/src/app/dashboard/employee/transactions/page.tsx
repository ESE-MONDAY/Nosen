'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import EmployeeSidebar from '../../../components/EmployeeSidebar';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeeTransactionsPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const transactions: any[] = []; // Empty for now

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

          <main className="p-6 max-w-6xl">
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

              <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-teal-500/10 text-teal-500">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                        Transaction History
                      </CardTitle>
                      <CardDescription>
                        View all your salary payments and withdrawals
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        No transactions yet. Your monthly salary payments will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Transaction list will go here */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default EmployeeTransactionsPage;

