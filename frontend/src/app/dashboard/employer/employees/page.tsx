'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, Plus, X } from 'lucide-react';
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

interface Employee {
  id: string;
  name: string;
  walletAddress: string;
  monthlySalary: string;
  email?: string;
}

const EmployeesPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    monthlySalary: '',
    email: ''
  });

  const { updateSetupProgress } = useSetup();

  const handleAddEmployee = () => {
    if (formData.name && formData.walletAddress && formData.monthlySalary) {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        walletAddress: formData.walletAddress,
        monthlySalary: formData.monthlySalary,
        email: formData.email
      };
      setEmployees([...employees, newEmployee]);
      setFormData({ name: '', walletAddress: '', monthlySalary: '', email: '' });
      setShowAddDialog(false);
      if (employees.length === 0) {
        updateSetupProgress('employeesCompleted', true);
      }
    }
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                          Manage Employees
                        </CardTitle>
                        <CardDescription>
                          Add employees and set their monthly salaries. Payments will be automated.
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <div className="text-center py-12">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className={`mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        No employees added yet
                      </p>
                      <Button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Employee
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {employees.map((employee) => (
                        <motion.div
                          key={employee.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-6 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-700'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {employee.name}
                              </h3>
                              <div className="space-y-1">
                                <p className={`text-sm font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                  {employee.walletAddress}
                                </p>
                                {employee.email && (
                                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {employee.email}
                                  </p>
                                )}
                                <p className={`text-lg font-semibold text-emerald-500`}>
                                  ${employee.monthlySalary}/month
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveEmployee(employee.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>

        {/* Add Employee Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : ''}>
            <DialogHeader>
              <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
                Add New Employee
              </DialogTitle>
              <DialogDescription className={theme === 'dark' ? 'text-slate-400' : ''}>
                Register a new employee and set their monthly salary. Payments will be automated.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Employee Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                />
              </div>
              <div>
                <Label htmlFor="walletAddress">Wallet Address *</Label>
                <Input
                  id="walletAddress"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  placeholder="0x..."
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                />
              </div>
              <div>
                <Label htmlFor="monthlySalary">Monthly Salary (USD) *</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  step="0.01"
                  value={formData.monthlySalary}
                  onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                  placeholder="4000.00"
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setFormData({ name: '', walletAddress: '', monthlySalary: '', email: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  disabled={!formData.name || !formData.walletAddress || !formData.monthlySalary}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Employee
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
};

export default EmployeesPage;

