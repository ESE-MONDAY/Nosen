export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  ensRegistry: string;
  publicResolver: string;
  reverseRegistrar: string;
  // L2 ENS specific fields
  isL2: boolean;
  l2ENSRegistrar?: string;
  ccipGateway?: string;
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
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // L1 ENS Registry
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41', // L1 Public Resolver
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148', // L1 Reverse Registrar
    isL2: true,
    l2ENSRegistrar: process.env.NEXT_PUBLIC_LISK_ENS_REGISTRAR || '0x0000000000000000000000000000000000000000', // L2 ENS Registrar contract
    ccipGateway: process.env.NEXT_PUBLIC_CCIP_GATEWAY || 'https://ccip.ens.domains', // CCIP Gateway
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
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148',
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
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    publicResolver: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    reverseRegistrar: '0x084b1c3C81545d370f3634392De611CaaBFf8148',
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

// ENS configuration
export const ENS_CONFIG = {
  // The parent domain that users will get subdomains from (L1)
  parentDomain: process.env.NEXT_PUBLIC_ENS_PARENT_DOMAIN || 'nosen.eth',
  
  // L2 ENS settings
  useL2: true, // Enable L2 subname creation
  l2ChainId: 4202, // Lisk Sepolia chain ID
  
  // CCIP Read configuration
  ccipRead: {
    enabled: true,
    timeout: 30000, // 30 seconds
    retries: 3,
  },
  
  // Gas settings (much lower on L2)
  gasLimit: {
    createSubdomain: 50000,  // Reduced from 200000 for L2
    setResolver: 25000,      // Reduced from 100000 for L2
    setContentHash: 15000,   // Reduced from 80000 for L2
    setText: 10000,          // Reduced from 50000 for L2
  },
  
  // Transaction confirmation settings
  confirmations: 1, // Reduced from 2 for L2 (faster finality)
};
