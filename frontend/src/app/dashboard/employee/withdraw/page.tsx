'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, ArrowDown } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import EmployeeSidebar from '../../../components/EmployeeSidebar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WithdrawPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'mobile'>('bank');

  const balance = '$0.00';

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    // TODO: Implement withdrawal logic
    setTimeout(() => {
      setLoading(false);
      setAmount('');
    }, 2000);
  };

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
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Available Balance
                    </div>
                    <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {balance}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-teal-500/10 text-teal-500">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                        Withdraw Funds
                      </CardTitle>
                      <CardDescription>
                        Withdraw your salary to your bank account or mobile money wallet
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        max={balance.replace('$', '')}
                        className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                      />
                      <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Available: {balance}
                      </p>
                    </div>

                    <div>
                      <Label>Withdrawal Method</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setWithdrawalMethod('bank')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            withdrawalMethod === 'bank'
                              ? 'border-teal-500 bg-teal-500/10'
                              : theme === 'dark'
                              ? 'border-slate-700 bg-slate-800'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Bank Account
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWithdrawalMethod('mobile')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            withdrawalMethod === 'mobile'
                              ? 'border-teal-500 bg-teal-500/10'
                              : theme === 'dark'
                              ? 'border-slate-700 bg-slate-800'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Mobile Money
                          </div>
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      disabled={!amount || parseFloat(amount) <= 0 || loading}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      size="lg"
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <ArrowDown className="w-4 h-4 mr-2" />
                          Withdraw Funds
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default WithdrawPage;

