'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'employer' | 'employee' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load role from localStorage on mount
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole === 'employer' || storedRole === 'employee') {
      setRoleState(storedRole);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const value: RoleContextType = {
    role,
    setRole,
    isLoading,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

