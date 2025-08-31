import { ethers } from 'ethers';
import { NETWORKS, ENS_CONFIG } from '../config/networks';

// L2 ENS Registrar ABI (from your deployed contract)
const L2_ENS_REGISTRAR_ABI = [
    'function registerSubdomain(string calldata subdomain, uint256 duration) external payable',
    'function renewSubdomain(string calldata subdomain, uint256 duration) external payable',
    'function transferSubdomain(string calldata subdomain, address to) external',
    'function getSubdomainInfo(string calldata subdomain) external view returns (address owner, uint256 expiry, bool exists)',
    'function isSubdomainAvailable(string calldata subdomain) external view returns (bool)',
    'function getRegistrationFee(string calldata subdomain) external view returns (uint256)',
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
        console.log('ENS Service: Initializing provider...');
        
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                console.log('ENS Service: Creating browser provider...');
                this.provider = new ethers.BrowserProvider(window.ethereum);
                console.log('ENS Service: Getting signer...');
                this.signer = await this.provider.getSigner();
                console.log('ENS Service: Getting network...');
                this.network = await this.provider.getNetwork();
                console.log('ENS Service: Current network:', this.network);
                
                // Initialize L2 provider for Lisk Sepolia
                console.log('ENS Service: Initializing L2 provider...');
                this.l2Provider = new ethers.BrowserProvider(window.ethereum);
                console.log('ENS Service: Getting L2 signer...');
                this.l2Signer = await this.l2Provider.getSigner();
                console.log('ENS Service: L2 provider and signer initialized');
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', () => {
                    console.log('ENS Service: Account changed, reinitializing...');
                    this.initializeProvider();
                });
                
                // Listen for chain changes
                window.ethereum.on('chainChanged', () => {
                    console.log('ENS Service: Chain changed, reinitializing...');
                    this.initializeProvider();
                });
            } catch (error) {
                console.error('ENS Service: Failed to initialize provider:', error);
            }
        } else {
            console.log('ENS Service: No window.ethereum available');
        }
    }

    async switchNetwork(targetChainId?: number): Promise<boolean> {
        console.log('ENS Service: Attempting to switch network to:', targetChainId);
        
        if (!this.provider || !window.ethereum) {
            console.error('ENS Service: No provider available for network switch');
            throw new Error('No provider available');
        }

        try {
            const currentChainId = await this.provider.send('eth_chainId', []);
            console.log('ENS Service: Current chain ID:', currentChainId);
            
            const targetId = targetChainId || this.network.chainId;
            console.log('ENS Service: Target chain ID:', targetId);
            
            if (currentChainId === `0x${targetId.toString(16)}`) {
                console.log('ENS Service: Already on target network');
                return true; // Already on target network
            }

            console.log('ENS Service: Switching network...');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetId.toString(16)}` }],
            });

            console.log('ENS Service: Network switch successful, refreshing provider...');
            // Refresh provider after switch
            await this.initializeProvider();
            return true;
        } catch (switchError: any) {
            console.error('ENS Service: Network switch error:', switchError);
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
                console.log('ENS Service: Network not found, attempting to add it...');
                try {
                    const { NETWORKS } = await import('../config/networks');
                    const chainIdToAdd = targetChainId || this.network.chainId;
                    const networkConfig = Object.values(NETWORKS).find((n: any) => n.chainId === chainIdToAdd);
                    
                    if (networkConfig) {
                        console.log('ENS Service: Adding network:', networkConfig);
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: `0x${chainIdToAdd.toString(16)}`,
                                chainName: networkConfig.name,
                                nativeCurrency: networkConfig.nativeCurrency,
                                rpcUrls: [networkConfig.rpcUrl],
                                blockExplorerUrls: [networkConfig.blockExplorer]
                            }],
                        });
                        
                        console.log('ENS Service: Network added successfully, refreshing provider...');
                        await this.initializeProvider();
                        return true;
                    } else {
                        console.error('ENS Service: Network config not found for chain ID:', chainIdToAdd);
                        throw new Error('Network configuration not found');
                    }
                } catch (addError) {
                    console.error('ENS Service: Failed to add network:', addError);
                    throw new Error('Failed to add network');
                }
            }
            throw switchError;
        }
    }

    // Check if L2 ENS Registrar contract is accessible
    async checkL2ContractAccessibility(): Promise<{ accessible: boolean; error?: string }> {
        try {
            console.log('ENS Service: Checking L2 contract accessibility...');
            
            if (!this.l2Provider) {
                return { accessible: false, error: 'L2 provider not initialized' };
            }

            const network = await this.l2Provider.getNetwork();
            console.log('ENS Service: Current network for contract check:', network.chainId.toString());
            
            if (network.chainId !== BigInt(4202)) {
                return { accessible: false, error: 'Not on Lisk Sepolia L2 network' };
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            console.log('ENS Service: Contract address:', L2ENSRegistrarContract.address);
            
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Provider
            );

            // Try to call a simple view function to check if contract is accessible
            console.log('ENS Service: Testing contract accessibility...');
            const parentDomain = await contract.parentDomain();
            console.log('ENS Service: Parent domain from contract:', parentDomain);
            
            return { accessible: true };
        } catch (error: any) {
            console.error('ENS Service: Contract accessibility check failed:', error);
            return { accessible: false, error: error.message };
        }
    }

    // Register a new L2 subdomain
    async registerL2Subdomain(
        subdomain: string, 
        duration: number, 
        fee: bigint
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            console.log('ENS Service: Registering L2 subdomain:', subdomain);
            
            if (!this.l2Provider || !this.l2Signer) {
                throw new Error('L2 provider not initialized');
            }

            const network = await this.l2Provider.getNetwork();
            if (network.chainId !== BigInt(4202)) {
                throw new Error('Must be connected to Lisk Sepolia L2 network');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Signer
            );

            console.log('ENS Service: Calling registerSubdomain...');
            // registerSubdomain takes (subdomain, duration) and owner is msg.sender
            const tx = await contract.registerSubdomain(subdomain, duration, { value: fee });
            console.log('ENS Service: Transaction sent:', tx.hash);
            
            const receipt = await tx.wait();
            console.log('ENS Service: Transaction confirmed:', receipt.hash);

            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error: any) {
            console.error('ENS Service: Error registering subdomain:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get subdomain info for a specific owner
    async getUserSubdomain(owner: string): Promise<string | null> {
        try {
            console.log('ENS Service: Getting user subdomain for owner:', owner);
            
            if (!this.l2Provider) {
                throw new Error('L2 provider not initialized');
            }

            const network = await this.l2Provider.getNetwork();
            if (network.chainId !== BigInt(4202)) {
                throw new Error('Must be connected to Lisk Sepolia L2 network');
            }

            const { L2ENSRegistrarContract } = await import('../app/abi');
            const contract = new ethers.Contract(
                L2ENSRegistrarContract.address,
                L2_ENS_REGISTRAR_ABI,
                this.l2Provider
            );

            // Get all subdomains owned by this address
            const subdomains = await contract.getOwnerSubdomains(owner);
            console.log('ENS Service: User subdomains:', subdomains);

            // Return the first subdomain if any exist
            return subdomains.length > 0 ? subdomains[0] : null;
        } catch (error: any) {
            console.error('ENS Service: Error getting user subdomain:', error);
            return null;
        }
    }

    async checkSubdomainAvailability(subdomain: string): Promise<{ available: boolean; price?: string; error?: string }> {
        try {
            console.log('ENS Service: Starting subdomain availability check for:', subdomain);
            
            if (!this.l2Provider || !this.l2Signer) {
                console.error('ENS Service: L2 provider or signer not initialized');
                throw new Error('L2 provider not initialized');
            }

            console.log('ENS Service: L2 provider and signer are initialized');

            // Check if we're on L2 network
            const network = await this.l2Provider.getNetwork();
            console.log('ENS Service: Current network chain ID:', network.chainId.toString());
            
            const isL2 = network.chainId === BigInt(4202); // Lisk Sepolia
            console.log('ENS Service: Is L2 network:', isL2);

            if (isL2) {
                console.log('ENS Service: Using L2 ENS Registrar');
                // Use L2 ENS Registrar
                const { L2ENSRegistrarContract } = await import('../app/abi');
                console.log('ENS Service: L2ENSRegistrarContract address:', L2ENSRegistrarContract.address);
                
                const contract = new ethers.Contract(
                    L2ENSRegistrarContract.address,
                    L2_ENS_REGISTRAR_ABI,
                    this.l2Signer
                );
                console.log('ENS Service: Contract instance created');

                console.log('ENS Service: Calling isSubdomainAvailable...');
                const isAvailable = await Promise.race([
                    contract.isSubdomainAvailable(subdomain),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Contract call timeout after 30 seconds')), 30000)
                    )
                ]);
                console.log('ENS Service: Subdomain available:', isAvailable);
                
                if (isAvailable) {
                    console.log('ENS Service: Getting registration fee...');
                    const fee = await Promise.race([
                        contract.getRegistrationFee(subdomain), // Changed to subdomain only
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Fee calculation timeout after 30 seconds')), 30000)
                        )
                    ]);
                    console.log('ENS Service: Registration fee:', fee.toString());
                    
                    return {
                        available: true,
                        price: ethers.formatEther(fee)
                    };
                } else {
                    return { available: false };
                }
            } else {
                console.log('ENS Service: Not on L2 network, cannot check availability');
                throw new Error('Must be connected to Lisk Sepolia L2 network to check subdomain availability');
            }
        } catch (error: any) {
            console.error('ENS Service: Error checking subdomain availability:', error);
            return {
                available: false,
                error: error.message
            };
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

            // getRegistrationFee only takes subdomain parameter, not duration
            const fee = await contract.getRegistrationFee(subdomain);
            return ethers.formatEther(fee);
        } catch (error: any) {
            console.error('Error getting registration fee:', error);
            throw new Error('Failed to get registration fee');
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

    // Get profile data from IPFS
    async getProfileDataFromIPFS(identifier: string): Promise<any> {
        // For now, return mock data
        // In production, this would retrieve data from IPFS
        console.log('ENS Service: Retrieving profile data from IPFS:', identifier);
        return {
            name: 'Mock Profile',
            role: 'Developer',
            company: 'Example Corp',
            bio: 'This is a mock profile for testing purposes.',
            avatar: '',
            social: {}
        };
    }

    async resolveENSProfile(subdomain: string): Promise<{ profile?: any; error?: string }> {
        try {
            const network = await this.l2Provider?.getNetwork();
            const isL2 = network?.chainId === BigInt(4202);

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
            return network.chainId === BigInt(4202); // Lisk Sepolia
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

    // Store profile data on IPFS (public method)
    async storeProfileDataOnIPFS(profileData: any): Promise<string> {
        // For now, return a mock IPFS hash
        // In production, this would upload to IPFS and return the actual hash
        console.log('ENS Service: Storing profile data on IPFS:', profileData);
        return `ipfs://${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Update ENS profile with IPFS hash
    async updateENSProfile(subdomain: string, ipfsHash: string): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('ENS Service: Updating ENS profile for subdomain:', subdomain);
            
            // For now, just log the update
            // In production, this would update the ENS resolver with the IPFS hash
            console.log('ENS Service: Profile updated with IPFS hash:', ipfsHash);
            
            return { success: true };
        } catch (error: any) {
            console.error('ENS Service: Error updating ENS profile:', error);
            return { success: false, error: error.message };
        }
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

