'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ensService, ENSProfile } from '../../services/ensService';

interface ProfileContextType {
  profile: ENSProfile | null;
  hasProfile: boolean;
  isLoading: boolean;
  createProfile: (ensName: string, displayName?: string, bio?: string) => Promise<void>;
  updateProfile: (updates: Partial<ENSProfile>) => Promise<void>;
  checkProfileAvailability: (subdomain: string) => Promise<boolean>;
  estimateGas: (subdomain: string) => Promise<bigint>;
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
      // Try to resolve ENS profile from blockchain
      const ensName = `${address?.slice(0, 6)}...${address?.slice(-4)}.${ensService.getCurrentNetwork().ensRegistry === '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' ? 'nosen.eth' : 'eth'}`;
      
      // For now, check localStorage as fallback
      // In production, you'd query the ENS registry
      const savedProfile = localStorage.getItem(`profile_${address}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (ensName: string, displayName?: string, bio?: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      // Create the profile object
      const newProfile: ENSProfile = {
        ensName: `${ensName}.${ensService.getCurrentNetwork().ensRegistry === '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' ? 'nosen.eth' : 'eth'}`,
        displayName: displayName || ensName,
        bio: bio || '',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      // Use the real ENS service to create the profile
      const ipfsHash = await ensService.createENSProfile(ensName, newProfile);
      
      // Update profile with IPFS hash
      newProfile.ipfsHash = ipfsHash;
      newProfile.isVerified = true;
      
      // Save to localStorage for demo purposes (in production, this would be redundant)
      localStorage.setItem(`profile_${address}`, JSON.stringify(newProfile));
      setProfile(newProfile);
      
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
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
      return await ensService.checkSubdomainAvailability(subdomain);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const estimateGas = async (subdomain: string): Promise<bigint> => {
    try {
      return await ensService.estimateGasForProfileCreation(subdomain);
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  };

  const value: ProfileContextType = {
    profile,
    hasProfile: !!profile,
    isLoading,
    createProfile,
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
