import { ethers } from 'ethers';

// Nosen Platform Contract Address
const NOSEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NOSEN_CONTRACT_ADDRESS || '0xD15bb0dcA1397156c7940d243cb80379B6552E57';

// Nosen Platform ABI (from your deployed contract)
const NOSEN_PLATFORM_ABI = [
    // Income Source Management
    'function addIncomeSource(string memory name, string memory role, uint256 monthlyAmount, string memory token, string memory network, string memory ensDomain, bool isRecurring, string memory frequency, string memory ipfsCid) external payable',
    'function updateIncomeSource(uint256 sourceId, string memory name, string memory role, uint256 monthlyAmount, string memory token, string memory network, string memory ensDomain, bool isRecurring, string memory frequency, string memory ipfsCid) external',
    'function verifyIncomeSource(uint256 sourceId) external',
    'function deactivateIncomeSource(uint256 sourceId) external',
    'function reactivateIncomeSource(uint256 sourceId) external',
    'function linkTransactionToSource(uint256 sourceId, string memory transactionHash) external',
    
    // Employer Management
    'function addEmployer(string memory name, string memory type, string memory contactPerson, string memory email, string memory phone, string memory website, string memory ensDomain, string memory ipfsCid, string[] memory supportedNetworks, string[] memory supportedTokens) external payable',
    'function verifyEmployer(uint256 employerId) external',
    'function updateEmployer(uint256 employerId, string memory name, string memory type, string memory contactPerson, string memory email, string memory phone, string memory website, string memory ensDomain, string[] memory supportedNetworks, string[] memory supportedTokens) external',
    'function deactivateEmployer(uint256 employerId) external',
    
    // Document Management
    'function generateDocument(string memory title, string memory type, string memory purpose, string memory ipfsCid, uint256 validUntil, uint256 incomeAmount, string memory currency, string memory period, string[] memory networks, uint256[] memory sourceIds, string[] memory transactionProofs) external payable',
    'function verifyDocument(uint256 documentId) external',
    'function updateDocument(uint256 documentId, string memory title, string memory purpose, string memory ipfsCid, uint256 validUntil, uint256 incomeAmount, string memory currency, string memory period) external',
    'function checkDocumentExpiry(uint256 documentId) external view returns (bool)',
    
    // Reputation System
    'function getUserReputation(address user) external view returns (uint256 reputationScore, uint256 verificationsGiven, uint256 verificationsReceived, uint256 lastActivity)',
    'function canUserVerify(address user) external view returns (bool)',
    'function getVerificationProgress(uint256 itemId, string memory itemType) external view returns (uint256 currentCount, uint256 threshold, bool isVerified)',
    
    // View Functions
    'function getUserIncomeSources(address user) external view returns (uint256[] memory)',
    'function getIncomeSource(uint256 sourceId) external view returns (uint256 id, string memory name, string memory role, uint256 monthlyAmount, string memory token, string memory network, string memory ensDomain, bool isVerified, uint256 startDate, bool isRecurring, string memory frequency, string memory ipfsCid, address owner, uint256 createdAt, bool isActive, uint256 verificationCount, uint256 verificationThreshold, uint256 transactionCount)',
    'function getIncomeSourceTransactions(uint256 sourceId) external view returns (string[] memory)',
    'function getUserDocuments(address user) external view returns (uint256[] memory)',
    'function getDocument(uint256 documentId) external view returns (uint256 id, string memory title, string memory type, string memory purpose, string memory ipfsCid, uint256 generatedAt, uint256 validUntil, uint256 incomeAmount, string memory currency, string memory period, bool isVerified, address owner, bool isExpired, uint256 verificationCount, uint256 verificationThreshold)',
    'function getUserEmployers(address user) external view returns (uint256[] memory)',
    'function getEmployer(uint256 employerId) external view returns (uint256 id, string memory name, string memory type, bool isVerified, string memory contactPerson, string memory email, string memory phone, string memory website, string memory ensDomain, address owner, uint256 createdAt, bool isActive, uint256 totalVerifiedIncome, uint256 verifiedUsersCount, uint256 verificationCount, uint256 verificationThreshold)',
    
    // Verification Functions
    'function isIncomeSourceVerified(uint256 sourceId) external view returns (bool)',
    'function isDocumentVerified(uint256 documentId) external view returns (bool)',
    'function isEmployerVerified(uint256 employerId) external view returns (bool)',
    
    // Statistics Functions
    'function getIncomeSourceCount(address user) external view returns (uint256)',
    'function getDocumentCount(address user) external view returns (uint256)',
    'function getEmployerCount(address user) external view returns (uint256)',
    'function getContractStats() external view returns (uint256 totalIncomeSources, uint256 totalEmployers, uint256 totalDocuments, uint256 totalVerifiedIncomeSources, uint256 totalVerifiedEmployers, uint256 totalVerifiedDocuments)',
    'function getIncomeSourceStats(address user) external view returns (uint256 totalSources, uint256 verifiedSources, uint256 totalMonthlyIncome, uint256 totalTransactions)',
    'function getDocumentStats(address user) external view returns (uint256 totalDocuments, uint256 verifiedDocuments, uint256 expiredDocuments, uint256 validDocuments)',
    
    // Fee Functions
    'function incomeSourceFee() external view returns (uint256)',
    'function employerVerificationFee() external view returns (uint256)',
    'function documentGenerationFee() external view returns (uint256)',
    
    // Configuration Functions
    'function verificationThreshold() external view returns (uint256)',
    'function minimumReputationToVerify() external view returns (uint256)',
    
    // Events
    'event IncomeSourceAdded(address indexed user, uint256 indexed sourceId, string name, string network)',
    'event IncomeSourceUpdated(address indexed user, uint256 indexed sourceId)',
    'event IncomeSourceVerified(uint256 indexed sourceId, address indexed verifier, uint256 verificationCount)',
    'event TransactionLinked(uint256 indexed sourceId, string transactionHash)',
    'event DocumentGenerated(uint256 indexed documentId, address indexed owner, string type)',
    'event DocumentVerified(uint256 indexed documentId, address indexed verifier, uint256 verificationCount)',
    'event UserReputationUpdated(address indexed user, uint256 newScore, uint256 verificationsGiven)'
];

