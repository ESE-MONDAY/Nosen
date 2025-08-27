export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  ensRegistry: string;
  publicResolver: string;
  reverseRegistrar: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  // Lisk Sepolia Testnet
  liskSepolia: {
    chainId: 4202,
    name: 'Lisk Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.lisk.com',
    blockExplorer: 'https://sepolia-blockscout.lisk.com',
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // Placeholder - needs actual deployment
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41', // Placeholder
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148', // Placeholder
    nativeCurrency: {
      name: 'Lisk',
      symbol: 'LSK',
      decimals: 18,
    },
  },
  
  // Ethereum Sepolia Testnet (for testing ENS functionality)
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
  },
  
  // Ethereum Mainnet (for reference)
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3',
    blockExplorer: 'https://etherscan.io',
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148',
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

// ENS configuration
export const ENS_CONFIG = {
  // The parent domain that users will get subdomains from
  parentDomain: process.env.NEXT_PUBLIC_ENS_PARENT_DOMAIN || 'nosen.eth',
  
  // Gas settings
  gasLimit: {
    createSubdomain: 200000, // Estimated gas for subdomain creation
    setResolver: 100000,     // Estimated gas for setting resolver
    setContentHash: 80000,   // Estimated gas for setting content hash
    setText: 50000,          // Estimated gas for each text record
  },
  
  // Transaction confirmation settings
  confirmations: 2, // Number of block confirmations to wait for
};
