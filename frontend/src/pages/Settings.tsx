import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Bell, EyeOff, 
  Info, AlertTriangle, RefreshCw, CheckCircle, Save, ShieldAlert
} from 'lucide-react';
import { fetchApi } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

interface SettingsData {
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    profilePhoto: string;
    country: string;
    timezone: string;
    language: string;
    email: string;
    role: string;
    joinedDate: string;
  };
  security: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    isTwoFactorEnabled: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    enableLoginNotifications: boolean;
    lastLogin: string;
  };
  notifications: {
    tradeNotifications: boolean;
    buyNotifications: boolean;
    sellNotifications: boolean;
    portfolioAlerts: boolean;
    priceAlerts: boolean;
    marketNews: boolean;
    emailNotifications: boolean;
    browserNotifications: boolean;
    systemAnnouncements: boolean;
  };
  trading: {
    defaultCurrency: string;
    defaultTradingPair: string;
    chartTheme: string;
    defaultChartInterval: string;
    enableSoundEffects: boolean;
    autoRefresh: boolean;
    decimalPrecision: boolean;
  };
  privacy: {
    hidePortfolioValue: boolean;
    hideWalletBalance: boolean;
    hideEmail: boolean;
    hidePhoneNumber: boolean;
    hideTotalProfit: boolean;
  };
  theme: {
    themeMode: string;
    accentColor: string;
  };
}

import PhoneVerificationModal from '../components/modals/PhoneVerificationModal';
import EmailVerificationModal from '../components/modals/EmailVerificationModal';

