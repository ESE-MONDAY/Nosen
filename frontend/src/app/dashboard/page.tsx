'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    TrendingUp, 
    Building2, 
    FileText,  
    Star, 
    Globe, 
    CheckCircle, 
    Clock,
    DollarSign,
    Award,
    Zap,
    Shield,
    Link
} from 'lucide-react';
import { nosenService, ContractStats, IncomeSourceStats, DocumentStats } from '../../services/nosenService';
import { ensService } from '../../services/ensService';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useTheme } from '../contexts/ThemeContext';
import NextLink from 'next/link';

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();
    const { theme } = useTheme();
    
    const [contractStats, setContractStats] = useState<ContractStats | null>(null);
    const [userStats, setUserStats] = useState<{
        incomeSources: IncomeSourceStats | null;
        documents: DocumentStats | null;
        reputation: { reputationScore: number; verificationsGiven: number; verificationsReceived: number } | null;
    }>({
        incomeSources: null,
        documents: null,
        reputation: null
    });
    const [isL2Enabled, setIsL2Enabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isConnected && address && publicClient && walletClient) {
            initializeDashboard();
        }
    }, [isConnected, address, publicClient, walletClient]);

    const initializeDashboard = async () => {
        try {
            // Initialize the Nosen service with RainbowKit providers
            nosenService.initializeContract(publicClient, walletClient);
            
            await Promise.all([
                loadContractStats(),
                loadUserStats(address!),
                checkL2Status()
            ]);
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadContractStats = async () => {
        try {
            const stats = await nosenService.getContractStats();
            setContractStats(stats);
        } catch (error) {
            console.error('Error loading contract stats:', error);
        }
    };

    const loadUserStats = async (user: string) => {
        try {
            const [incomeSources, documents, reputation] = await Promise.all([
                nosenService.getIncomeSourceStats(user),
                nosenService.getDocumentStats(user),
                nosenService.getUserReputation(user)
            ]);

            setUserStats({
                incomeSources,
                documents,
                reputation
            });
        } catch (error) {
            console.error('Error loading user stats:', error);
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

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isConnected || !address) {
        return (
            <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Connect Your Wallet</h2>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Please connect your wallet to view your dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`container mx-auto p-6 space-y-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Welcome to Nosen</h1>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Your decentralized professional verification platform</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={isL2Enabled ? "success" : "secondary"} className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        {isL2Enabled ? 'L2 Active' : 'L2 Inactive'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </Badge>
                </div>
            </div>

            {/* Platform Overview */}
            <Card className={`${theme === 'dark' ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600' : 'bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200'}`}>
                <CardHeader>
                    <CardTitle className="flex items-center text-emerald-600">
                        <Shield className="w-6 h-6 mr-2" />
                        Platform Overview
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}>
                        Decentralized professional verification powered by blockchain and community consensus
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                {contractStats?.totalIncomeSources || 0}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>Total Income Sources</div>
                            <div className="text-xs text-emerald-600 mt-1">
                                {contractStats?.totalVerifiedIncomeSources || 0} Verified
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {contractStats?.totalEmployers || 0}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Total Employers</div>
                            <div className="text-xs text-green-600 mt-1">
                                {contractStats?.totalVerifiedEmployers || 0} Verified
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {contractStats?.totalDocuments || 0}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Total Documents</div>
                            <div className="text-xs text-purple-600 mt-1">
                                {contractStats?.totalVerifiedDocuments || 0} Verified
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {userStats.reputation?.reputationScore || 0}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>Your Reputation</div>
                            <div className="text-xs text-orange-600 mt-1">
                                Level {Math.floor((userStats.reputation?.reputationScore || 0) / 10) + 1}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NextLink href="/dashboard/income-streams">
                    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'border-green-600 hover:border-green-500' : 'border-green-200 hover:border-green-300'}`}>
                        <CardContent className="p-6 text-center">
                            <TrendingUp className="w-12 h-12 mx-auto text-green-600 mb-3" />
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-900'}`}>Income Streams</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'} mt-2`}>Manage your professional income sources</p>
                        </CardContent>
                    </Card>
                </NextLink>

                <NextLink href="/dashboard/employer-verification">
                    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'border-blue-600 hover:border-blue-500' : 'border-blue-200 hover:border-blue-300'}`}>
                        <CardContent className="p-6 text-center">
                            <Building2 className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>Employer Verification</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} mt-2`}>Verify and manage employer profiles</p>
                        </CardContent>
                    </Card>
                </NextLink>

                <NextLink href="/dashboard/documents">
                    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'border-purple-600 hover:border-purple-500' : 'border-purple-200 hover:border-purple-300'}`}>
                        <CardContent className="p-6 text-center">
                            <FileText className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>Documents</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'} mt-2`}>Generate professional verification documents</p>
                        </CardContent>
                    </Card>
                </NextLink>

                <NextLink href="/create-profile">
                    <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'border-orange-600 hover:border-orange-500' : 'border-orange-200 hover:border-orange-300'}`}>
                        <CardContent className="p-6 text-center">
                            <Globe className="w-12 h-12 mx-auto text-orange-600 mb-3" />
                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-900'}`}>ENS Profile</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'} mt-2`}>Create your web3 professional identity</p>
                        </CardContent>
                    </Card>
                </NextLink>
            </div>

            {/* Your Profile Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Your Income Sources
                        </CardTitle>
                        <CardDescription>
                            Track your professional earnings and verification status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userStats.incomeSources ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`text-center p-4 rounded-xl ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                                        <div className="text-2xl font-bold text-green-600">
                                            {userStats.incomeSources.totalSources}
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Total Sources</div>
                                    </div>
                                    <div className={`text-center p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {userStats.incomeSources.verifiedSources}
                                        </div>
                                        <div className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Verified</div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Monthly Income</span>
                                        <span className="font-semibold text-green-600">
                                            {userStats.incomeSources.totalMonthlyIncome} ETH
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Linked Transactions</span>
                                        <span className="font-semibold">
                                            {userStats.incomeSources.totalTransactions}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <NextLink href="/dashboard/income-streams">
                                        <Button className="w-full" variant="outline">
                                            Manage Income Sources
                                        </Button>
                                    </NextLink>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No Income Sources Yet</h3>
                                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-4`}>Start tracking your professional earnings</p>
                                <NextLink href="/dashboard/income-streams">
                                    <Button>
                                        Add Income Source
                                    </Button>
                                </NextLink>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Documents & Reputation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Your Professional Status
                        </CardTitle>
                        <CardDescription>
                            Documents, reputation, and verification progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userStats.documents && userStats.reputation ? (
                            <>
                                {/* Documents */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Documents
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Total:</span>
                                            <span className="font-semibold">{userStats.documents.totalDocuments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Verified:</span>
                                            <span className="font-semibold text-green-600">{userStats.documents.verifiedDocuments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Valid:</span>
                                            <span className="font-semibold text-blue-600">{userStats.documents.validDocuments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Expired:</span>
                                            <span className="font-semibold text-red-600">{userStats.documents.expiredDocuments}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reputation */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center">
                                        <Star className="w-4 h-4 mr-2" />
                                        Reputation
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Score:</span>
                                            <span className="font-semibold text-orange-600">
                                                {userStats.reputation.reputationScore}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Verifications Given:</span>
                                            <span className="font-semibold text-green-600">
                                                {userStats.reputation.verificationsGiven}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Verifications Received:</span>
                                            <span className="font-semibold text-blue-600">
                                                {userStats.reputation.verificationsReceived}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <NextLink href="/dashboard/documents">
                                        <Button className="w-full" variant="outline">
                                            Manage Documents
                                        </Button>
                                    </NextLink>
                                    <NextLink href="/dashboard/income-streams">
                                        <Button className="w-full" variant="outline">
                                            Verify Others
                                        </Button>
                                    </NextLink>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Award className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Build Your Reputation</h3>
                                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-4`}>Start verifying others to earn reputation points</p>
                                <NextLink href="/dashboard/income-streams">
                                    <Button>
                                        Start Verifying
                                    </Button>
                                </NextLink>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Platform Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Zap className="w-6 h-6 mr-2" />
                        Platform Features
                    </CardTitle>
                    <CardDescription>
                        Everything you need for professional verification and income management
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                <Globe className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ENS Integration</h4>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                Get your own ENS subdomain (yourname.nosen.eth) for a professional web3 identity
                            </p>
                        </div>
                        <div className="text-center">
                            <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Community Verification</h4>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                Decentralized verification system powered by community consensus and reputation
                            </p>
                        </div>
                        <div className="text-center">
                            <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                <Link className="w-8 h-8 text-purple-600" />
                            </div>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Transaction Linking</h4>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                Connect your blockchain transactions to income sources for complete verification
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        Your latest platform activities and verifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className={`flex items-center justify-between p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                <div>
                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Profile Created</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Your professional profile is now active</p>
                                </div>
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Just now</span>
                        </div>
                        
                        <div className={`flex items-center justify-between p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-600 mr-3" />
                                <div>
                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reputation Earned</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>+5 reputation points for profile creation</p>
                                </div>
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Just now</span>
                        </div>
                        
                        <div className={`flex items-center justify-between p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <div className="flex items-center">
                                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ENS Ready</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Create your ENS subdomain to get started</p>
                                </div>
                            </div>
                            <NextLink href="/create-profile">
                                <Button size="sm" variant="outline">
                                    Get Started
                                </Button>
                            </NextLink>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}