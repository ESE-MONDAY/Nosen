'use client';

import { ThirdwebProvider as ThirdwebProviderSDK } from '@thirdweb-dev/react';
import { ReactNode } from 'react';

interface ThirdwebProviderProps {
  children: ReactNode;
}

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({ children }) => {
  return (
    <ThirdwebProviderSDK
      activeChain="liskSepolia"
      clientId="de402f4943c2f9ea2c590517377f8173" // You'll get this from thirdweb dashboard
      supportedWallets={[
        // Add the wallets you want to support
        // MetaMask, WalletConnect, etc.
        
      ]}
    >
      {children}
    </ThirdwebProviderSDK>
  );
};
