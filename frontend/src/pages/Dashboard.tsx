import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, IndianRupee, Wallet, Gift, X } from 'lucide-react';
import { fetchApi } from '../utils/api';
import ChartPanel from './trade/ChartPanel';
import { useAuth } from '../context/AuthContext';

interface ActivityDto {
  type: string;
  time: string;
  amount: string;
  fiatValue: string;
  isPositive: boolean;
}

interface DashboardData {
  totalBalance: number;
  availableCash: number;
  portfolioValue: number;
  tradingVolume24h: number;
  activePositions: number;
  totalProfit: number;
  recentActivities: ActivityDto[];
}

const StatCard: React.FC<{ title: string; value: string; change?: string; isPositive: boolean; icon: any }> = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-vault-700/50 rounded-full blur-2xl group-hover:bg-accent-purple/20 transition-all duration-500"></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-primary">{value}</h3>
      </div>
      <div className="p-3 bg-vault-700/50 rounded-lg text-accent-electricCyan">
        <Icon size={24} />
      </div>
    </div>
    {change && (
    <div className="flex items-center gap-2 mt-2">
      <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-accent-pink'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </span>
      <span className="text-muted text-sm">vs last month</span>
    </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoClaimed, setDemoClaimed] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const { user } = useAuth();
  const privacy = user?.privacy;

  const fetchDashboardData = async () => {
    try {
      const [overviewResponse, demoResponse] = await Promise.all([
        fetchApi('/api/dashboard/overview'),
        fetchApi('/api/reward/status')
      ]);
      setData(overviewResponse);
      setDemoClaimed(demoResponse.claimed);
    } catch (error: any) {
      console.error('Failed to load dashboard data', error);
      setError(error.message || 'Failed to load dashboard data. Please try logging out and logging back in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('refreshPortfolio', handleRefresh);
    window.addEventListener('refreshWallet', handleRefresh);
    
    return () => {
        window.removeEventListener('refreshPortfolio', handleRefresh);
        window.removeEventListener('refreshWallet', handleRefresh);
    };
  }, []);

  const handleClaim = async () => {
    setClaimLoading(true);
    setClaimError('');
    try {
      await fetchApi('/api/reward/claim', { method: 'POST' });
      setClaimSuccess(true);
      setTimeout(() => {
        setShowClaimModal(false);
        setDemoClaimed(true);
        setClaimSuccess(false);
        fetchDashboardData();
      }, 2000);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim funds');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return <div className="text-primary text-center py-20">Loading Dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="text-primary text-center py-20 flex flex-col items-center gap-4">
        <p className="text-accent-pink font-bold">{error || 'Data unavailable'}</p>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="btn-primary">
          Log In Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Overview</h1>
          <p className="text-secondary">Welcome back. Here's your portfolio summary.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Wallet size={18} />
          Deposit Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={`₹${data.totalBalance.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} isPositive={true} icon={IndianRupee} />
        <StatCard title="Available Cash" value={`₹${data.availableCash.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} isPositive={true} icon={Wallet} />
        <StatCard 
          title="Portfolio Value" 
          value={privacy?.hidePortfolioValue ? '***' : `₹${data.portfolioValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} 
          isPositive={true} 
          icon={Activity} 
        />
        <StatCard 
          title="Total Profit" 
          value={privacy?.hideTotalProfit ? '***' : `${data.totalProfit >= 0 ? '+' : ''}₹${data.totalProfit.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} 
          isPositive={data.totalProfit >= 0} 
          icon={data.totalProfit >= 0 ? ArrowUpRight : ArrowDownRight} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-vault-800 to-vault-900 border border-accent-neonBlue/30">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-accent-neonBlue/20 transition-all duration-500"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2"><Gift className="text-primary" /> 🎁 Login Reward</h3>
              {demoClaimed && <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">Reward Claimed</span>}
            </div>
            <p className="text-secondary mb-6">Claim your Demo Trading Balance and start trading.</p>
            
            <div className="flex justify-between items-center bg-vault-900/50 p-4 rounded-xl mb-6">
              <div>
                <p className="text-sm text-muted">Demo Balance</p>
                <p className="text-xl font-bold font-mono text-primary">{demoClaimed ? '₹1,00,00,000' : '₹0'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">Claim Status</p>
                <p className={`font-bold ${demoClaimed ? 'text-green-400' : 'text-accent-pink'}`}>{demoClaimed ? 'Reward Claimed' : 'Available'}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted">Remaining Claims</p>
                <p className="font-bold text-primary">{demoClaimed ? '0' : '1'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowClaimModal(true)} 
            disabled={demoClaimed} 
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${demoClaimed ? 'bg-vault-700 text-muted cursor-not-allowed' : 'btn-primary'}`}
          >
            {demoClaimed ? 'Reward Claimed' : 'Claim Reward'}
          </button>
        </div>

        <div className="glass-card min-h-[400px] flex overflow-hidden">
          <ChartPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="glass-card p-6 lg:col-span-3">
          <h3 className="text-xl font-bold text-primary mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-vault-700/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-accent-pink/10 text-accent-pink'}`}>
                    {activity.isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{activity.type}</p>
                    <p className="text-xs text-secondary">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{activity.amount}</p>
                  <p className="text-xs text-secondary">{activity.fiatValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showClaimModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 relative animate-fade-in bg-vault-900 border border-accent-neonBlue/50">
            <button onClick={() => setShowClaimModal(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
              <X size={24} />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-accent-neonBlue/20 rounded-full flex items-center justify-center text-primary">
                <Gift size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-primary mb-4">Welcome to CryptoVaultX</h2>
            <div className="text-center text-secondary mb-8">
              <p className="mb-4">Claim your</p>
              <p className="text-4xl font-mono font-bold text-accent-electricCyan mb-4">₹1,00,00,000</p>
              <p className="mb-2">Demo Trading Balance.</p>
              <p className="text-sm text-accent-pink">These funds are virtual and intended only for demo trading.</p>
            </div>
            
            {claimError && <p className="text-accent-pink text-center mb-4">{claimError}</p>}
            {claimSuccess && <p className="text-green-400 font-bold text-center mb-4">Successfully claimed!</p>}

            <div className="flex gap-4">
              <button onClick={() => setShowClaimModal(false)} className="flex-1 py-3 rounded-lg border border-vault-600 text-primary font-bold hover:bg-vault-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleClaim} disabled={claimLoading || claimSuccess} className="flex-1 btn-primary py-3">
                {claimLoading ? 'Processing...' : 'Claim Reward'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
