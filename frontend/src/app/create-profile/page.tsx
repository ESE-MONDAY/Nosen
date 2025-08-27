'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, ArrowLeft, CheckCircle, Loader2, AlertCircle, Check, Zap } from 'lucide-react';
import Link from 'next/link';

const CreateProfilePage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const { createProfile, isLoading, checkProfileAvailability, estimateGas } = useProfile();
  
  const [subdomain, setSubdomain] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Check availability when subdomain changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (subdomain.length >= 3 && subdomain.length <= 20) {
        setIsCheckingAvailability(true);
        setAvailabilityStatus('checking');
        
        try {
          const isAvailable = await checkProfileAvailability(subdomain);
          setAvailabilityStatus(isAvailable ? 'available' : 'taken');
          
          // Estimate gas if available
          if (isAvailable) {
            setIsEstimatingGas(true);
            try {
              const gas = await estimateGas(subdomain);
              setGasEstimate(gas);
            } catch (error) {
              console.error('Failed to estimate gas:', error);
              setGasEstimate(null);
            } finally {
              setIsEstimatingGas(false);
            }
          } else {
            setGasEstimate(null);
          }
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailabilityStatus('idle');
        } finally {
          setIsCheckingAvailability(false);
        }
      } else {
        setAvailabilityStatus('idle');
        setGasEstimate(null);
      }
    };

    // Debounce the availability check
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [subdomain, checkProfileAvailability, estimateGas]);

  const handleCreateProfile = async () => {
    if (!subdomain.trim()) {
      setError('Please enter a subdomain');
      return;
    }
    
    if (subdomain.length < 3) {
      setError('Subdomain must be at least 3 characters');
      return;
    }
    
    if (subdomain.length > 20) {
      setError('Subdomain must be less than 20 characters');
      return;
    }
    
    // Basic validation for allowed characters
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    if (availabilityStatus !== 'available') {
      setError('Please choose an available subdomain');
      return;
    }
    
    setError('');
    setIsCreating(true);
    
    try {
      await createProfile(subdomain, displayName || subdomain, bio);
      // Profile creation successful, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getAvailabilityIcon = () => {
    switch (availabilityStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'available':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'taken':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityText = () => {
    switch (availabilityStatus) {
      case 'checking':
        return 'Checking availability...';
      case 'available':
        return 'Available!';
      case 'taken':
        return 'Already taken';
      default:
        return '';
    }
  };

  const getAvailabilityColor = () => {
    switch (availabilityStatus) {
      case 'checking':
        return 'text-blue-500';
      case 'available':
        return 'text-green-500';
      case 'taken':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  if (!isConnected) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className={`inline-flex items-center text-sm font-medium transition-colors ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-slate-300' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="mt-6 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            } border-2 border-dashed border-slate-400`}>
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Create Your ENS Profile
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Set up your professional identity on the Nosen platform
            </p>
          </div>
        </div>

        {/* Profile Creation Form */}
        <div className={`p-8 rounded-xl border ${
          theme === 'dark' 
            ? 'border-slate-600 bg-slate-800' 
            : 'border-slate-300 bg-white'
        }`}>
          <div className="space-y-6">
            {/* Subdomain */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Choose Your Subdomain *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                  placeholder="username"
                  className={`flex-1 px-3 py-2 rounded-l-lg border ${
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700 text-white'
                      : 'border-slate-300 bg-white text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <span className={`px-3 py-2 rounded-r-lg border-l-0 ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700 text-slate-300'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                }`}>
                  .nosen.eth
                </span>
              </div>
              
              {/* Availability Status */}
              {subdomain.length >= 3 && (
                <div className={`flex items-center mt-2 text-sm ${getAvailabilityColor()}`}>
                  {getAvailabilityIcon()}
                  <span className="ml-2">{getAvailabilityText()}</span>
                </div>
              )}
              
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                This will be your unique identity on the platform
              </p>
            </div>

            {/* Gas Estimate */}
            {gasEstimate && (
              <div className={`p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'border-blue-600 bg-blue-900/30' 
                  : 'border-blue-300 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-blue-500 mr-2" />
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Estimated Gas Cost
                    </span>
                  </div>
                  <span className={`text-sm font-mono ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    {gasEstimate.toString()} gas
                  </span>
                </div>
              </div>
            )}

            {/* Display Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                How you&apos;ll appear to others on the platform
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself, your skills, and what you do..."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Optional: Help others understand your professional background
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' 
                  ? 'bg-red-900/30 border border-red-700 text-red-300' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreateProfile}
              disabled={!subdomain.trim() || isCreating || availabilityStatus !== 'available'}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                !subdomain.trim() || isCreating || availabilityStatus !== 'available'
                  ? 'bg-slate-400 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className={`mt-8 p-6 rounded-xl border ${
          theme === 'dark' 
            ? 'border-slate-600 bg-slate-800/50' 
            : 'border-slate-300 bg-slate-50'
        }`}>
          <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            What happens next?
          </h3>
          <div className="space-y-2 text-sm">
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              • Your ENS subdomain will be created on the blockchain
            </p>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              • Profile metadata will be stored securely on IPFS
            </p>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              • You&apos;ll be redirected to your dashboard to start building your profile
            </p>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              • Gas fees will be charged for the blockchain transaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
