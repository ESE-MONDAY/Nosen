'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Plus, 
    Edit, 
    Trash2, 
    CheckCircle, 
    XCircle, 
    Eye, 
    Star,
    TrendingUp,
    Building2,
    FileText,
    Users,
    Award,
    DollarSign,
    Calendar,
    Globe,
    Link
} from 'lucide-react';
import { nosenService, IncomeSource, Employer, UserReputation } from '../../../services/nosenService';
import { ensService } from '../../../services/ensService';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

export default function IncomeStreamsPage() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();
    
    const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
    const [employers, setEmployers] = useState<Employer[]>([]);
    const [userReputation, setUserReputation] = useState<UserReputation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fees, setFees] = useState<{ incomeSourceFee: string; employerFee: string; documentFee: string } | null>(null);
    
    // Form states
    const [showAddIncomeSource, setShowAddIncomeSource] = useState(false);
    const [showAddEmployer, setShowAddEmployer] = useState(false);
    const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);
    const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
    
    // Income Source form
    const [incomeSourceForm, setIncomeSourceForm] = useState({
        name: '',
        role: '',
        monthlyAmount: '',
        token: 'ETH',
        network: 'Lisk Sepolia',
        ensDomain: '',
        isRecurring: true,
        frequency: 'monthly',
        ipfsCid: ''
    });
    
    // Employer form
    const [employerForm, setEmployerForm] = useState({
        name: '',
        type: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        ensDomain: '',
        ipfsCid: '',
        supportedNetworks: ['Lisk Sepolia'],
        supportedTokens: ['ETH']
    });

    useEffect(() => {
        if (isConnected && address && publicClient && walletClient) {
            initializeData();
        }
    }, [isConnected, address, publicClient, walletClient]);

    const initializeData = async () => {
        setIsLoading(true);
        try {
            // Initialize the Nosen service with RainbowKit providers
            nosenService.initializeContract(publicClient, walletClient);
            
            await Promise.all([
                loadIncomeSources(address!),
                loadEmployers(address!),
                loadUserReputation(address!),
                loadFees()
            ]);
        } catch (error) {
            console.error('Error initializing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadIncomeSources = async (user: string) => {
        try {
            const sourceIds = await nosenService.getUserIncomeSources(user);
            const sources = await Promise.all(
                sourceIds.map(id => nosenService.getIncomeSource(id))
            );
            setIncomeSources(sources.filter(Boolean) as IncomeSource[]);
        } catch (error) {
            console.error('Error loading income sources:', error);
        }
    };

    const loadEmployers = async (user: string) => {
        try {
            const employerIds = await nosenService.getUserEmployers(user);
            const employerList = await Promise.all(
                employerIds.map(id => nosenService.getEmployer(id))
            );
            setEmployers(employerList.filter(Boolean) as Employer[]);
        } catch (error) {
            console.error('Error loading employers:', error);
        }
    };

    const loadUserReputation = async (user: string) => {
        try {
            const reputation = await nosenService.getUserReputation(user);
            setUserReputation(reputation);
        } catch (error) {
            console.error('Error loading user reputation:', error);
        }
    };

    const loadFees = async () => {
        try {
            const feeData = await nosenService.getFees();
            setFees(feeData);
        } catch (error) {
            console.error('Error loading fees:', error);
        }
    };

        const handleAddIncomeSource = async () => {
        if (!address || !walletClient) return;
        
        setIsLoading(true);
        try {
            const result = await nosenService.addIncomeSource(
                incomeSourceForm.name,
                incomeSourceForm.role,
                incomeSourceForm.monthlyAmount,
                incomeSourceForm.token,
                incomeSourceForm.network,
                incomeSourceForm.ensDomain,
                incomeSourceForm.isRecurring,
                incomeSourceForm.frequency,
                incomeSourceForm.ipfsCid,
                walletClient
            );
            
            if (result.success) {
                setShowAddIncomeSource(false);
                resetIncomeSourceForm();
                await loadIncomeSources(address);
                // Show success message
            } else {
                // Show error message
                console.error('Failed to add income source:', result.error);
            }
        } catch (error) {
            console.error('Error adding income source:', error);
        } finally {
            setIsLoading(false);
        }
    };

        const handleAddEmployer = async () => {
        if (!address || !walletClient) return;
        
        setIsLoading(true);
        try {
            const result = await nosenService.addEmployer(
                employerForm.name,
                employerForm.type,
                employerForm.contactPerson,
                employerForm.email,
                employerForm.phone,
                employerForm.website,
                employerForm.ensDomain,
                employerForm.ipfsCid,
                employerForm.supportedNetworks,
                employerForm.supportedTokens,
                walletClient
            );
            
            if (result.success) {
                setShowAddEmployer(false);
                resetEmployerForm();
                await loadEmployers(address);
                // Show success message
            } else {
                // Show error message
                console.error('Failed to add employer:', result.error);
            }
        } catch (error) {
            console.error('Error adding employer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyIncomeSource = async (sourceId: number) => {
        if (!address || !walletClient) return;
        
        try {
            const result = await nosenService.verifyIncomeSource(sourceId, walletClient);
            if (result.success) {
                await Promise.all([
                    loadIncomeSources(address),
                    loadUserReputation(address)
                ]);
                // Show success message
            } else {
                // Show error message
                console.error('Failed to verify income source:', result.error);
            }
        } catch (error) {
            console.error('Error verifying income source:', error);
        }
    };

    const handleVerifyEmployer = async (employerId: number) => {
        if (!address || !walletClient) return;
        
        try {
            const result = await nosenService.verifyEmployer(employerId, walletClient);
            if (result.success) {
                await Promise.all([
                    loadEmployers(address),
                    loadUserReputation(address)
                ]);
                // Show success message
            } else {
                // Show error message
                console.error('Failed to verify employer:', result.error);
            }
        } catch (error) {
            console.error('Error verifying employer:', error);
        }
    };

    const resetIncomeSourceForm = () => {
        setIncomeSourceForm({
            name: '',
            role: '',
            monthlyAmount: '',
            token: 'ETH',
            network: 'Lisk Sepolia',
            ensDomain: '',
            isRecurring: true,
            frequency: 'monthly',
            ipfsCid: ''
        });
    };

    const resetEmployerForm = () => {
        setEmployerForm({
            name: '',
            type: '',
            contactPerson: '',
            email: '',
            phone: '',
            website: '',
            ensDomain: '',
            ipfsCid: '',
            supportedNetworks: ['Lisk Sepolia'],
            supportedTokens: ['ETH']
        });
    };

    const getVerificationColor = (verificationCount: number, threshold: number) => {
        const percentage = (verificationCount / threshold) * 100;
        if (percentage >= 100) return 'bg-green-100 text-green-800';
        if (percentage >= 66) return 'bg-yellow-100 text-yellow-800';
        if (percentage >= 33) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600">Please connect your wallet to view your income streams.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Income Streams</h1>
                    <p className="text-gray-600">Manage your professional income sources and employers</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button onClick={() => setShowAddIncomeSource(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Income Source
                    </Button>
                    <Button onClick={() => setShowAddEmployer(true)} variant="outline">
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Employer
                    </Button>
                </div>
            </div>

            {/* Reputation Card */}
            {userReputation && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Your Reputation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{userReputation.reputationScore}</div>
                                <div className="text-sm text-gray-600">Reputation Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{userReputation.verificationsGiven}</div>
                                <div className="text-sm text-gray-600">Verifications Given</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{userReputation.verificationsReceived}</div>
                                <div className="text-sm text-gray-600">Verifications Received</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Fees Information */}
            {fees && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="w-5 h-5 mr-2" />
                            Platform Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-lg font-semibold text-blue-600">{fees.incomeSourceFee} ETH</div>
                                <div className="text-sm text-gray-600">Income Source Registration</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-lg font-semibold text-green-600">{fees.employerFee} ETH</div>
                                <div className="text-sm text-gray-600">Employer Verification</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-lg font-semibold text-purple-600">{fees.documentFee} ETH</div>
                                <div className="text-sm text-gray-600">Document Generation</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="income-sources" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income-sources">Income Sources ({incomeSources.length})</TabsTrigger>
                    <TabsTrigger value="employers">Employers ({employers.length})</TabsTrigger>
                </TabsList>

                {/* Income Sources Tab */}
                <TabsContent value="income-sources" className="space-y-6">
                    {incomeSources.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Income Sources Yet</h3>
                                <p className="text-gray-600 mb-4">Start by adding your first income source to track your earnings.</p>
                                <Button onClick={() => setShowAddIncomeSource(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Income Source
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {incomeSources.map((source) => (
                                <Card key={source.id} className="relative">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{source.name}</CardTitle>
                                                <CardDescription>{source.role}</CardDescription>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {source.isVerified ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {source.isActive ? (
                                                    <Badge variant="outline" className="text-green-600">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-red-600">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Amount:</span>
                                                <div className="text-lg font-bold text-green-600">
                                                    {source.monthlyAmount} {source.token}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Network:</span>
                                                <div className="flex items-center">
                                                    <Globe className="w-4 h-4 mr-1" />
                                                    {source.network}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {source.ensDomain && (
                                            <div className="flex items-center text-sm">
                                                <Link className="w-4 h-4 mr-2" />
                                                <span className="font-medium">ENS:</span>
                                                <span className="ml-2 text-blue-600">{source.ensDomain}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Verification Progress:</span>
                                            <Badge className={getVerificationColor(source.verificationCount, source.verificationThreshold)}>
                                                {source.verificationCount}/{source.verificationThreshold}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Transactions:</span>
                                            <span>{source.transactionCount}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Created:</span>
                                            <span>{new Date(source.createdAt * 1000).toLocaleDateString()}</span>
                                        </div>
                                        
                                        <div className="flex space-x-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            {!source.isVerified && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="flex-1"
                                                    onClick={() => handleVerifyIncomeSource(source.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Verify
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Employers Tab */}
                <TabsContent value="employers" className="space-y-6">
                    {employers.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Employers Yet</h3>
                                <p className="text-gray-600 mb-4">Add your employers to build your professional network.</p>
                                <Button onClick={() => setShowAddEmployer(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Employer
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {employers.map((employer) => (
                                <Card key={employer.id} className="relative">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{employer.name}</CardTitle>
                                                <CardDescription>{employer.type}</CardDescription>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {employer.isVerified ? (
                                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {employer.isActive ? (
                                                    <Badge variant="outline" className="text-green-600">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-red-600">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Contact:</span>
                                                <span className="ml-2">{employer.contactPerson}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Globe className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Website:</span>
                                                <span className="ml-2 text-blue-600">{employer.website}</span>
                                            </div>
                                            {employer.ensDomain && (
                                                <div className="flex items-center">
                                                    <Link className="w-4 h-4 mr-2" />
                                                    <span className="font-medium">ENS:</span>
                                                    <span className="ml-2 text-blue-600">{employer.ensDomain}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Verified Users:</span>
                                                <div className="font-semibold">{employer.verifiedUsersCount}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Total Income:</span>
                                                <div className="font-semibold text-green-600">{employer.totalVerifiedIncome} ETH</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Verification Progress:</span>
                                            <Badge className={getVerificationColor(employer.verificationCount, employer.verificationThreshold)}>
                                                {employer.verificationCount}/{employer.verificationThreshold}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex space-x-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            {!employer.isVerified && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="flex-1"
                                                    onClick={() => handleVerifyEmployer(employer.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Verify
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Add Income Source Dialog */}
            <Dialog open={showAddIncomeSource} onOpenChange={setShowAddIncomeSource}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Income Source</DialogTitle>
                        <DialogDescription>
                            Add a new income source to track your professional earnings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Source Name *</Label>
                                <Input
                                    id="name"
                                    value={incomeSourceForm.name}
                                    onChange={(e) => setIncomeSourceForm({...incomeSourceForm, name: e.target.value})}
                                    placeholder="e.g., Phala Network"
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Your Role *</Label>
                                <Input
                                    id="role"
                                    value={incomeSourceForm.role}
                                    onChange={(e) => setIncomeSourceForm({...incomeSourceForm, role: e.target.value})}
                                    placeholder="e.g., Developer Relations"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="monthlyAmount">Monthly Amount *</Label>
                                <Input
                                    id="monthlyAmount"
                                    type="number"
                                    value={incomeSourceForm.monthlyAmount}
                                    onChange={(e) => setIncomeSourceForm({...incomeSourceForm, monthlyAmount: e.target.value})}
                                    placeholder="0.0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="token">Token</Label>
                                <Select value={incomeSourceForm.token} onValueChange={(value) => setIncomeSourceForm({...incomeSourceForm, token: value})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ETH">ETH</SelectItem>
                                        <SelectItem value="USDC">USDC</SelectItem>
                                        <SelectItem value="USDT">USDT</SelectItem>
                                        <SelectItem value="DAI">DAI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="network">Network</Label>
                                <Select value={incomeSourceForm.network} onValueChange={(value) => setIncomeSourceForm({...incomeSourceForm, network: value})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lisk Sepolia">Lisk Sepolia</SelectItem>
                                        <SelectItem value="Ethereum">Ethereum</SelectItem>
                                        <SelectItem value="Polygon">Polygon</SelectItem>
                                        <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="ensDomain">ENS Domain</Label>
                                <Input
                                    id="ensDomain"
                                    value={incomeSourceForm.ensDomain}
                                    onChange={(e) => setIncomeSourceForm({...incomeSourceForm, ensDomain: e.target.value})}
                                    placeholder="e.g., phala.eth"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="frequency">Frequency</Label>
                                <Select value={incomeSourceForm.frequency} onValueChange={(value) => setIncomeSourceForm({...incomeSourceForm, frequency: value})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="ipfsCid">IPFS CID</Label>
                                <Input
                                    id="ipfsCid"
                                    value={incomeSourceForm.ipfsCid}
                                    onChange={(e) => setIncomeSourceForm({...incomeSourceForm, ipfsCid: e.target.value})}
                                    placeholder="Qm... (optional)"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isRecurring"
                                checked={incomeSourceForm.isRecurring}
                                onChange={(e) => setIncomeSourceForm({...incomeSourceForm, isRecurring: e.target.checked})}
                            />
                            <Label htmlFor="isRecurring">This is a recurring income source</Label>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setShowAddIncomeSource(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddIncomeSource} disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add Income Source'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Employer Dialog */}
            <Dialog open={showAddEmployer} onOpenChange={setShowAddEmployer}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Employer</DialogTitle>
                        <DialogDescription>
                            Add a new employer to your professional network.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="employerName">Company Name *</Label>
                                <Input
                                    id="employerName"
                                    value={employerForm.name}
                                    onChange={(e) => setEmployerForm({...employerForm, name: e.target.value})}
                                    placeholder="e.g., Phala Network"
                                />
                            </div>
                            <div>
                                <Label htmlFor="employerType">Company Type *</Label>
                                <Select value={employerForm.type} onValueChange={(value) => setEmployerForm({...employerForm, type: value})}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="startup">Startup</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                        <SelectItem value="dao">DAO</SelectItem>
                                        <SelectItem value="consulting">Consulting</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="contactPerson">Contact Person</Label>
                                <Input
                                    id="contactPerson"
                                    value={employerForm.contactPerson}
                                    onChange={(e) => setEmployerForm({...employerForm, contactPerson: e.target.value})}
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={employerForm.email}
                                    onChange={(e) => setEmployerForm({...employerForm, email: e.target.value})}
                                    placeholder="contact@company.com"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={employerForm.phone}
                                    onChange={(e) => setEmployerForm({...employerForm, phone: e.target.value})}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={employerForm.website}
                                    onChange={(e) => setEmployerForm({...employerForm, website: e.target.value})}
                                    placeholder="https://company.com"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="employerEnsDomain">ENS Domain</Label>
                            <Input
                                id="employerEnsDomain"
                                value={employerForm.ensDomain}
                                onChange={(e) => setEmployerForm({...employerForm, ensDomain: e.target.value})}
                                placeholder="e.g., phala.eth"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="employerIpfsCid">IPFS CID</Label>
                            <Input
                                id="employerIpfsCid"
                                value={employerForm.ipfsCid}
                                onChange={(e) => setEmployerForm({...employerForm, ipfsCid: e.target.value})}
                                placeholder="Qm... (optional)"
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setShowAddEmployer(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddEmployer} disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add Employer'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
