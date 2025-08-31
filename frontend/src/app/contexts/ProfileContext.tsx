'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ensService } from '../../services/ensService';

interface ENSProfile {
  ensName: string;
  displayName: string;
  bio: string;
  isVerified: boolean;
  createdAt: string;
  ipfsHash?: string;
}

interface ProfileContextType {
  profile: ENSProfile | null;
  hasProfile: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  checkProfileAvailability: (subdomain: string) => Promise<boolean>;
  estimateGas: (subdomain: string) => Promise<string>;
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
  const [profile, setProfile] = useState<ENSProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has a profile on mount and when wallet changes
  useEffect(() => {
    console.log('ProfileContext: useEffect triggered, isConnected:', isConnected, 'address:', address);
    if (isConnected && address) {
      checkProfile();
    } else {
      console.log('ProfileContext: Not connected or no address, setting profile to null');
      setProfile(null);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const checkProfile = async () => {
    setIsLoading(true);
    try {
      if (!address) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      console.log('ProfileContext: Checking profile for address:', address);

      // Check if user already has an ENS subdomain on the blockchain
      try {
        console.log('ProfileContext: Attempting to get user subdomain from blockchain...');
        const existingSubdomain = await ensService.getUserSubdomain(address);
        console.log('ProfileContext: Blockchain result:', existingSubdomain);
        
        if (existingSubdomain) {
          // User has an ENS subdomain, create profile object
          const ensProfile: ENSProfile = {
            ensName: `${existingSubdomain}.nosen.eth`,
            displayName: existingSubdomain,
            bio: '',
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          console.log('ProfileContext: Setting profile from blockchain:', ensProfile);
          setProfile(ensProfile);
        } else {
          console.log('ProfileContext: No subdomain found on blockchain');
          setProfile(null);
        }
      } catch (blockchainError) {
        console.error('ProfileContext: Blockchain check failed:', blockchainError);
        console.log('ProfileContext: Setting profile to null due to blockchain error');
        setProfile(null);
      }
    } catch (error) {
      console.error('ProfileContext: Error in checkProfile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileAvailability = async (subdomain: string): Promise<boolean> => {
    try {
      const result = await ensService.checkSubdomainAvailability(subdomain);
      return result.available || false;
    } catch (error) {
      console.error('Error checking profile availability:', error);
      return false;
    }
  };

  const estimateGas = async (subdomain: string): Promise<string> => {
    try {
      const result = await ensService.estimateGasForProfileCreation(subdomain);
      return result.l2Gas || '0';
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0';
    }
  };

  const refreshProfile = async () => {
    if (!address) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    await checkProfile();
  };

  const value: ProfileContextType = {
    profile,
    hasProfile: !!profile,
    isLoading,
    refreshProfile,
    checkProfileAvailability,
    estimateGas,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
