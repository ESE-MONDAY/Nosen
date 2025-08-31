import { ethers } from 'ethers';
import { NETWORKS, ENS_CONFIG } from '../config/networks';

// L2 ENS Registrar ABI (from your deployed contract)
const L2_ENS_REGISTRAR_ABI = [
    'function registerSubdomain(string calldata subdomain, address owner, uint256 duration) external payable',
    'function renewSubdomain(string calldata subdomain, uint256 duration) external payable',
    'function transferSubdomain(string calldata subdomain, address to) external',
    'function getSubdomainInfo(string calldata subdomain) external view returns (address owner, uint256 expiry, bool exists)',
    'function isSubdomainAvailable(string calldata subdomain) external view returns (bool)',
    'function getRegistrationFee(string calldata subdomain, uint256 duration) external view returns (uint256)',
    'function getFullENSName(string calldata subdomain) external view returns (string)',
    'function getOwnerSubdomains(address owner) external view returns (string[] memory)',
    'function supportsCCIPRead() external view returns (bool)',
    'function baseRegistrationFee() external view returns (uint256)',
    'function parentDomain() external view returns (string)',
    'function minRegistrationDuration() external view returns (uint256)',
    'function maxRegistrationDuration() external view returns (uint256)'
];

// Public Resolver ABI for L1 ENS
const PUBLIC_RESOLVER_ABI = [
    'function setText(bytes32 node, string calldata key, string calldata value) external',
    'function setContenthash(bytes32 node, bytes calldata hash) external',
    'function text(bytes32 node, string calldata key) external view returns (string memory)',
    'function contenthash(bytes32 node) external view returns (bytes memory)',
    'function resolve(bytes calldata name, bytes calldata data) external view returns (bytes memory)',
    'function resolveWithProof(bytes calldata name, bytes calldata data) external view returns (bytes memory, bytes memory)'
];

// ENS Registry ABI
const ENS_REGISTRY_ABI = [
    'function setSubnodeRecord(bytes32 parent, bytes32 label, address owner, address resolver, uint64 ttl) external',
    'function setResolver(bytes32 node, address resolver) external',
    'function owner(bytes32 node) external view returns (address)',
    'function resolver(bytes32 node) external view returns (address)',
    'function ttl(bytes32 node) external view returns (uint64)'
];

interface CCIPResponse {
    data: string;
    signature: string;
    timestamp: number;
}

export class ENSService {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.Signer | null = null;
    private network: any = null;
    private l2Provider: ethers.BrowserProvider | null = null;
    private l2Signer: ethers.Signer | null = null;

    constructor() {
        this.initializeProvider();
    }