const Settings: React.FC = () => {
  const { setThemeMode, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [data, setData] = useState<SettingsData | null>(null);
  
  // Security specific
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/settings');
      setData(response);
    } catch (error) {
      console.error('Failed to load settings', error);
      showMessage('error', 'Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSave = async (section: keyof SettingsData) => {
    if (!data) return;
    
    setSaving(true);
    setMessage(null);
    try {
      let payload = { ...data[section] };
      
      if (section === 'security') {
        if (passwords.newPassword) {
          if (passwords.newPassword !== passwords.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            setSaving(false);
            return;
          }
          if (passwords.newPassword.length < 8) {
            showMessage('error', 'Password must be at least 8 characters');
            setSaving(false);
            return;
          }
          payload = { ...payload, currentPassword: passwords.currentPassword, newPassword: passwords.newPassword };
        }
      }

      const response = await fetchApi(`/api/settings/${section}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      if (section === 'profile' && response && typeof response === 'object') {
        setData(prev => prev ? { ...prev, profile: { ...prev.profile, ...response } } : null);
      }
      
      showMessage('success', `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
      
      if (section === 'security') {
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      const msg = error.message || 'Failed to save settings';
      if (msg.toLowerCase().includes('sql') || msg.toLowerCase().includes('hibernate') || msg.toLowerCase().includes('constraint') || msg.toLowerCase().includes('could not execute')) {
        showMessage('error', 'Unable to update profile. Please try again.');
      } else {
        showMessage('error', msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm("Are you sure? This will delete all demo portfolios, holdings, orders, transactions, and trade history. Your wallet will be reset and Demo Reward credited again. This action cannot be undone.")) {
      return;
    }
    
    setResetting(true);
    setMessage(null);
    try {
      await fetchApi('/api/settings/reset-demo', { method: 'POST' });
      showMessage('success', 'Demo Account Reset Successfully');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to reset demo account');
    } finally {
      setResetting(false);
    }
  };

  const handleChange = (section: keyof SettingsData, field: string, value: any) => {
    if (!data) return;

    if (section === 'theme') {
      if (field === 'themeMode') setThemeMode(value as any);
      if (field === 'accentColor') setAccentColor(value as any);
    }

    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  if (loading || !data) {
    return (
      <div className="p-8 space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <div className="flex justify-center py-20">
          <RefreshCw className="animate-spin text-primary" size={48} />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: EyeOff },
    { id: 'about', label: 'About', icon: Info },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-secondary">Manage your account preferences and configurations</p>
        </div>
        
        {message && (
          <div className={`px-4 py-3 rounded-xl flex items-center gap-3 animate-slide-in-right ${
            message.type === 'success' 
              ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
              : 'bg-accent-pink/10 text-accent-pink border border-accent-pink/20'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left border border-transparent ${
                  isActive 
                    ? (tab.danger ? 'bg-red-500/10 text-red-400 shadow-[inset_2px_0_0_#ef4444]' : 'bg-gradient-to-r from-[#7C3AED]/25 to-[#06B6D4]/10 text-white shadow-[inset_2px_0_0_#22D3EE]')
                    : 'text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-8">
          
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary border-b border-vault-700/50 pb-4">Profile Settings</h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-vault-700/50 border-2 border-accent-neonBlue/50 flex items-center justify-center overflow-hidden">
                    {data.profile.profilePhoto ? (
                      <img src={data.profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-muted" />
                    )}
                  </div>
                  <button className="px-4 py-2 bg-vault-700 hover:bg-vault-600 rounded-lg text-sm text-primary transition-colors">
                    Change Photo
                  </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">First Name</label>
                    <input 
                      type="text" 
                      value={data.profile.firstName} 
                      onChange={e => handleChange('profile', 'firstName', e.target.value)}
                      className="w-full bg-[#050B18]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22D3EE]/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">Last Name</label>
                    <input 
                      type="text" 
                      value={data.profile.lastName} 
                      onChange={e => handleChange('profile', 'lastName', e.target.value)}
                      className="w-full bg-[#050B18]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22D3EE]/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={data.profile.email} 
                      disabled
                      className="w-full bg-[#050B18]/30 border border-white/5 rounded-xl px-4 py-3 text-secondary cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">Phone Number</label>
                    <input 
                      type="tel" 
                      value={data.profile.phone || ''} 
                      onChange={e => handleChange('profile', 'phone', e.target.value)}
                      placeholder="+91 "
                      className="w-full bg-[#050B18]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22D3EE]/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">Country</label>
                    <select 
                      value={data.profile.country} 
                      onChange={e => handleChange('profile', 'country', e.target.value)}
                      className="w-full bg-[#050B18]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22D3EE]/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-secondary block">Timezone</label>
                    <select 
                      value={data.profile.timezone} 
                      onChange={e => handleChange('profile', 'timezone', e.target.value)}
                      className="w-full bg-[#050B18]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22D3EE]/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-all"
                    >
                      <option value="UTC+05:30">IST (UTC+05:30)</option>
                      <option value="UTC+00:00">GMT (UTC+00:00)</option>
                      <option value="UTC-05:00">EST (UTC-05:00)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => handleSave('profile')}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ACCOUNT & SECURITY */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-primary border-b border-vault-700/50 pb-4">Account & Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Change Password</h3>
                  <div className="space-y-3">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      value={passwords.currentPassword}
                      onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                      className="w-full bg-vault-900 border border-vault-700 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={passwords.newPassword}
                      onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                      className="w-full bg-vault-900 border border-vault-700 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password"
                      value={passwords.confirmPassword}
                      onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="w-full bg-vault-900 border border-vault-700 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-neonBlue/50"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('security')}
                    disabled={saving || !passwords.currentPassword || !passwords.newPassword}
                    className="btn-primary w-full flex justify-center items-center gap-2"
                  >
                    {saving ? <RefreshCw size={18} className="animate-spin" /> : <Shield size={18} />}
                    Update Password
                  </button>
                </div>

                {/* Security Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Security Status</h3>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div>
                      <p className="text-primary font-medium">Email Verification</p>
                      <p className="text-sm text-secondary">Protect your account</p>
                    </div>
                    {data.security.isEmailVerified ? (
                      <span className="px-3 py-1 bg-accent-green/10 text-accent-green rounded-full text-xs font-bold border border-accent-green/20 flex items-center gap-1">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <button onClick={() => setIsEmailModalOpen(true)} className="text-primary text-sm font-semibold hover:underline">Verify</button>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div>
                      <p className="text-primary font-medium">Phone Verification</p>
                      <p className="text-sm text-secondary">Used for withdrawals</p>
                    </div>
                    {data.security.isPhoneVerified ? (
                      <span className="px-3 py-1 bg-accent-green/10 text-accent-green rounded-full text-xs font-bold border border-accent-green/20 flex items-center gap-1">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <button onClick={() => setIsPhoneModalOpen(true)} className="text-primary text-sm font-semibold hover:underline">Verify</button>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div>
                      <p className="text-primary font-medium">Two-Factor Authentication (2FA)</p>
                      <p className="text-sm text-secondary">Authenticator app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={data.security.isTwoFactorEnabled}
                        onChange={e => handleChange('security', 'isTwoFactorEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-[#0B1830] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#06B6D4] peer-checked:border-transparent peer-checked:after:bg-white shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div>
                      <p className="text-primary font-medium">Login Notifications</p>
                      <p className="text-sm text-secondary">Get alerts for new logins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={data.security.enableLoginNotifications}
                        onChange={e => handleChange('security', 'enableLoginNotifications', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-[#0B1830] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#06B6D4] peer-checked:border-transparent peer-checked:after:bg-white shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-vault-700/50 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Device Sessions</h3>
                <div className="overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#050B18]/50 text-secondary border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Device</th>
                        <th className="px-4 py-3 font-semibold">IP Address</th>
                        <th className="px-4 py-3 font-semibold">Last Active</th>
                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-secondary divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 font-medium text-primary flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                          Current Browser (Windows)
                        </td>
                        <td className="px-4 py-3 font-mono">192.168.1.1</td>
                        <td className="px-4 py-3">Just now</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-muted">Current</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary border-b border-vault-700/50 pb-4">Notification Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                
                {/* Trade Alerts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary text-primary">Trading Alerts</h3>
                  
                  {[
                    { id: 'tradeNotifications', label: 'Trade Execution', desc: 'Get notified when an order fills' },
                    { id: 'buyNotifications', label: 'Buy Alerts', desc: 'Specific alerts for buy orders' },
                    { id: 'sellNotifications', label: 'Sell Alerts', desc: 'Specific alerts for sell orders' },
                    { id: 'portfolioAlerts', label: 'Portfolio Updates', desc: 'Daily summary of portfolio' },
                    { id: 'priceAlerts', label: 'Price Alerts', desc: 'When assets hit your target price' },
                  ].map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-white/5 py-3">
                      <div>
                        <p className="text-primary font-medium">{item.label}</p>
                        <p className="text-sm text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={(data.notifications as any)[item.id]}
                          onChange={e => handleChange('notifications', item.id, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[#0B1830] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#06B6D4] peer-checked:border-transparent peer-checked:after:bg-white shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* System Alerts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary text-accent-pink">System & News</h3>
                  
                  {[
                    { id: 'marketNews', label: 'Market News', desc: 'Daily crypto news updates' },
                    { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive alerts via Email' },
                    { id: 'browserNotifications', label: 'Browser Push', desc: 'Receive web push notifications' },
                    { id: 'systemAnnouncements', label: 'System Announcements', desc: 'Maintenance and updates' },
                  ].map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-white/5 py-3">
                      <div>
                        <p className="text-primary font-medium">{item.label}</p>
                        <p className="text-sm text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={(data.notifications as any)[item.id]}
                          onChange={e => handleChange('notifications', item.id, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[#0B1830] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#06B6D4] peer-checked:border-transparent peer-checked:after:bg-white shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button onClick={() => handleSave('notifications')} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} Save Notifications
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary border-b border-vault-700/50 pb-4">Privacy & Display</h2>
              
              <div className="space-y-4">
                {[
                  { id: 'hidePortfolioValue', label: 'Hide Portfolio Value', desc: 'Mask total portfolio value with *** on Dashboard' },
                  { id: 'hideWalletBalance', label: 'Hide Wallet Balance', desc: 'Mask individual asset balances' },
                  { id: 'hideTotalProfit', label: 'Hide Total Profit', desc: 'Do not display profit/loss in absolute terms' },
                  { id: 'hideEmail', label: 'Hide Email', desc: 'Mask your email in the header and profile' },
                  { id: 'hidePhoneNumber', label: 'Hide Phone Number', desc: 'Mask your phone number' },
                ].map(item => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-white/5">
                    <div>
                      <p className="text-primary font-medium flex items-center gap-2">
                        <EyeOff size={16} className="text-secondary" /> {item.label}
                      </p>
                      <p className="text-sm text-secondary">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={(data.privacy as any)[item.id]}
                        onChange={e => handleChange('privacy', item.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-[#0B1830] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#7C3AED] peer-checked:to-[#06B6D4] peer-checked:border-transparent peer-checked:after:bg-white shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <button onClick={() => handleSave('privacy')} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} Save Privacy
                </button>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary border-b border-vault-700/50 pb-4">About System</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-vault-900 border border-vault-700 rounded-2xl flex items-center justify-center font-bold text-2xl text-primary shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  <span className="text-primary">Z</span>X
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">CryptoVaultX</h3>
                  <p className="text-secondary">Professional Cryptocurrency Exchange</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">Version</p>
                  <p className="text-primary font-mono">v2.4.0-stable</p>
                </div>
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">Frontend Build</p>
                  <p className="text-primary font-mono">React + Vite (ES2022)</p>
                </div>
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">Backend Core</p>
                  <p className="text-primary font-mono">Spring Boot 3.3.1</p>
                </div>
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">API Status</p>
                  <p className="text-accent-green font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span> Operational
                  </p>
                </div>
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">Database</p>
                  <p className="text-accent-green font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span> Connected
                  </p>
                </div>
                <div className="bg-vault-900/50 p-4 rounded-xl border border-vault-700/50">
                  <p className="text-secondary text-sm mb-1">WebSocket Sync</p>
                  <p className="text-accent-green font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span> Connected
                  </p>
                </div>
              </div>
              
              <div className="pt-8 text-center text-muted text-sm">
                &copy; {new Date().getFullYear()} CryptoVaultX Technologies. All rights reserved.
              </div>
            </div>
          )}

          {/* DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-accent-pink border-b border-accent-pink/30 pb-4 flex items-center gap-3">
                <ShieldAlert size={28} /> Danger Zone
              </h2>
              
              <div className="bg-vault-900/50 rounded-xl p-6 border border-accent-pink/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                <h3 className="text-xl font-bold text-primary mb-2">Reset Demo Account</h3>
                <p className="text-secondary mb-6 max-w-2xl">
                  This will permanently delete all your virtual portfolios, current crypto holdings, active orders, transaction history, and trade records. Your virtual INR wallet will be reset, and the initial ₹10,00,000 INR demo reward will be credited again.
                </p>
                
                <div className="bg-accent-pink/10 border-l-4 border-accent-pink p-4 rounded-r-lg mb-6">
                  <p className="text-accent-pink font-semibold flex items-center gap-2">
                    <AlertTriangle size={20} /> Warning: This action cannot be undone.
                  </p>
                </div>
                
                <button
                  onClick={handleResetDemo}
                  disabled={resetting}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {resetting ? (
                    <><RefreshCw size={20} className="animate-spin" /> Resetting System...</>
                  ) : (
                    <><AlertTriangle size={20} /> Proceed with Reset</>
                  )}
                </button>
              </div>
              
              <div className="bg-vault-900/50 rounded-xl p-6 border border-vault-700 mt-8">
                <h3 className="text-xl font-bold text-primary mb-2">Delete Account</h3>
                <p className="text-secondary mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                      alert("Account deletion request has been submitted to support. They will contact your registered email within 24 hours to complete the process.");
                    }
                  }} 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Delete Account (Contact Support)
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <PhoneVerificationModal 
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        initialPhone={data.profile.phone || ''}
        onSuccess={() => {
          setIsPhoneModalOpen(false);
          loadSettings();
          showMessage('success', 'Phone number verified successfully!');
        }}
      />

      <EmailVerificationModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        onSuccess={() => {
          setIsEmailModalOpen(false);
          loadSettings();
          showMessage('success', 'Email verified successfully!');
        }}
        initialEmail={data.profile.email}
      />
    </div>
  );
};

export default Settings;
