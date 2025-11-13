'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { RoleGuard } from '../../../components/RoleGuard';
import EmployerSidebar from '../../../components/EmployerSidebar';
import { useRouter } from 'next/navigation';
import { useSetup } from '../../../contexts/SetupContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

// African countries with phone prefixes
const AFRICAN_COUNTRIES = [
  { name: 'Nigeria', code: 'NG', prefix: '+234' },
  { name: 'Ghana', code: 'GH', prefix: '+233' },
  { name: 'Kenya', code: 'KE', prefix: '+254' },
  { name: 'South Africa', code: 'ZA', prefix: '+27' },
  { name: 'Egypt', code: 'EG', prefix: '+20' },
  { name: 'Ethiopia', code: 'ET', prefix: '+251' },
  { name: 'Tanzania', code: 'TZ', prefix: '+255' },
  { name: 'Uganda', code: 'UG', prefix: '+256' },
  { name: 'Algeria', code: 'DZ', prefix: '+213' },
  { name: 'Sudan', code: 'SD', prefix: '+249' },
  { name: 'Morocco', code: 'MA', prefix: '+212' },
  { name: 'Angola', code: 'AO', prefix: '+244' },
  { name: 'Mozambique', code: 'MZ', prefix: '+258' },
  { name: 'Madagascar', code: 'MG', prefix: '+261' },
  { name: 'Cameroon', code: 'CM', prefix: '+237' },
  { name: 'Ivory Coast', code: 'CI', prefix: '+225' },
  { name: 'Niger', code: 'NE', prefix: '+227' },
  { name: 'Burkina Faso', code: 'BF', prefix: '+226' },
  { name: 'Mali', code: 'ML', prefix: '+223' },
  { name: 'Malawi', code: 'MW', prefix: '+265' },
  { name: 'Zambia', code: 'ZM', prefix: '+260' },
  { name: 'Zimbabwe', code: 'ZW', prefix: '+263' },
  { name: 'Senegal', code: 'SN', prefix: '+221' },
  { name: 'Chad', code: 'TD', prefix: '+235' },
  { name: 'Somalia', code: 'SO', prefix: '+252' },
  { name: 'Guinea', code: 'GN', prefix: '+224' },
  { name: 'Rwanda', code: 'RW', prefix: '+250' },
  { name: 'Benin', code: 'BJ', prefix: '+229' },
  { name: 'Burundi', code: 'BI', prefix: '+257' },
  { name: 'Tunisia', code: 'TN', prefix: '+216' },
  { name: 'Togo', code: 'TG', prefix: '+228' },
  { name: 'Sierra Leone', code: 'SL', prefix: '+232' },
  { name: 'Libya', code: 'LY', prefix: '+218' },
  { name: 'Liberia', code: 'LR', prefix: '+231' },
  { name: 'Central African Republic', code: 'CF', prefix: '+236' },
  { name: 'Mauritania', code: 'MR', prefix: '+222' },
  { name: 'Eritrea', code: 'ER', prefix: '+291' },
  { name: 'Gambia', code: 'GM', prefix: '+220' },
  { name: 'Botswana', code: 'BW', prefix: '+267' },
  { name: 'Namibia', code: 'NA', prefix: '+264' },
  { name: 'Gabon', code: 'GA', prefix: '+241' },
  { name: 'Lesotho', code: 'LS', prefix: '+266' },
  { name: 'Guinea-Bissau', code: 'GW', prefix: '+245' },
  { name: 'Equatorial Guinea', code: 'GQ', prefix: '+240' },
  { name: 'Mauritius', code: 'MU', prefix: '+230' },
  { name: 'Eswatini', code: 'SZ', prefix: '+268' },
  { name: 'Djibouti', code: 'DJ', prefix: '+253' },
  { name: 'Comoros', code: 'KM', prefix: '+269' },
  { name: 'Cabo Verde', code: 'CV', prefix: '+238' },
  { name: 'Sao Tome and Principe', code: 'ST', prefix: '+239' },
  { name: 'Seychelles', code: 'SC', prefix: '+248' },
].sort((a, b) => a.name.localeCompare(b.name));

const EmployerProfilePage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { updateSetupProgress } = useSetup();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    country: '',
    phone: '',
    website: ''
  });
  const [phonePrefix, setPhonePrefix] = useState('');

  // Set phone prefix when country is selected or loaded
  useEffect(() => {
    if (formData.country) {
      const country = AFRICAN_COUNTRIES.find(c => c.name === formData.country);
      if (country) {
        setPhonePrefix(country.prefix);
      }
    }
  }, [formData.country]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = AFRICAN_COUNTRIES.find(c => c.code === e.target.value);
    if (selectedCountry) {
      setFormData({ ...formData, country: selectedCountry.name });
      setPhonePrefix(selectedCountry.prefix);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement profile save logic
    setTimeout(() => {
      setLoading(false);
      updateSetupProgress('profileCompleted', true);
      router.push('/dashboard/employer/setup');
    }, 1000);
  };

  return (
    <RoleGuard allowedRole="employer">
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="md:ml-64">
          <div className={`sticky top-0 z-30 border-b ${
            theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <main className="p-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                        Company Profile
                      </CardTitle>
                      <CardDescription>
                        Setup your company information for payroll management
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          required
                          className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          id="country"
                          value={AFRICAN_COUNTRIES.find(c => c.name === formData.country)?.code || ''}
                          onChange={handleCountryChange}
                          required
                        >
                          <option value="">Select a country</option>
                          {AFRICAN_COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex">
                          <div className={`flex items-center px-4 rounded-l-xl border-y-2 border-l-2 ${
                            theme === 'dark' 
                              ? 'bg-slate-700 border-slate-600 text-slate-300' 
                              : 'bg-slate-100 border-slate-300 text-slate-700'
                          }`}>
                            <span className="text-sm font-medium">{phonePrefix || '+XXX'}</span>
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="1234567890"
                            className={`rounded-l-none border-l-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}`}
                          />
                        </div>
                        {phonePrefix && (
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Format: {phonePrefix} XXXXXXXXXX
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className={theme === 'dark' ? 'bg-slate-800 border-slate-600' : ''}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {loading ? 'Saving...' : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default EmployerProfilePage;