    private async initializeProvider() {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.signer = await this.provider.getSigner();
                this.network = await this.provider.getNetwork();
                
                // Initialize L2 provider for Lisk Sepolia
                this.l2Provider = new ethers.BrowserProvider(window.ethereum);
                this.l2Signer = await this.l2Provider.getSigner();
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', () => {
                    this.initializeProvider();
                });
                
                // Listen for chain changes
                window.ethereum.on('chainChanged', () => {
                    this.initializeProvider();
                });
            } catch (error) {
                console.error('Failed to initialize provider:', error);
            }
        }
    }

    async switchNetwork(targetChainId?: number): Promise<boolean> {
        if (!this.provider || !window.ethereum) {
            throw new Error('No provider available');
        }

        try {
            const currentChainId = await this.provider.send('eth_chainId', []);
            const targetId = targetChainId || this.network.chainId;
            
            if (currentChainId === `0x${targetId.toString(16)}`) {
                return true; // Already on target network
            }

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetId.toString(16)}` }],
            });

            // Refresh provider after switch
            await this.initializeProvider();
            return true;
        } catch (switchError: any) {
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    const { NETWORKS } = await import('../config/networks');
                    const chainIdToAdd = targetChainId || this.network.chainId;
                    const networkConfig = Object.values(NETWORKS).find((n: any) => n.chainId === chainIdToAdd);
                    
                    if (networkConfig) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: `0x${chainIdToAdd.toString(16)}`,
                                chainName: networkConfig.name,
                                nativeCurrency: networkConfig.nativeCurrency,
                                rpcUrls: networkConfig.rpcUrls,
                                blockExplorerUrls: networkConfig.blockExplorerUrls ? [networkConfig.blockExplorerUrls] : []
                            }],
                        });
                        
                        await this.initializeProvider();
                        return true;
                    }
                } catch (addError) {
                    console.error('Failed to add network:', addError);
                    throw new Error('Failed to add network');
                }
            }
            throw switchError;
        }
    }

    async checkSubdomainAvailability(subdomain: string): Promise<{ available: boolean; price?: string; error?: string }> {
        try {
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            // Check if we're on L2 network
            const network = await this.l2Provider.getNetwork();
            const isL2 = network.chainId === 4202n; // Lisk Sepolia

            if (isL2) {
                // Use L2 ENS Registrar
                const { L2ENSRegistrarContract } = await import('../app/abi');
                const contract = new ethers.Contract(
                    L2ENSRegistrarContract.address,
                    L2_ENS_REGISTRAR_ABI,
                    this.l2Signer
                );

                const isAvailable = await contract.isSubdomainAvailable(subdomain);
                if (isAvailable) {
                    const fee = await contract.getRegistrationFee(subdomain, 365 * 24 * 60 * 60); // 1 year
                    return {
                        available: true,
                        price: ethers.formatEther(fee)
                    };
                } else {
                    return { available: false };
                }
            } else {
                // Fallback to L1 ENS check
                return await this.checkL1SubdomainAvailability(subdomain);
            }
        } catch (error: any) {
            console.error('Error checking subdomain availability:', error);
            return {
                available: false,
                error: error.message
            };
        }
    }

    private async checkL1SubdomainAvailability(subdomain: string): Promise<{ available: boolean; price?: string; error?: string }> {
        try {
            if (!this.provider) {
                throw new Error('Provider not initialized');
            }

            const fullName = `${subdomain}.${ENS_CONFIG.parentDomain}`;
            const namehash = ethers.namehash(fullName);
            
            const registry = new ethers.Contract(
                '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
                ENS_REGISTRY_ABI,
                this.provider
            );
            
            const owner = await registry.owner(namehash);
            return { available: owner === ethers.ZeroAddress };
        } catch (error: any) {
            return { available: false, error: error.message };
        }
    }

    async getSubdomainRegistrationFee(subdomain: string, duration: number = 365 * 24 * 60 * 60): Promise<string> {
        try {
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Signer
            );

            const fee = await contract.getRegistrationFee(subdomain, duration);
            return ethers.formatEther(fee);
        } catch (error: any) {
            console.error('Error getting registration fee:', error);
            throw new Error('Failed to get registration fee');
        }
    }

    async createENSProfile(
        subdomain: string,
        profileData: {
            name: string;
            role: string;
            company: string;
            bio: string;
            avatar: string;
            social: {
                twitter?: string;
                linkedin?: string;
                github?: string;
                website?: string;
            };
        },
        duration: number = 365 * 24 * 60 * 60
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            // Switch to L2 network if needed
            await this.switchNetwork(4202); // Lisk Sepolia

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Signer
            );

            // Get registration fee
            const fee = await contract.getRegistrationFee(subdomain, duration);
            
            // Register subdomain
            const tx = await contract.registerSubdomain(subdomain, await this.l2Signer.getAddress(), duration, {
                value: fee
            });

            const receipt = await tx.wait();
            
            // Store profile data on IPFS (you'll need to implement this)
            const ipfsCid = await this.storeProfileDataOnIPFS(profileData);
            
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error: any) {
            console.error('Error creating ENS profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async setProfileDataViaCCIP(
        subdomain: string,
        profileData: any
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // This would integrate with CCIP Read for cross-chain profile data
            // For now, we'll store on IPFS and link via the main contract
            const ipfsCid = await this.storeProfileDataOnIPFS(profileData);
            
            // Link the profile data to the user's income source or document
            // This will be handled by the main Nosen contract
            
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    async resolveENSProfile(subdomain: string): Promise<{ profile?: any; error?: string }> {
        try {
            const network = await this.l2Provider?.getNetwork();
            const isL2 = network?.chainId === 4202n;

            if (isL2) {
                return await this.resolveL2Profile(subdomain);
            } else {
                return await this.resolveL1Profile(subdomain);
            }
        } catch (error: any) {
            return { error: error.message };
        }
    }

    private async resolveL2Profile(subdomain: string): Promise<{ profile?: any; error?: string }> {
        try {
            if (!this.l2Provider) {
                throw new Error('L2 provider not initialized');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Provider
            );

            const info = await contract.getSubdomainInfo(subdomain);
            if (!info.exists) {
                return { error: 'Profile not found' };
            }

            // Get profile data from IPFS (you'll need to implement this)
            const profileData = await this.getProfileDataFromIPFS(subdomain);
            
            return { profile: profileData };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    private async resolveL1Profile(subdomain: string): Promise<{ profile?: any; error?: string }> {
        try {
            if (!this.provider) {
                throw new Error('Provider not initialized');
            }

            const fullName = `${subdomain}.${ENS_CONFIG.parentDomain}`;
            const namehash = ethers.namehash(fullName);
            
            const resolver = new ethers.Contract(
                '0x4976fb03C32e5B8cfe2b6cA31D7B3fC3D5A9C6B8',
                PUBLIC_RESOLVER_ABI,
                this.provider
            );
            
            const contentHash = await resolver.contenthash(namehash);
            if (contentHash === '0x') {
                return { error: 'Profile not found' };
            }

            // Decode IPFS hash and fetch profile data
            const profileData = await this.getProfileDataFromIPFS(contentHash);
            
            return { profile: profileData };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async estimateGasForProfileCreation(subdomain: string, duration: number = 365 * 24 * 60 * 60): Promise<{ l2Gas?: string; l1Gas?: string; error?: string }> {
        try {
            const estimates: { l2Gas?: string; l1Gas?: string; error?: string } = {};

            // Estimate L2 gas
            try {
                if (this.l2Provider && this.l2Signer) {
                    const { L2ENSRegistrarContract } = await import('../app/abi');
                    const contract = new ethers.Contract(
                        L2ENSRegistrarContract.address,
                        L2_ENS_REGISTRAR_ABI,
                        this.l2Signer
                    );

                    const fee = await contract.getRegistrationFee(subdomain, duration);
                    const gasEstimate = await contract.registerSubdomain.estimateGas(
                        subdomain,
                        await this.l2Signer.getAddress(),
                        duration,
                        { value: fee }
                    );
                    
                    estimates.l2Gas = gasEstimate.toString();
                }
            } catch (error) {
                estimates.error = `L2 estimation failed: ${error}`;
            }

            // Estimate L1 gas (fallback)
            try {
                if (this.provider && this.signer) {
                    // This would be for L1 ENS operations
                    estimates.l1Gas = '200000'; // Default estimate
                }
            } catch (error) {
                if (!estimates.error) {
                    estimates.error = `L1 estimation failed: ${error}`;
                }
            }

            return estimates;
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async isL2Enabled(): Promise<boolean> {
        try {
            if (!this.l2Provider) return false;
            const network = await this.l2Provider.getNetwork();
            return network.chainId === 4202n; // Lisk Sepolia
        } catch {
            return false;
        }
    }

    async getL2SubdomainInfo(subdomain: string): Promise<{ owner: string; expiry: number; exists: boolean; error?: string }> {
        try {
            if (!this.l2Provider) {
                throw new Error('L2 provider not initialized');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Provider
            );

            const info = await contract.getSubdomainInfo(subdomain);
            return {
                owner: info.owner,
                expiry: Number(info.expiry),
                exists: info.exists
            };
        } catch (error: any) {
            return { owner: '', expiry: 0, exists: false, error: error.message };
        }
    }

    async renewL2Subdomain(subdomain: string, duration: number = 365 * 24 * 60 * 60): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Signer
            );

            const fee = await contract.getRegistrationFee(subdomain, duration);
            const tx = await contract.renewSubdomain(subdomain, duration, { value: fee });
            const receipt = await tx.wait();

            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async transferL2Subdomain(subdomain: string, to: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Signer
            );

            const tx = await contract.transferSubdomain(subdomain, to);
            const receipt = await tx.wait();

            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // IPFS helper functions (you'll need to implement these)
    private async storeProfileDataOnIPFS(profileData: any): Promise<string> {
        // Implement IPFS storage logic
        // This could use Pinata, Infura IPFS, or other services
        console.log('Storing profile data on IPFS:', profileData);
        return 'QmExampleIPFSHash'; // Placeholder
    }

    private async getProfileDataFromIPFS(identifier: string): Promise<any> {
        // Implement IPFS retrieval logic
        console.log('Retrieving profile data from IPFS:', identifier);
        return {}; // Placeholder
    }

    // Get current network info
    async getCurrentNetwork() {
        if (!this.provider) return null;
        try {
            const network = await this.provider.getNetwork();
            return {
                chainId: network.chainId,
                name: network.name
            };
        } catch {
            return null;
        }
    }

    // Check if wallet is connected
    async isWalletConnected(): Promise<boolean> {
        try {
            if (!this.provider) return false;
            const accounts = await this.provider.listAccounts();
            return accounts.length > 0;
        } catch {
            return false;
        }
    }

    // Get connected account
    async getConnectedAccount(): Promise<string | null> {
        try {
            if (!this.signer) return null;
            return await this.signer.getAddress();
        } catch {
            return null;
        }
    }
}

export const ensService = new ENSService();

