'use client';

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import SimpleSidebar from '../../components/SimpeSidebar';
import { 
  Settings, 
  Save, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Activity,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  Calendar,
  Building,
  Wallet,
  FileText,
  Download,
  Trash2,
  Edit3,
  CheckCircle
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock user settings data
  const userSettings = {
    profile: {
      displayName: profile?.displayName || 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      timezone: 'UTC-5',
      language: 'English',
      dateFormat: 'MM/DD/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      incomeAlerts: true,
      taxReminders: true,
      securityAlerts: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      loginNotifications: true,
      suspiciousActivityAlerts: true
    },
    preferences: {
      defaultCurrency: 'USD',
      defaultNetwork: 'Ethereum',
      autoExport: false,
      darkMode: theme === 'dark'
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, description: 'Personal information and preferences' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Alert and notification settings' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Account security and privacy' },
    { id: 'preferences', name: 'Preferences', icon: Settings, description: 'Platform and display settings' },
    { id: 'data', name: 'Data & Export', icon: Download, description: 'Data management and export options' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔷' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'optimism', name: 'Optimism', icon: '🟠' },
    { id: 'solana', name: 'Solana', icon: '🟢' },
    { id: 'avalanche', name: 'Avalanche', icon: '🔴' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' }
  ];

  if (!hasProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Settings className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile First
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              You need to create your ENS profile before accessing settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-16 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          } shadow-lg`}
        >
          <Activity className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <SimpleSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Settings
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Manage your account preferences and platform settings
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm font-medium">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Settings Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="p-4">
                  <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Settings
                  </h2>
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : theme === 'dark'
                                ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5" />
                            <div>
                              <div className="font-medium">{tab.name}</div>
                              <div className={`text-xs ${activeTab === tab.id ? 'text-emerald-700 dark:text-emerald-200' : 'text-slate-500'}`}>
                                {tab.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Settings Content */}
            <div className="lg:col-span-3">
              <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                      >
                        <Edit3 className="w-4 h-4 mr-2 inline" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Display Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={userSettings.profile.displayName}
                              className={`w-full px-3 py-2 border rounded-lg ${
                                theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          ) : (
                            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {userSettings.profile.displayName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              defaultValue={userSettings.profile.email}
                              className={`w-full px-3 py-2 border rounded-lg ${
                                theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          ) : (
                            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {userSettings.profile.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Phone
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              defaultValue={userSettings.profile.phone}
                              className={`w-full px-3 py-2 border rounded-lg ${
                                theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          ) : (
                            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {userSettings.profile.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Language
                          </label>
                          {isEditing ? (
                            <select className={`w-full px-3 py-2 border rounded-lg ${
                              theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                            }`}>
                              {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                  {lang.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {languages.find(l => l.code === userSettings.profile.language)?.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-4">
                      {Object.entries(userSettings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={value} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Security & Privacy
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Two-Factor Authentication
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 text-sm font-medium">Enabled</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                          Manage 2FA
                        </button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Change Password
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Current Password"
                              className={`w-full px-3 py-2 border rounded-lg pr-10 ${
                                theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
                            </button>
                          </div>
                          <input
                            type="password"
                            placeholder="New Password"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                          <input
                            type="password"
                            placeholder="Confirm New Password"
                            className={`w-full px-3 py-2 border rounded-lg ${
                              theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                        <button className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Settings */}
                {activeTab === 'preferences' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Platform Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Default Currency
                          </label>
                          <select className={`w-full px-3 py-2 border rounded-lg ${
                            theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                          }`}>
                            {currencies.map(currency => (
                              <option key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.name} ({currency.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Default Network
                          </label>
                          <select className={`w-full px-3 py-2 border rounded-lg ${
                            theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                          }`}>
                            {networks.map(network => (
                              <option key={network.id} value={network.id}>
                                {network.icon} {network.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Dark Mode
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Switch between light and dark themes
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={theme === 'dark'}
                              onChange={toggleTheme}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Export Settings */}
                {activeTab === 'data' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Data Management
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Export Data
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Download your data in various formats
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            <Download className="w-4 h-4 mr-2 inline" />
                            CSV Export
                          </button>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            <Download className="w-4 h-4 mr-2 inline" />
                            PDF Report
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            <Download className="w-4 h-4 mr-2 inline" />
                            JSON Data
                          </button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              Account Deletion
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Permanently delete your account and all data
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                          <Trash2 className="w-4 h-4 mr-2 inline" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