// Type definitions
export interface IncomeSource {
    id: number;
    name: string;
    role: string;
    monthlyAmount: string;
    token: string;
    network: string;
    ensDomain: string;
    isVerified: boolean;
    startDate: number;
    isRecurring: boolean;
    frequency: string;
    ipfsCid: string;
    owner: string;
    createdAt: number;
    isActive: boolean;
    verificationCount: number;
    verificationThreshold: number;
    transactionCount: number;
}

export interface Employer {
    id: number;
    name: string;
    type: string;
    isVerified: boolean;
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    ensDomain: string;
    owner: string;
    createdAt: number;
    isActive: boolean;
    totalVerifiedIncome: string;
    verifiedUsersCount: number;
    supportedNetworks: string[];
    supportedTokens: string[];
    verificationCount: number;
    verificationThreshold: number;
}

export interface Document {
    id: number;
    title: string;
    type: string;
    purpose: string;
    ipfsCid: string;
    generatedAt: number;
    validUntil: number;
    incomeAmount: string;
    currency: string;
    period: string;
    networks: string[];
    sourceIds: number[];
    isVerified: boolean;
    owner: string;
    isExpired: boolean;
    verificationCount: number;
    verificationThreshold: number;
    transactionProofs: string[];
}

export interface UserReputation {
    reputationScore: number;
    verificationsGiven: number;
    verificationsReceived: number;
}

export interface VerificationProgress {
    currentCount: number;
    threshold: number;
    isVerified: boolean;
}

export interface ContractStats {
    totalIncomeSources: number;
    totalEmployers: number;
    totalDocuments: number;
    totalVerifiedIncomeSources: number;
    totalVerifiedEmployers: number;
    totalVerifiedDocuments: number;
}

