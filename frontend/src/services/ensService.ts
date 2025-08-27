import { ethers } from 'ethers';
import { getCurrentNetwork, IPFS_CONFIG, ENS_CONFIG } from '../config/networks';

// ENS Registry ABI (simplified for the functions we need)
const ENS_REGISTRY_ABI = [
  'function owner(bytes32 node) external view returns (address)',
  'function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external',
  'function setResolver(bytes32 node, address resolver) external'
];

// Public Resolver ABI (simplified)
const PUBLIC_RESOLVER_ABI = [
  'function setContenthash(bytes32 node, bytes calldata hash) external',
  'function setText(bytes32 node, string calldata key, string calldata value) external',
  'function setAddr(bytes32 node, address addr) external',
  'function contenthash(bytes32 node) external view returns (bytes memory)'
];

export interface ENSProfile {
  ensName: string;
  displayName: string;
  bio: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
  isVerified: boolean;
  createdAt: string;
  ipfsHash?: string;
}

export class ENSService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private network: ReturnType<typeof getCurrentNetwork>;

  constructor() {
    this.network = getCurrentNetwork();
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Check if we're on the correct network
        const network = await this.provider.getNetwork();
        if (network.chainId !== BigInt(this.network.chainId)) {
          console.warn(`Expected chain ID ${this.network.chainId}, got ${network.chainId}`);
        }
      } catch (error) {
        console.error('Failed to initialize provider:', error);
      }
    }
  }

  /**
   * Switch to the correct network
   */
  async switchNetwork(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${this.network.chainId.toString(16)}` }],
        });
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${this.network.chainId.toString(16)}`,
              chainName: this.network.name,
              nativeCurrency: this.network.nativeCurrency,
              rpcUrls: [this.network.rpcUrl],
              blockExplorerUrls: [this.network.blockExplorer],
            }],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          return false;
        }
      }
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  /**
   * Check if a subdomain is available
   */
  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const ensRegistry = new ethers.Contract(
        this.network.ensRegistry,
        ENS_REGISTRY_ABI,
        this.provider
      );

      const nodeHash = ethers.namehash(`${subdomain}.${ENS_CONFIG.parentDomain}`);
      const owner = await ensRegistry.owner(nodeHash);

      // If owner is zero address, subdomain is available
      return owner === ethers.ZeroAddress;
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      throw new Error('Failed to check subdomain availability');
    }
  }

  /**
   * Upload profile metadata to IPFS using HTTP gateway
   */
  async uploadToIPFS(profile: ENSProfile): Promise<string> {
    try {
      // Remove sensitive fields before uploading
      const uploadData = {
        name: profile.displayName,
        description: profile.bio,
        avatar: profile.avatar,
        website: profile.website,
        twitter: profile.twitter,
        github: profile.github,
        created_at: profile.createdAt,
        version: '1.0.0'
      };

      const data = JSON.stringify(uploadData);
      
      // For now, we'll simulate IPFS upload by creating a hash
      // In production, you'd use a real IPFS service like:
      // - Pinata API
      // - Infura IPFS API
      // - Web3.Storage API
      // - Or your own IPFS node
      
      // Simulate IPFS hash (this would be the actual IPFS CID in production)
      const hash = this.generateMockIPFSHash(data);
      console.log('Profile data prepared for IPFS:', uploadData);
      console.log('Mock IPFS hash generated:', hash);
      
      return hash;
    } catch (error) {
      console.error('Error preparing profile for IPFS:', error);
      throw new Error('Failed to prepare profile for IPFS');
    }
  }

  /**
   * Generate a mock IPFS hash for development
   * In production, this would be replaced with actual IPFS upload
   */
  private generateMockIPFSHash(data: string): string {
    // Create a simple hash from the data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Simple hash function (not cryptographically secure, just for demo)
    let hash = 0;
    for (let i = 0; i < dataBuffer.length; i++) {
      const char = dataBuffer[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to base58-like string (simulating IPFS CID)
    const hashHex = Math.abs(hash).toString(16);
    return `Qm${hashHex.padStart(44, '0')}`;
  }

  /**
   * Create ENS subdomain and set profile data
   */
  async createENSProfile(subdomain: string, profile: ENSProfile): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('Signer not initialized');
      }

      // Ensure we're on the correct network
      const isCorrectNetwork = await this.switchNetwork();
      if (!isCorrectNetwork) {
        throw new Error('Failed to switch to correct network');
      }

      // Check availability first
      const isAvailable = await this.checkSubdomainAvailability(subdomain);
      if (!isAvailable) {
        throw new Error('Subdomain is already taken');
      }

      // Upload profile to IPFS
      const ipfsHash = await this.uploadToIPFS(profile);
      console.log('Profile prepared for IPFS:', ipfsHash);

      // Get the signer's address
      const signerAddress = await this.signer.getAddress();

      // Create ENS Registry contract instance
      const ensRegistry = new ethers.Contract(
        this.network.ensRegistry,
        ENS_REGISTRY_ABI,
        this.signer
      );

      // Create the subdomain
      const nodeHash = ethers.namehash(ENS_CONFIG.parentDomain);
      const labelHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
      
      console.log('Creating subdomain:', `${subdomain}.${ENS_CONFIG.parentDomain}`);
      console.log('Node hash:', nodeHash);
      console.log('Label hash:', labelHash);

      // Set the subdomain record with gas limit
      const createTx = await ensRegistry.setSubnodeRecord(
        nodeHash,
        labelHash,
        signerAddress,
        this.network.publicResolver,
        0,
        { gasLimit: ENS_CONFIG.gasLimit.createSubdomain }
      );

      console.log('Subdomain creation transaction:', createTx.hash);
      await createTx.wait(ENS_CONFIG.confirmations);
      console.log('Subdomain created successfully');

      // Set the resolver
      const setResolverTx = await ensRegistry.setResolver(
        ethers.namehash(`${subdomain}.${ENS_CONFIG.parentDomain}`),
        this.network.publicResolver,
        { gasLimit: ENS_CONFIG.gasLimit.setResolver }
      );

      console.log('Resolver set transaction:', setResolverTx.hash);
      await setResolverTx.wait(ENS_CONFIG.confirmations);
      console.log('Resolver set successfully');

      // Update the resolver with profile data
      const resolver = new ethers.Contract(
        this.network.publicResolver,
        PUBLIC_RESOLVER_ABI,
        this.signer
      );

      const profileNodeHash = ethers.namehash(`${subdomain}.${ENS_CONFIG.parentDomain}`);

      // Set content hash (IPFS hash)
      const contentHash = this.encodeContenthash(ipfsHash);
      const setContentHashTx = await resolver.setContenthash(
        profileNodeHash, 
        contentHash,
        { gasLimit: ENS_CONFIG.gasLimit.setContentHash }
      );
      console.log('Content hash set transaction:', setContentHashTx.hash);
      await setContentHashTx.wait(ENS_CONFIG.confirmations);

      // Set text records
      const setTextPromises = [];
      
      if (profile.displayName) {
        setTextPromises.push(
          resolver.setText(profileNodeHash, 'name', profile.displayName, { gasLimit: ENS_CONFIG.gasLimit.setText })
        );
      }
      
      if (profile.bio) {
        setTextPromises.push(
          resolver.setText(profileNodeHash, 'description', profile.bio, { gasLimit: ENS_CONFIG.gasLimit.setText })
        );
      }
      
      if (profile.website) {
        setTextPromises.push(
          resolver.setText(profileNodeHash, 'url', profile.website, { gasLimit: ENS_CONFIG.gasLimit.setText })
        );
      }
      
      if (profile.twitter) {
        setTextPromises.push(
          resolver.setText(profileNodeHash, 'com.twitter', profile.twitter, { gasLimit: ENS_CONFIG.gasLimit.setText })
        );
      }
      
      if (profile.github) {
        setTextPromises.push(
          resolver.setText(profileNodeHash, 'com.github', profile.github, { gasLimit: ENS_CONFIG.gasLimit.setText })
        );
      }

      // Wait for all text records to be set
      if (setTextPromises.length > 0) {
        const textTxs = await Promise.all(setTextPromises);
        console.log('Text records set:', textTxs.length);
        
        for (const tx of textTxs) {
          await tx.wait(ENS_CONFIG.confirmations);
        }
      }

      console.log('ENS profile created successfully!');
      return ipfsHash;

    } catch (error) {
      console.error('Error creating ENS profile:', error);
      throw error;
    }
  }

  /**
   * Encode IPFS hash for ENS contenthash
   */
  private encodeContenthash(ipfsHash: string): string {
    // For now, we'll use a simple hex encoding
    // In production with real IPFS, you'd use proper base58/base32 encoding
    if (ipfsHash.startsWith('Qm')) {
      // Convert mock IPFS hash to hex format
      const hashHex = ipfsHash.slice(2); // Remove 'Qm' prefix
      return '0x' + hashHex;
    }
    
    throw new Error('Invalid IPFS hash format');
  }

  /**
   * Resolve ENS profile from blockchain
   */
  async resolveENSProfile(ensName: string): Promise<ENSProfile | null> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const resolver = new ethers.Contract(
        this.network.publicResolver,
        PUBLIC_RESOLVER_ABI,
        this.provider
      );

      const nodeHash = ethers.namehash(ensName);

      // Get content hash (IPFS hash)
      const contentHash = await resolver.contenthash(nodeHash);
      
      if (!contentHash || contentHash === '0x') {
        return null;
      }

      // Decode content hash to get IPFS hash
      const ipfsHash = this.decodeContenthash(contentHash);
      
      // Fetch profile data from IPFS
      const profileData = await this.fetchFromIPFS(ipfsHash);
      
      return {
        ensName,
        displayName: profileData.name || '',
        bio: profileData.description || '',
        avatar: profileData.avatar,
        website: profileData.website,
        twitter: profileData.twitter,
        github: profileData.github,
        isVerified: true,
        createdAt: profileData.created_at || new Date().toISOString(),
        ipfsHash
      };

    } catch (error) {
      console.error('Error resolving ENS profile:', error);
      return null;
    }
  }

  /**
   * Decode ENS contenthash to IPFS hash
   */
  private decodeContenthash(contentHash: string): string {
    if (contentHash.startsWith('0x')) {
      contentHash = contentHash.slice(2);
    }
    
    // For now, convert back to mock IPFS format
    // In production, you'd use proper base58/base32 decoding
    return `Qm${contentHash}`;
  }

  /**
   * Fetch data from IPFS using HTTP gateway
   */
  private async fetchFromIPFS(ipfsHash: string): Promise<any> {
    try {
      // Try to fetch from IPFS gateway
      const response = await fetch(`${IPFS_CONFIG.gateway}${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      return JSON.parse(data);
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      throw new Error('Failed to fetch profile from IPFS');
    }
  }

  /**
   * Get gas estimate for profile creation
   */
  async estimateGasForProfileCreation(subdomain: string): Promise<bigint> {
    try {
      if (!this.signer) {
        throw new Error('Signer not initialized');
      }

      const ensRegistry = new ethers.Contract(
        this.network.ensRegistry,
        ENS_REGISTRY_ABI,
        this.signer
      );

      const nodeHash = ethers.namehash(ENS_CONFIG.parentDomain);
      const labelHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
      const signerAddress = await this.signer.getAddress();

      const gasEstimate = await ensRegistry.setSubnodeRecord.estimateGas(
        nodeHash,
        labelHash,
        signerAddress,
        this.network.publicResolver,
        0
      );

      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  /**
   * Get current network info
   */
  getCurrentNetwork() {
    return this.network;
  }
}

// Export singleton instance
export const ensService = new ENSService();
