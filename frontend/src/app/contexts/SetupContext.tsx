'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SetupProgress {
  profileCompleted: boolean;
  signersCompleted: boolean;
  fundsCompleted: boolean;
  employeesCompleted: boolean;
}

interface SetupContextType {
  setupProgress: SetupProgress;
  updateSetupProgress: (key: keyof SetupProgress, value: boolean) => void;
  isSetupComplete: () => boolean;
  resetSetup: () => void;
}

const defaultProgress: SetupProgress = {
  profileCompleted: false,
  signersCompleted: false,
  fundsCompleted: false,
  employeesCompleted: false,
};

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
};

interface SetupProviderProps {
  children: ReactNode;
  role: 'employer' | 'employee' | null;
}

export const SetupProvider: React.FC<SetupProviderProps> = ({ children, role }) => {
  const [setupProgress, setSetupProgress] = useState<SetupProgress>(defaultProgress);

  useEffect(() => {
    // Load setup progress from localStorage
    if (role) {
      const stored = localStorage.getItem(`setupProgress_${role}`);
      if (stored) {
        try {
          setSetupProgress(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading setup progress:', e);
        }
      }
    }
  }, [role]);

  const updateSetupProgress = (key: keyof SetupProgress, value: boolean) => {
    setSetupProgress((prev) => {
      const updated = { ...prev, [key]: value };
      if (role) {
        localStorage.setItem(`setupProgress_${role}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isSetupComplete = () => {
    if (role === 'employer') {
      return (
        setupProgress.profileCompleted &&
        setupProgress.signersCompleted &&
        setupProgress.fundsCompleted &&
        setupProgress.employeesCompleted
      );
    } else if (role === 'employee') {
      // Employees might not need setup, or just profile
      return setupProgress.profileCompleted;
    }
    return false;
  };

  const resetSetup = () => {
    setSetupProgress(defaultProgress);
    if (role) {
      localStorage.removeItem(`setupProgress_${role}`);
    }
  };

  const value: SetupContextType = {
    setupProgress,
    updateSetupProgress,
    isSetupComplete,
    resetSetup,
  };

  return (
    <SetupContext.Provider value={value}>
      {children}
    </SetupContext.Provider>
  );
};