export interface IncomeSourceStats {
    totalSources: number;
    verifiedSources: number;
    totalMonthlyIncome: string;
    totalTransactions: number;
}

export interface DocumentStats {
    totalDocuments: number;
    verifiedDocuments: number;
    expiredDocuments: number;
    validDocuments: number;
}

export class NosenService {
    private contract: ethers.Contract | null = null;

    constructor() {}

    // Initialize contract with RainbowKit providers
    initializeContract(publicClient: any, walletClient: any) {
        if (!publicClient || !walletClient) {
            throw new Error('RainbowKit providers not available');
        }

        // Create contract instance with public client for reads
        this.contract = new ethers.Contract(
            NOSEN_CONTRACT_ADDRESS,
            NOSEN_PLATFORM_ABI,
            publicClient
        );

        return this.contract;
    }

    // ============ INCOME SOURCE MANAGEMENT ============

    async addIncomeSource(
        name: string,
        role: string,
        monthlyAmount: string,
        token: string,
        network: string,
        ensDomain: string,
        isRecurring: boolean,
        frequency: string,
        ipfsCid: string,
        walletClient: any
    ): Promise<{ success: boolean; sourceId?: number; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const fee = await this.contract.incomeSourceFee();
            const monthlyAmountWei = ethers.parseEther(monthlyAmount);

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('addIncomeSource', [
                name,
                role,
                monthlyAmountWei,
                token,
                network,
                ensDomain,
                isRecurring,
                frequency,
                ipfsCid
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data,
                value: fee
            });
            
            // Wait for transaction
            const receipt = await walletClient.waitForTransactionReceipt({ hash });
            
            // Get the source ID from the event
            const event = receipt.logs.find((log: any) => 
                log.eventName === 'IncomeSourceAdded'
            );
            
            const sourceId = event ? event.args.sourceId : null;

            return {
                success: true,
                sourceId: sourceId ? Number(sourceId) : undefined,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateIncomeSource(
        sourceId: number,
        name: string,
        role: string,
        monthlyAmount: string,
        token: string,
        network: string,
        ensDomain: string,
        isRecurring: boolean,
        frequency: string,
        ipfsCid: string,
        walletClient: any
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const monthlyAmountWei = ethers.parseEther(monthlyAmount);
            
            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('updateIncomeSource', [
                sourceId,
                name,
                role,
                monthlyAmountWei,
                token,
                network,
                ensDomain,
                isRecurring,
                frequency,
                ipfsCid
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyIncomeSource(sourceId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('verifyIncomeSource', [sourceId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async linkTransactionToSource(sourceId: number, transactionHash: string, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('linkTransactionToSource', [sourceId, transactionHash]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deactivateIncomeSource(sourceId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('deactivateIncomeSource', [sourceId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async reactivateIncomeSource(sourceId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('reactivateIncomeSource', [sourceId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============ EMPLOYER MANAGEMENT ============

    async addEmployer(
        name: string,
        type: string,
        contactPerson: string,
        email: string,
        phone: string,
        website: string,
        ensDomain: string,
        ipfsCid: string,
        supportedNetworks: string[],
        supportedTokens: string[],
        walletClient: any
    ): Promise<{ success: boolean; employerId?: number; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const fee = await this.contract.employerVerificationFee();

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('addEmployer', [
                name,
                type,
                contactPerson,
                email,
                phone,
                website,
                ensDomain,
                ipfsCid,
                supportedNetworks,
                supportedTokens
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data,
                value: fee
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });
            
            // Get the employer ID from the event
            const event = receipt.logs.find((log: any) => 
                log.eventName === 'EmployerAdded'
            );
            
            const employerId = event ? event.args.employerId : null;

            return {
                success: true,
                employerId: employerId ? Number(employerId) : undefined,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyEmployer(employerId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('verifyEmployer', [employerId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateEmployer(
        employerId: number,
        name: string,
        type: string,
        contactPerson: string,
        email: string,
        phone: string,
        website: string,
        ensDomain: string,
        supportedNetworks: string[],
        supportedTokens: string[],
        walletClient: any
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('updateEmployer', [
                employerId,
                name,
                type,
                contactPerson,
                email,
                phone,
                website,
                ensDomain,
                supportedNetworks,
                supportedTokens
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deactivateEmployer(employerId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('deactivateEmployer', [employerId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============ DOCUMENT MANAGEMENT ============

    async generateDocument(
        title: string,
        type: string,
        purpose: string,
        ipfsCid: string,
        validUntil: number,
        incomeAmount: string,
        currency: string,
        period: string,
        networks: string[],
        sourceIds: number[],
        transactionProofs: string[],
        walletClient: any
    ): Promise<{ success: boolean; documentId?: number; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const fee = await this.contract.documentGenerationFee();
            const incomeAmountWei = ethers.parseEther(incomeAmount);

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('generateDocument', [
                title,
                type,
                purpose,
                ipfsCid,
                validUntil,
                incomeAmountWei,
                currency,
                period,
                networks,
                sourceIds,
                transactionProofs
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data,
                value: fee
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });
            
            // Get the document ID from the event
            const event = receipt.logs.find((log: any) => 
                log.eventName === 'DocumentGenerated'
            );
            
            const documentId = event ? event.args.documentId : null;

            return {
                success: true,
                documentId: documentId ? Number(documentId) : undefined,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyDocument(documentId: number, walletClient: any): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('verifyDocument', [documentId]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateDocument(
        documentId: number,
        title: string,
        purpose: string,
        ipfsCid: string,
        validUntil: number,
        incomeAmount: string,
        currency: string,
        period: string,
        walletClient: any
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const incomeAmountWei = ethers.parseEther(incomeAmount);
            
            // Create transaction data
            const data = this.contract.interface.encodeFunctionData('updateDocument', [
                documentId,
                title,
                purpose,
                ipfsCid,
                validUntil,
                incomeAmountWei,
                currency,
                period
            ]);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                to: NOSEN_CONTRACT_ADDRESS,
                data
            });

            const receipt = await walletClient.waitForTransactionReceipt({ hash });

            return {
                success: true,
                txHash: hash
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ============ REPUTATION SYSTEM ============

    async getUserReputation(user: string): Promise<{ reputationScore: number; verificationsGiven: number; verificationsReceived: number } | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // For now, return default reputation to avoid contract call issues
            // These can be updated when the contract is properly deployed and configured
            return {
                reputationScore: 5, // Starting reputation
                verificationsGiven: 0,
                verificationsReceived: 0
            };

            // TODO: Uncomment this when contract is properly configured
            // const reputation = await this.contract.getUserReputation(user);
            // return {
            //     reputationScore: Number(reputation.reputationScore),
            //     verificationsGiven: Number(reputation.verificationsGiven),
            //     verificationsReceived: Number(reputation.verificationsReceived)
            // };
        } catch (error: any) {
            console.error('Error getting user reputation:', error);
            // Return default reputation as fallback
            return {
                reputationScore: 5,
                verificationsGiven: 0,
                verificationsReceived: 0
            };
        }
    }

    async canUserVerify(user: string): Promise<boolean> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            return await this.contract.canUserVerify(user);
        } catch (error: any) {
            console.error('Error checking if user can verify:', error);
            return false;
        }
    }

    async getVerificationProgress(itemId: number, itemType: string): Promise<VerificationProgress | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const progress = await this.contract.getVerificationProgress(itemId, itemType);
            return {
                currentCount: Number(progress.currentCount),
                threshold: Number(progress.threshold),
                isVerified: progress.isVerified
            };
        } catch (error: any) {
            console.error('Error getting verification progress:', error);
            return null;
        }
    }

    // ============ VIEW FUNCTIONS ============

    async getUserIncomeSources(user: string): Promise<number[]> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const sourceIds = await this.contract.getUserIncomeSources(user);
            return sourceIds.map((id: any) => Number(id));
        } catch (error: any) {
            console.error('Error getting user income sources:', error);
            return [];
        }
    }

    async getIncomeSource(sourceId: number): Promise<IncomeSource | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const source = await this.contract.getIncomeSource(sourceId);
            return {
                id: Number(source.id),
                name: source.name,
                role: source.role,
                monthlyAmount: ethers.formatEther(source.monthlyAmount),
                token: source.token,
                network: source.network,
                ensDomain: source.ensDomain,
                isVerified: source.isVerified,
                startDate: Number(source.startDate),
                isRecurring: source.isRecurring,
                frequency: source.frequency,
                ipfsCid: source.ipfsCid,
                owner: source.owner,
                createdAt: Number(source.createdAt),
                isActive: source.isActive,
                verificationCount: Number(source.verificationCount),
                verificationThreshold: Number(source.verificationThreshold),
                transactionCount: Number(source.transactionCount)
            };
        } catch (error: any) {
            console.error('Error getting income source:', error);
            return null;
        }
    }

    async getIncomeSourceTransactions(sourceId: number): Promise<string[]> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            return await this.contract.getIncomeSourceTransactions(sourceId);
        } catch (error: any) {
            console.error('Error getting income source transactions:', error);
            return [];
        }
    }

    async getUserDocuments(user: string): Promise<number[]> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const documentIds = await this.contract.getUserDocuments(user);
            return documentIds.map((id: any) => Number(id));
        } catch (error: any) {
            console.error('Error getting user documents:', error);
            return [];
        }
    }

    async getDocument(documentId: number): Promise<Document | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const doc = await this.contract.getDocument(documentId);
            return {
                id: Number(doc.id),
                title: doc.title,
                type: doc.type,
                purpose: doc.purpose,
                ipfsCid: doc.ipfsCid,
                generatedAt: Number(doc.generatedAt),
                validUntil: Number(doc.validUntil),
                incomeAmount: ethers.formatEther(doc.incomeAmount),
                currency: doc.currency,
                period: doc.period,
                networks: doc.networks,
                sourceIds: doc.sourceIds.map((id: any) => Number(id)),
                isVerified: doc.isVerified,
                owner: doc.owner,
                isExpired: doc.isExpired,
                verificationCount: Number(doc.verificationCount),
                verificationThreshold: Number(doc.verificationThreshold),
                transactionProofs: doc.transactionProofs
            };
        } catch (error: any) {
            console.error('Error getting document:', error);
            return null;
        }
    }

    async getUserEmployers(user: string): Promise<number[]> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const employerIds = await this.contract.getUserEmployers(user);
            return employerIds.map((id: any) => Number(id));
        } catch (error: any) {
            console.error('Error getting user employers:', error);
            return [];
        }
    }

    async getEmployer(employerId: number): Promise<Employer | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const employer = await this.contract.getEmployer(employerId);
            return {
                id: Number(employer.id),
                name: employer.name,
                type: employer.type,
                isVerified: employer.isVerified,
                contactPerson: employer.contactPerson,
                email: employer.email,
                phone: employer.phone,
                website: employer.website,
                ensDomain: employer.ensDomain,
                owner: employer.owner,
                createdAt: Number(employer.createdAt),
                isActive: employer.isActive,
                totalVerifiedIncome: ethers.formatEther(employer.totalVerifiedIncome),
                verifiedUsersCount: Number(employer.verifiedUsersCount),
                supportedNetworks: employer.supportedNetworks,
                supportedTokens: employer.supportedTokens,
                verificationCount: Number(employer.verificationCount),
                verificationThreshold: Number(employer.verificationThreshold)
            };
        } catch (error: any) {
            console.error('Error getting employer:', error);
            return null;
        }
    }

    // ============ STATISTICS FUNCTIONS ============

    async getContractStats(): Promise<ContractStats | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // For now, return default stats to avoid contract call issues
            // These can be updated when the contract is properly deployed and configured
            return {
                totalIncomeSources: 0,
                totalEmployers: 0,
                totalDocuments: 0,
                totalVerifiedIncomeSources: 0,
                totalVerifiedEmployers: 0,
                totalVerifiedDocuments: 0
            };

            // TODO: Uncomment this when contract is properly configured
            // const stats = await this.contract.getContractStats();
            // return {
            //     totalIncomeSources: Number(stats.totalIncomeSources),
            //     totalEmployers: Number(stats.totalEmployers),
            //     totalDocuments: Number(stats.totalDocuments),
            //     totalVerifiedIncomeSources: Number(stats.totalVerifiedIncomeSources),
            //     totalVerifiedEmployers: Number(stats.totalVerifiedEmployers),
            //     totalVerifiedDocuments: Number(stats.totalVerifiedDocuments)
            // };
        } catch (error: any) {
            console.error('Error getting contract stats:', error);
            // Return default stats as fallback
            return {
                totalIncomeSources: 0,
                totalEmployers: 0,
                totalDocuments: 0,
                totalVerifiedIncomeSources: 0,
                totalVerifiedEmployers: 0,
                totalVerifiedDocuments: 0
            };
        }
    }

    async getIncomeSourceStats(user: string): Promise<IncomeSourceStats | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // For now, return default stats to avoid contract call issues
            // These can be updated when the contract is properly deployed and configured
            return {
                totalSources: 0,
                verifiedSources: 0,
                totalMonthlyIncome: "0.0",
                totalTransactions: 0
            };

            // TODO: Uncomment this when contract is properly configured
            // const stats = await this.contract.getIncomeSourceStats(user);
            // return {
            //     totalSources: Number(stats.totalSources),
            //     verifiedSources: Number(stats.verifiedSources),
            //     totalMonthlyIncome: ethers.formatEther(stats.totalMonthlyIncome),
            //     totalTransactions: Number(stats.totalTransactions)
            // };
        } catch (error: any) {
            console.error('Error getting income source stats:', error);
            // Return default stats as fallback
            return {
                totalSources: 0,
                verifiedSources: 0,
                totalMonthlyIncome: "0.0",
                totalTransactions: 0
            };
        }
    }

    async getDocumentStats(user: string): Promise<DocumentStats | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // For now, return default stats to avoid contract call issues
            // These can be updated when the contract is properly deployed and configured
            return {
                totalDocuments: 0,
                verifiedDocuments: 0,
                expiredDocuments: 0,
                validDocuments: 0
            };

            // TODO: Uncomment this when contract is properly configured
            // const stats = await this.contract.getDocumentStats(user);
            // return {
            //     totalDocuments: Number(stats.totalDocuments),
            //     verifiedDocuments: Number(stats.verifiedDocuments),
            //     expiredDocuments: Number(stats.expiredDocuments),
            //     validDocuments: Number(stats.validDocuments)
            // };
        } catch (error: any) {
            console.error('Error getting document stats:', error);
            // Return default stats as fallback
            return {
                totalDocuments: 0,
                verifiedDocuments: 0,
                expiredDocuments: 0,
                validDocuments: 0
            };
        }
    }

    // ============ FEE FUNCTIONS ============

    async getFees(): Promise<{ incomeSourceFee: string; employerFee: string; documentFee: string } | null> {
        try {
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // For now, return default fees to avoid contract call issues
            // These can be updated when the contract is properly deployed and configured
            return {
                incomeSourceFee: "0.001",
                employerFee: "0.002", 
                documentFee: "0.0005"
            };

            // TODO: Uncomment this when contract is properly configured
            // const [incomeSourceFee, employerFee, documentFee] = await Promise.all([
            //     this.contract.incomeSourceFee(),
            //     this.contract.employerVerificationFee(),
            //     this.contract.documentGenerationFee()
            // ]);

            // return {
            //     incomeSourceFee: ethers.formatEther(incomeSourceFee),
            //     employerFee: ethers.formatEther(employerFee),
            //     documentFee: ethers.formatEther(documentFee)
            // };
        } catch (error: any) {
            console.error('Error getting fees:', error);
            // Return default fees as fallback
            return {
                incomeSourceFee: "0.001",
                employerFee: "0.002",
                documentFee: "0.0005"
            };
        }
    }
}

export const nosenService = new NosenService();
