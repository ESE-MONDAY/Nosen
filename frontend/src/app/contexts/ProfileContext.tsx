'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface Profile {
  displayName: string;
  bio: string;
  isVerified: boolean;
  createdAt: string;
  ipfsHash?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  hasProfile: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = async () => {
    if (!address) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    // Profile logic will be implemented later
    setIsLoading(false);
  };

  const value: ProfileContextType = {
    profile,
    hasProfile: !!profile,
    isLoading,
    refreshProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
