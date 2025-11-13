export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  isL2: boolean;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  // Lisk Sepolia Testnet (L2)
  liskSepolia: {
    chainId: 4202,
    name: 'Lisk Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.lisk.com',
    blockExplorer: 'https://sepolia-blockscout.lisk.com',
    isL2: true,
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18,
    },
  },
  
  // Ethereum Sepolia Testnet (L1 - for testing)
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    isL2: false,
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
  },
  
  // Ethereum Mainnet (L1 - for reference)
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3',
    blockExplorer: 'https://etherscan.io',
    isL2: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// Get current network based on environment
export const getCurrentNetwork = (): NetworkConfig => {
  const networkName = process.env.NEXT_PUBLIC_NETWORK || 'liskSepolia';
  return NETWORKS[networkName] || NETWORKS.liskSepolia;
};

// IPFS configuration
export const IPFS_CONFIG = {
  gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
  // Note: For production, you can add real IPFS service credentials here
  // projectId: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID,
  // projectSecret: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET,
};
