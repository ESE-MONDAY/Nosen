'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';

interface Web3ProviderProps {
  children: ReactNode;
}

// Create a query client
const queryClient = new QueryClient();

// Create a wagmi config with the connectors we want
const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
    }),
    coinbaseWallet({ appName: 'Nosen - Web3 Income Verification Platform' }),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
});

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
