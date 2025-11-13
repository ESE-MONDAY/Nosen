'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  DollarSign, 
  UserPlus, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import ConnectWallet from '../../../components/ConnectWallet';
import { useSetup } from '../../../contexts/SetupContext';

const EmployerSetupPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { setupProgress, updateSetupProgress, isSetupComplete } = useSetup();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'profile',
      title: 'Company Profile',
      description: 'Setup your company information',
      icon: <Building2 className="w-6 h-6" />,
      href: '/dashboard/employer/profile',
      completed: setupProgress.profileCompleted
    },
    {
      id: 'signers',
      title: 'Manage Signers',
      description: 'Add authorized signers for payroll',
      icon: <Users className="w-6 h-6" />,
      href: '/dashboard/employer/signers',
      completed: setupProgress.signersCompleted
    },
    {
      id: 'funds',
      title: 'Add Funds',
      description: 'Deposit funds for monthly payroll',
      icon: <DollarSign className="w-6 h-6" />,
      href: '/dashboard/employer/funds',
      completed: setupProgress.fundsCompleted
    },
    {
      id: 'employees',
      title: 'Add Employees',
      description: 'Register your team members',
      icon: <UserPlus className="w-6 h-6" />,
      href: '/dashboard/employer/employees',
      completed: setupProgress.employeesCompleted
    }
  ];

  const handleStepComplete = (stepId: string) => {
    const stepMap: Record<string, keyof typeof setupProgress> = {
      'profile': 'profileCompleted',
      'signers': 'signersCompleted',
      'funds': 'fundsCompleted',
      'employees': 'employeesCompleted'
    };
    
    const key = stepMap[stepId];
    if (key) {
      updateSetupProgress(key, true);
    }
  };

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (isSetupComplete()) {
      router.push('/dashboard/employer');
    }
  };

  const handleSkip = () => {
    router.push(steps[currentStep].href);
  };

  if (!isConnected) {
    return (
      <RoleGuard allowedRole="employer">
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Connect Your Wallet
            </h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Please connect your wallet to begin setup
            </p>
            <ConnectWallet />
          </div>
        </div>
      </RoleGuard>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <RoleGuard allowedRole="employer">
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Setup Your Account
              </h1>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Steps Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentStep(index)}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  index === currentStep
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : step.completed
                    ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                    : theme === 'dark'
                    ? 'border-slate-700 bg-slate-800'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${index === currentStep ? 'text-emerald-500' : step.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {step.icon}
                  </div>
                  {step.completed && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <h3 className={`font-semibold text-sm mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Current Step Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`rounded-xl p-8 border ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700'
                : 'bg-white border-slate-200 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-lg ${
                currentStepData.completed
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                {currentStepData.icon}
              </div>
              <div>
                <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {currentStepData.title}
                </h2>
                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentStepData.description}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Complete this step to continue with your setup. You can always come back to update your information later.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handleSkip}
                  className={`px-6 py-2 rounded-lg border transition-all ${
                    theme === 'dark'
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Skip for Now
                </button>
                <button
                  onClick={() => {
                    router.push(currentStepData.href);
                  }}
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-2"
                >
                  Start Setup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Completion Message */}
          {isSetupComplete() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 rounded-xl p-6 border bg-emerald-500/10 border-emerald-500/30`}
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    Setup Complete!
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    All setup steps are complete. You can now access your dashboard.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/employer')}
                  className="ml-auto px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default EmployerSetupPage;

