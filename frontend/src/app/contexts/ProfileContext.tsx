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
  updateProfile: (updates: Partial<ENSProfile>) => Promise<void>;
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
    if (isConnected && address) {
      checkProfile();
    } else {
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

      // Check if user already has an ENS subdomain on the blockchain
      const existingSubdomain = await ensService.getUserSubdomain(address);
      
      if (existingSubdomain) {
        // User has an ENS subdomain, create profile object
        const ensProfile: ENSProfile = {
          ensName: `${existingSubdomain}.nosen.eth`,
          displayName: existingSubdomain,
          bio: '',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        setProfile(ensProfile);
      } else {
        // Check localStorage as fallback for legacy profiles
        const savedProfile = localStorage.getItem(`profile_${address}`);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(null);
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // Fallback to localStorage check
      try {
        const savedProfile = localStorage.getItem(`profile_${address}`);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(null);
        }
      } catch (fallbackError) {
        console.error('Fallback profile check failed:', fallbackError);
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ENSProfile>) => {
    if (!profile || !address) throw new Error('No profile to update');
    
    try {
      const updatedProfile = { ...profile, ...updates };
      
      // TODO: Update profile metadata on IPFS and ENS record
      // This would involve:
      // 1. Uploading updated metadata to IPFS
      // 2. Updating the ENS contenthash record
      // 3. Updating text records if needed
      
      // Save to localStorage for demo purposes
      localStorage.setItem(`profile_${address}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
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
    updateProfile,
    checkProfileAvailability,
    estimateGas,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
