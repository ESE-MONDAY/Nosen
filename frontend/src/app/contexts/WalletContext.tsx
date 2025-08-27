'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  ensName: string | null;
  isEnsRegistered: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  registerEnsName: (name: string) => Promise<void>;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isEnsRegistered, setIsEnsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Ethereum wallet');
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setEnsName(null);
    setIsEnsRegistered(false);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      
      // Check if user already has an ENS name
      checkExistingEnsName(address);
    }
  };

  const checkExistingEnsName = async (address: string) => {
    try {
      // This would typically call your backend API to check ENS registration
      // For now, we'll simulate it
      const response = await fetch(`/api/ens/check?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.ensName) {
          setEnsName(data.ensName);
          setIsEnsRegistered(true);
        }
      }
    } catch (error) {
      console.error('Error checking ENS name:', error);
    }
  };

  const registerEnsName = async (name: string) => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // This would typically call your backend API to register ENS
      const response = await fetch('/api/ens/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress,
          name: name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEnsName(data.ensName);
        setIsEnsRegistered(true);
        alert(`Successfully registered ${data.ensName}!`);
      } else {
        throw new Error('Failed to register ENS name');
      }
    } catch (error) {
      console.error('Error registering ENS name:', error);
      alert('Failed to register ENS name');
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const value: WalletContextType = {
    isConnected,
    walletAddress,
    ensName,
    isEnsRegistered,
    connectWallet,
    disconnectWallet,
    registerEnsName,
    loading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
