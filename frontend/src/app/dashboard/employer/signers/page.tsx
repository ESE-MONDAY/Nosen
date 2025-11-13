'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Plus, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import EmployerSidebar from '../../../components/EmployerSidebar';
import { useRouter } from 'next/navigation';
import { useSetup } from '../../../contexts/SetupContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const SignersPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signers, setSigners] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSignerAddress, setNewSignerAddress] = useState('');

  const { updateSetupProgress } = useSetup();

  const handleAddSigner = () => {
    if (newSignerAddress.trim()) {
      setSigners([...signers, newSignerAddress]);
      setNewSignerAddress('');
      setShowAddDialog(false);
      if (signers.length === 0) {
        updateSetupProgress('signersCompleted', true);
      }
    }
  };

  const handleRemoveSigner = (address: string) => {
    setSigners(signers.filter(addr => addr !== address));
  };

  return (
    <RoleGuard allowedRole="employer">
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
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

              <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                          Manage Signers
                        </CardTitle>
                        <CardDescription>
                          Add or remove authorized signers for payroll approvals
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Signer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {signers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className={`mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        No signers added yet
                      </p>
                      <Button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Signer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {signers.map((address, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-700'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <p className={`font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {address}
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Authorized Signer
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveSigner(address)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>

        {/* Add Signer Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : ''}>
            <DialogHeader>
              <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
                Add New Signer
              </DialogTitle>
              <DialogDescription className={theme === 'dark' ? 'text-slate-400' : ''}>
                Enter the wallet address of the authorized signer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="signerAddress">Wallet Address</Label>
                <Input
                  id="signerAddress"
                  value={newSignerAddress}
                  onChange={(e) => setNewSignerAddress(e.target.value)}
                  placeholder="0x..."
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewSignerAddress('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSigner}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Signer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
};

export default SignersPage;

