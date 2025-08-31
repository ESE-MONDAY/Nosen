'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    User, 
    ArrowLeft, 
    CheckCircle, 
    Loader2, 
    AlertCircle, 
    Check, 
    Zap, 
    Coins,
    Globe,
    Building2,
    FileText,
    Star,
    Link
} from 'lucide-react';
import { ensService } from '../../services/ensService';
import { nosenService } from '../../services/nosenService';
import { useRouter } from 'next/navigation';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useTheme } from '../contexts/ThemeContext';

export default function CreateProfilePage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();
    const { theme } = useTheme();
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // ENS Profile Data
    const [ensProfile, setEnsProfile] = useState({
        subdomain: '',
        name: '',
        role: '',
        company: '',
        bio: '',
        avatar: '',
        social: {
            twitter: '',
            linkedin: '',
            github: '',
            website: ''
        }
    });
    
    // Nosen Platform Data
    const [nosenProfile, setNosenProfile] = useState({
        name: '',
        role: '',
        monthlyAmount: '',
        token: 'ETH',
        network: 'Lisk Sepolia',
        isRecurring: true,
        frequency: 'monthly',
        bio: '',
        skills: [] as string[],
        experience: '',
        education: '',
        certifications: [] as string[]
    });
    
    // State variables
    const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
    const [registrationFee, setRegistrationFee] = useState<string>('0');
    const [isL2Enabled, setIsL2Enabled] = useState(false);
    const [fees, setFees] = useState<{ incomeSourceFee: string; employerFee: string; documentFee: string } | null>(null);

    useEffect(() => {
        if (isConnected && address && publicClient && walletClient) {
            initializeData();
        }
    }, [isConnected, address, publicClient, walletClient]);

    const initializeData = async () => {
        try {
            // Initialize the Nosen service with RainbowKit providers
            nosenService.initializeContract(publicClient, walletClient);
            
            await Promise.all([
                checkL2Status(),
                loadFees()
            ]);
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    };

    const checkL2Status = async () => {
        try {
            const l2Enabled = await ensService.isL2Enabled();
            setIsL2Enabled(l2Enabled);
        } catch (error) {
            console.error('Error checking L2 status:', error);
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

    const checkSubdomainAvailability = async () => {
        if (!ensProfile.subdomain) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // For now, let's simulate availability check since ENS service might not be fully integrated
            // In a real implementation, this would call the ENS service
            console.log('Checking subdomain availability for:', ensProfile.subdomain);
            
            // Simulate availability check - you can replace this with actual ENS service call
            const isAvailable = ensProfile.subdomain.length >= 3 && !['admin', 'www', 'api', 'test'].includes(ensProfile.subdomain.toLowerCase());
            
            setSubdomainAvailable(isAvailable);
            
            if (isAvailable) {
                setRegistrationFee('0.001'); // Simulated fee
            }
        } catch (error: any) {
            console.error('Error checking subdomain:', error);
            setError('Failed to check subdomain availability. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateENSProfile = async () => {
        if (!ensProfile.subdomain || !ensProfile.name) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // For now, simulate ENS profile creation
            // In a real implementation, this would call the ENS service
            console.log('Creating ENS profile for:', ensProfile.subdomain);
            
            // Simulate success
            setSuccess(`ENS Profile created successfully! Subdomain: ${ensProfile.subdomain}.nosen.eth`);
            setStep(2);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNosenProfile = async () => {
        if (!nosenProfile.name || !nosenProfile.role || !nosenProfile.monthlyAmount || !walletClient) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            // Create income source on Nosen platform
            const result = await nosenService.addIncomeSource(
                nosenProfile.name,
                nosenProfile.role,
                nosenProfile.monthlyAmount,
                nosenProfile.token,
                nosenProfile.network,
                `${ensProfile.subdomain}.nosen.eth`, // Use ENS subdomain
                nosenProfile.isRecurring,
                nosenProfile.frequency,
                '', // IPFS CID for now
                walletClient
            );
            
            if (result.success) {
                setSuccess(`Nosen Profile created successfully! Income Source ID: ${result.sourceId}`);
                // Redirect to dashboard
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setError(result.error || 'Failed to create Nosen profile');
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && subdomainAvailable) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    if (!isConnected || !address) {
        return (
            <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Connect Your Wallet</h2>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Please connect your wallet to create your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="flex items-center mb-12">
                    <Button variant="ghost" onClick={() => router.back()} className="mr-6">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Create Your Professional Profile</h1>
                        <p className={`text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Set up your ENS identity and Nosen platform profile</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center space-x-8">
                        <div className={`flex items-center ${step >= 1 ? 'text-emerald-600' : theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-semibold ${step >= 1 ? 'border-emerald-600 bg-emerald-600 text-white' : theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                                {step > 1 ? <Check className="w-6 h-6" /> : '1'}
                            </div>
                            <span className="ml-3 text-lg font-medium">ENS Profile</span>
                        </div>
                        <div className={`w-24 h-1 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                        <div className={`flex items-center ${step >= 2 ? 'text-emerald-600' : theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-semibold ${step >= 2 ? 'border-emerald-600 bg-emerald-600 text-white' : theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                                {step > 2 ? <Check className="w-6 h-6" /> : '2'}
                            </div>
                            <span className="ml-3 text-lg font-medium">Nosen Platform</span>
                        </div>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="max-w-4xl mx-auto mb-8">
                        <Alert variant="destructive">
                            <AlertCircle className="h-5 w-5" />
                            <AlertDescription className="text-lg">{error}</AlertDescription>
                        </Alert>
                    </div>
                )}
                
                {success && (
                    <div className="max-w-4xl mx-auto mb-8">
                        <Alert variant="success">
                            <CheckCircle className="h-5 w-5" />
                            <AlertDescription className="text-lg">{success}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Step 1: ENS Profile */}
                {step === 1 && (
                    <div className="max-w-4xl mx-auto">
                        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <CardHeader className="text-center pb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-4">
                                    <Globe className="w-8 h-8 text-emerald-600" />
                                </div>
                                <CardTitle className="text-2xl">Step 1: Create Your ENS Identity</CardTitle>
                                <CardDescription className="text-lg">
                                    Set up your professional ENS subdomain and profile information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* L2 Status */}
                                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mr-4">
                                            <Zap className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>L2 ENS Integration</h4>
                                            <p className={`text-base ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                                                {isL2Enabled 
                                                    ? '✅ Using Lisk Sepolia L2 for cost-effective ENS management'
                                                    : '⏳ Switching to Lisk Sepolia L2 for better performance'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subdomain Input */}
                                <div className="space-y-4">
                                    <Label htmlFor="subdomain" className="text-lg font-semibold">Choose Your Subdomain *</Label>
                                    <div className="flex space-x-4">
                                        <Input
                                            id="subdomain"
                                            value={ensProfile.subdomain}
                                            onChange={(e) => setEnsProfile({...ensProfile, subdomain: e.target.value})}
                                            placeholder="yourname"
                                            className="flex-1 h-14 text-lg"
                                        />
                                        <Button 
                                            onClick={checkSubdomainAvailability}
                                            disabled={!ensProfile.subdomain || isLoading}
                                            variant="outline"
                                            size="lg"
                                            className="px-8"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                            Check
                                        </Button>
                                    </div>
                                    <div className={`text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Your full ENS name will be: <span className="font-mono text-emerald-600 font-semibold text-lg">{ensProfile.subdomain}.nosen.eth</span>
                                    </div>
                                </div>

                                {/* Availability Status */}
                                {subdomainAvailable !== null && (
                                    <div className={`p-6 rounded-2xl border-2 ${subdomainAvailable 
                                        ? theme === 'dark' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                                        : theme === 'dark' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'
                                    }`}>
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                                subdomainAvailable 
                                                    ? 'bg-green-600/20' 
                                                    : 'bg-red-600/20'
                                            }`}>
                                                {subdomainAvailable ? (
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`text-xl font-semibold mb-2 ${subdomainAvailable 
                                                    ? theme === 'dark' ? 'text-green-300' : 'text-green-900'
                                                    : theme === 'dark' ? 'text-red-300' : 'text-red-900'
                                                }`}>
                                                    {subdomainAvailable ? 'Subdomain Available!' : 'Subdomain Not Available'}
                                                </h4>
                                                <p className={`text-base ${subdomainAvailable 
                                                    ? theme === 'dark' ? 'text-green-300' : 'text-green-700'
                                                    : theme === 'dark' ? 'text-red-300' : 'text-red-700'
                                                }`}>
                                                    {subdomainAvailable 
                                                        ? `Registration fee: ${registrationFee} ETH`
                                                        : 'Please choose a different subdomain'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="text-lg font-semibold">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={ensProfile.name}
                                            onChange={(e) => setEnsProfile({...ensProfile, name: e.target.value})}
                                            placeholder="John Doe"
                                            className="h-14 text-lg mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role" className="text-lg font-semibold">Professional Role *</Label>
                                        <Input
                                            id="role"
                                            value={ensProfile.role}
                                            onChange={(e) => setEnsProfile({...ensProfile, role: e.target.value})}
                                            placeholder="Developer Relations"
                                            className="h-14 text-lg mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="company" className="text-lg font-semibold">Company/Organization</Label>
                                    <Input
                                        id="company"
                                        value={ensProfile.company}
                                        onChange={(e) => setEnsProfile({...ensProfile, company: e.target.value})}
                                        placeholder="Phala Network"
                                        className="h-14 text-lg mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bio" className="text-lg font-semibold">Professional Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={ensProfile.bio}
                                        onChange={(e) => setEnsProfile({...ensProfile, bio: e.target.value})}
                                        placeholder="Tell us about your professional background, skills, and experience..."
                                        rows={5}
                                        className="text-lg mt-2"
                                    />
                                </div>

                                {/* Social Links */}
                                <div className="space-y-6">
                                    <Label className="text-lg font-semibold">Social Links</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="twitter" className="text-base">Twitter</Label>
                                            <Input
                                                id="twitter"
                                                value={ensProfile.social.twitter}
                                                onChange={(e) => setEnsProfile({
                                                    ...ensProfile, 
                                                    social: {...ensProfile.social, twitter: e.target.value}
                                                })}
                                                placeholder="@username"
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="linkedin" className="text-base">LinkedIn</Label>
                                            <Input
                                                id="linkedin"
                                                value={ensProfile.social.linkedin}
                                                onChange={(e) => setEnsProfile({
                                                    ...ensProfile, 
                                                    social: {...ensProfile.social, linkedin: e.target.value}
                                                })}
                                                placeholder="linkedin.com/in/username"
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="github" className="text-base">GitHub</Label>
                                            <Input
                                                id="github"
                                                value={ensProfile.social.github}
                                                onChange={(e) => setEnsProfile({
                                                    ...ensProfile, 
                                                    social: {...ensProfile.social, github: e.target.value}
                                                })}
                                                placeholder="github.com/username"
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="website" className="text-base">Website</Label>
                                            <Input
                                                id="website"
                                                value={ensProfile.social.website}
                                                onChange={(e) => setEnsProfile({
                                                    ...ensProfile, 
                                                    social: {...ensProfile.social, website: e.target.value}
                                                })}
                                                placeholder="yourwebsite.com"
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center pt-8">
                                    <Button 
                                        onClick={handleCreateENSProfile}
                                        disabled={!subdomainAvailable || !ensProfile.name || !ensProfile.role || isLoading}
                                        size="lg"
                                        className="min-w-[200px] h-14 text-lg font-semibold"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                        Create ENS Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Nosen Platform */}
                {step === 2 && (
                    <div className="max-w-4xl mx-auto">
                        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <CardHeader className="text-center pb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-4">
                                    <Building2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <CardTitle className="text-2xl">Step 2: Complete Your Nosen Profile</CardTitle>
                                <CardDescription className="text-lg">
                                    Add your professional details and income information to the Nosen platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* Platform Info */}
                                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'}`}>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center mr-4">
                                            <Star className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-900'}`}>Nosen Platform Integration</h4>
                                            <p className={`text-base ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                                Your ENS profile will be automatically linked to your Nosen platform identity
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="nosen-name" className="text-lg font-semibold">Full Name *</Label>
                                        <Input
                                            id="nosen-name"
                                            value={nosenProfile.name}
                                            onChange={(e) => setNosenProfile({...nosenProfile, name: e.target.value})}
                                            placeholder="John Doe"
                                            className="h-14 text-lg mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nosen-role" className="text-lg font-semibold">Professional Role *</Label>
                                        <Input
                                            id="nosen-role"
                                            value={nosenProfile.role}
                                            onChange={(e) => setNosenProfile({...nosenProfile, role: e.target.value})}
                                            placeholder="Developer Relations"
                                            className="h-14 text-lg mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Income Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="monthly-amount" className="text-lg font-semibold">Monthly Amount *</Label>
                                        <Input
                                            id="monthly-amount"
                                            type="number"
                                            value={nosenProfile.monthlyAmount}
                                            onChange={(e) => setNosenProfile({...nosenProfile, monthlyAmount: e.target.value})}
                                            placeholder="0.5"
                                            className="h-14 text-lg mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="token" className="text-lg font-semibold">Token</Label>
                                        <select
                                            id="token"
                                            value={nosenProfile.token}
                                            onChange={(e) => setNosenProfile({...nosenProfile, token: e.target.value})}
                                            className={`flex h-14 w-full rounded-xl border-2 px-4 py-3 text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                theme === 'dark'
                                                    ? "bg-slate-800 border-slate-600 text-white focus:border-emerald-500"
                                                    : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500"
                                            }`}
                                        >
                                            <option value="ETH">ETH</option>
                                            <option value="USDC">USDC</option>
                                            <option value="USDT">USDT</option>
                                            <option value="DAI">DAI</option>
                                            <option value="MATIC">MATIC</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="network" className="text-lg font-semibold">Network</Label>
                                        <select
                                            id="network"
                                            value={nosenProfile.network}
                                            onChange={(e) => setNosenProfile({...nosenProfile, network: e.target.value})}
                                            className={`flex h-14 w-full rounded-xl border-2 px-4 py-3 text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                theme === 'dark'
                                                    ? "bg-slate-800 border-slate-600 text-white focus:border-emerald-700"
                                                    : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500"
                                            }`}
                                        >
                                            <option value="Lisk Sepolia">Lisk Sepolia</option>
                                            <option value="Ethereum">Ethereum</option>
                                            <option value="Polygon">Polygon</option>
                                            <option value="Arbitrum">Arbitrum</option>
                                            <option value="Optimism">Optimism</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Recurring Income */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="is-recurring"
                                            checked={nosenProfile.isRecurring}
                                            onChange={(e) => setNosenProfile({...nosenProfile, isRecurring: e.target.checked})}
                                            className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <Label htmlFor="is-recurring" className="text-lg font-semibold">This is recurring income</Label>
                                    </div>
                                    
                                    {nosenProfile.isRecurring && (
                                        <div>
                                            <Label htmlFor="frequency" className="text-lg font-semibold">Frequency</Label>
                                            <select
                                                id="frequency"
                                                value={nosenProfile.frequency}
                                                onChange={(e) => setNosenProfile({...nosenProfile, frequency: e.target.value})}
                                                className={`flex h-14 w-full rounded-xl border-2 px-4 py-3 text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    theme === 'dark'
                                                        ? "bg-slate-800 border-slate-600 text-white focus:border-emerald-500"
                                                        : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500"
                                                }`}
                                            >
                                                <option value="weekly">Weekly</option>
                                                <option value="bi-weekly">Bi-weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Professional Bio */}
                                <div>
                                    <Label htmlFor="nosen-bio" className="text-lg font-semibold">Professional Bio</Label>
                                    <Textarea
                                        id="nosen-bio"
                                        value={nosenProfile.bio}
                                        onChange={(e) => setNosenProfile({...nosenProfile, bio: e.target.value})}
                                        placeholder="Tell us about your professional background, skills, and experience..."
                                        rows={5}
                                        className="text-lg mt-2"
                                    />
                                </div>

                                {/* Fees Information */}
                                {fees && (
                                    <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                        <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Platform Fees</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
                                            <div className="text-center">
                                                <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 ${theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                                                    <Coins className="w-8 h-8 text-emerald-600" />
                                                </div>
                                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Income Source:</span>
                                                <div className="font-semibold text-emerald-600 text-lg">{fees.incomeSourceFee} ETH</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                                    <Building2 className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Employer:</span>
                                                <div className="font-semibold text-blue-600 text-lg">{fees.employerFee} ETH</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                                    <FileText className="w-8 h-8 text-purple-600" />
                                                </div>
                                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Document:</span>
                                                <div className="font-semibold text-purple-600 text-lg">{fees.documentFee} ETH</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-between space-x-6 pt-8">
                                    <Button 
                                        variant="outline"
                                        onClick={handleBack}
                                        size="lg"
                                        className="min-w-[160px] h-14 text-lg font-semibold"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={handleCreateNosenProfile}
                                        disabled={!nosenProfile.name || !nosenProfile.role || !nosenProfile.monthlyAmount || isLoading}
                                        size="lg"
                                        className="min-w-[200px] h-14 text-lg font-semibold"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                        Create Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
