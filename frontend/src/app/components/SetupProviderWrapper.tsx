'use client';

import React from 'react';
import { SetupProvider } from '../contexts/SetupContext';
import { useRole } from '../contexts/RoleContext';

interface SetupProviderWrapperProps {
  children: React.ReactNode;
}

export const SetupProviderWrapper: React.FC<SetupProviderWrapperProps> = ({ children }) => {
  const { role } = useRole();
  
  return (
    <SetupProvider role={role}>
      {children}
    </SetupProvider>
  );
};

