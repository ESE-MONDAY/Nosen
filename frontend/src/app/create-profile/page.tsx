'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
    ArrowLeft, 
    Loader2, 
    Globe,
    PartyPopper,
    ExternalLink
} from 'lucide-react';
import { ensService } from '../../services/ensService';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useTheme } from '../contexts/ThemeContext';
import { ethers } from 'ethers';

export default function CreateProfilePage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { theme } = useTheme();
    
    // Simple state management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [userHasSubdomain, setUserHasSubdomain] = useState<boolean | null>(null);
    
    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registeredSubdomain, setRegisteredSubdomain] = useState<string>('');
    const [transactionHash, setTransactionHash] = useState<string>('');
    
    // Form data - simplified to only what the smart contract needs
    const [formData, setFormData] = useState({
        subdomain: '',
        duration: 365 * 24 * 60 * 60 // 1 year in seconds (default)
    });
    
    // ENS state
    const [ensState, setEnsState] = useState({
        isL2Connected: true, // User is already on Lisk Sepolia
        contractAccessible: true, // Assume accessible since on correct network
        subdomainAvailable: null as boolean | null,
        registrationFee: '0',
        checking: false
    });

    // Check if user already has a subdomain
    useEffect(() => {
        const checkUserSubdomain = async () => {
            if (address && isConnected) {
                try {
                    const existingSubdomain = await ensService.getUserSubdomain(address);
                    setUserHasSubdomain(!!existingSubdomain);
                } catch (error) {
                    console.error('Error checking user subdomain:', error);
                    setUserHasSubdomain(false);
                }
            }
        };

        checkUserSubdomain();
    }, [address, isConnected]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Reset availability when subdomain changes
        if (field === 'subdomain') {
            setEnsState(prev => ({ ...prev, subdomainAvailable: null }));
        }
    };

    const checkSubdomainAvailability = async () => {
        if (!formData.subdomain || formData.subdomain.length < 3) {
            setError('Subdomain must be at least 3 characters long');
            return;
        }

        setEnsState(prev => ({ ...prev, checking: true }));
        setError('');

        try {
            const result = await ensService.checkSubdomainAvailability(formData.subdomain);
            
            if (result.error) {
                setError(result.error);
                setEnsState(prev => ({ ...prev, subdomainAvailable: false }));
            } else {
                setEnsState(prev => ({ 
                    ...prev, 
                    subdomainAvailable: result.available,
                    registrationFee: result.price || '0.001'
                }));
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to check subdomain availability';
            setError(errorMessage);
            setEnsState(prev => ({ ...prev, subdomainAvailable: false }));
        } finally {
            setEnsState(prev => ({ ...prev, checking: false }));
        }
    };

    const handleCreateENSProfile = useCallback(async () => {
        if (!formData.subdomain) {
            setError('Subdomain is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check if user already has a registered subdomain
            if (!address) {
                throw new Error('Wallet address not available');
            }
            
            const existingSubdomain = await ensService.getUserSubdomain(address);
            if (existingSubdomain) {
                throw new Error(`You already have a registered subdomain: ${existingSubdomain}.nosen.eth`);
            }

            // Get registration fee and duration
            const duration = formData.duration;
            const fee = await ensService.getSubdomainRegistrationFee(formData.subdomain, duration);
            
            // Convert fee to wei
            const feeInWei = ethers.parseEther(fee);
            
            // Register the subdomain on the smart contract
            const result = await ensService.registerL2Subdomain(
                formData.subdomain,
                duration,
                feeInWei
            );
            
            if (result.success) {
                setRegisteredSubdomain(formData.subdomain);
                setTransactionHash(result.txHash || '');
                setShowSuccessModal(true);
            } else {
                throw new Error(result.error || 'Failed to register subdomain');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create ENS profile';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [formData.subdomain, formData.duration, address]);

    // Loading state
    if (!isConnected || !address) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Connect Your Wallet
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        Please connect your wallet to create your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Register ENS Subdomain
                            </h1>
                            <p className={`text-lg mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                Get your own .nosen.eth subdomain on Lisk Sepolia L2
                            </p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center">
                            <div className="flex items-center text-emerald-600">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 font-semibold border-emerald-600 bg-emerald-600 text-white">
                                    1
                                </div>
                                <span className="ml-2 font-medium">Register ENS Subdomain</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {error && (
                        <Alert className="border-red-200 bg-red-50 text-red-800">
                            <div className="flex items-center">
                                <div className="w-4 h-4 text-red-600 mr-2">⚠️</div>
                                <AlertDescription>{error}</AlertDescription>
                            </div>
                        </Alert>
                    )}

                    {/* Step 1: ENS Profile */}
                    {/* currentStep === 1 && ( */}
                        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <CardHeader className="text-center pb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-4">
                                    <Globe className="w-8 h-8 text-emerald-600" />
                                </div>
                                <CardTitle className="text-2xl">Register Your ENS Subdomain</CardTitle>
                                <CardDescription className="text-lg">
                                    Choose your subdomain and registration duration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* User Subdomain Status */}
                                {userHasSubdomain && (
                                    <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mr-4">
                                                <span className="text-2xl">✅</span>
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>You Already Have a Subdomain!</h4>
                                                <p className={`text-base ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                                                    You have already registered a subdomain. You can only have one active subdomain per address.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subdomain Input */}
                                <div className="space-y-3">
                                    <Label htmlFor="subdomain" className="text-base font-semibold">
                                        Choose Your Subdomain *
                                    </Label>
                                    <div className="flex space-x-3">
                                        <Input
                                            id="subdomain"
                                            value={formData.subdomain}
                                            onChange={(e) => handleInputChange('subdomain', e.target.value)}
                                            placeholder="yourname"
                                            className="flex-1"
                                            disabled={userHasSubdomain === true}
                                        />
                                        <Button 
                                            onClick={checkSubdomainAvailability}
                                            disabled={!formData.subdomain || loading || userHasSubdomain === true}
                                            variant="outline"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : null}
                                            {userHasSubdomain ? 'Already Registered' : 'Check'}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Your ENS name will be: <span className="font-mono text-emerald-600">
                                            {formData.subdomain || 'yourname'}.nosen.eth
                                        </span>
                                    </p>
                                    {userHasSubdomain && (
                                        <p className="text-sm text-blue-600">
                                            ⚠️ You already have a registered subdomain. You cannot create another one.
                                        </p>
                                    )}
                                </div>

                                {/* Duration Selection */}
                                <div className="space-y-3">
                                    <Label htmlFor="duration" className="text-base font-semibold">
                                        Registration Duration
                                    </Label>
                                    <select
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                            theme === 'dark' 
                                                ? 'bg-slate-800 border-slate-600 text-white' 
                                                : 'bg-white border-slate-300'
                                        }`}
                                        disabled={userHasSubdomain === true}
                                    >
                                        <option value={30 * 24 * 60 * 60}>30 days</option>
                                        <option value={90 * 24 * 60 * 60}>90 days</option>
                                        <option value={180 * 24 * 60 * 60}>6 months</option>
                                        <option value={365 * 24 * 60 * 60}>1 year</option>
                                        <option value={2 * 365 * 24 * 60 * 60}>2 years</option>
                                    </select>
                                    <p className="text-sm text-slate-600">
                                        Choose how long you want to register your subdomain for
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center pt-6">
                                    <Button 
                                        onClick={handleCreateENSProfile}
                                        disabled={!formData.subdomain || loading || userHasSubdomain === true}
                                        size="lg"
                                        className="min-w-[200px]"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : null}
                                        {userHasSubdomain ? 'Already Registered' : 'Register Subdomain'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    {/* ) */}
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-[500px] text-center">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <PartyPopper className="w-8 h-8 text-emerald-600" />
                        </div>
                        <DialogTitle className="text-2xl text-emerald-600">
                            🎉 Congratulations!
                        </DialogTitle>
                        <DialogDescription className="text-lg mt-2">
                            Your ENS subdomain has been successfully registered!
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* ENS Name Display */}
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                            <div className="text-sm text-emerald-700 mb-1">Your New ENS Name:</div>
                            <div className="text-2xl font-mono font-bold text-emerald-800">
                                {registeredSubdomain}.nosen.eth
                            </div>
                        </div>
                        
                        {/* Transaction Details */}
                        {transactionHash && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-sm text-slate-700 mb-2">Transaction Hash:</div>
                                <div className="font-mono text-sm text-slate-800 break-all">
                                    {transactionHash}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => {
                                        const explorerUrl = `https://sepolia.lisk.com/tx/${transactionHash}`;
                                        window.open(explorerUrl, '_blank');
                                    }}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View on Explorer
                                </Button>
                            </div>
                        )}
                        
                        {/* Next Steps */}
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="text-sm font-semibold text-blue-800 mb-2">What&apos;s Next?</div>
                            <div className="text-sm text-blue-700 space-y-1">
                                <div>• Your subdomain is now active on Lisk Sepolia L2</div>
                                <div>• You can use it for your Web3 identity</div>
                                <div>• Manage it from your dashboard</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                        <Button 
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/dashboard');
                            }}
                            className="px-8"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}