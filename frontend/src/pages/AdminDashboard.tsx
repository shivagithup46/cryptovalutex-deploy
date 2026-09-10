import { useEffect, useState } from 'react';
import { Users, Activity, AlertCircle, Wallet } from 'lucide-react';
import { fetchApi } from '../utils/api';

interface AdminMetrics {
    totalUsers: number;
    totalWallets: number;
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    tradingVolume24h: number;
}

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await fetchApi('/api/admin/metrics');
                setMetrics(data);
            } catch (err) {
                console.error("Failed to load admin metrics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-primary">Loading Admin Metrics...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-primary">Enterprise Admin Console</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-secondary text-sm">Total Active Users</p>
                            <h3 className="text-2xl font-bold font-mono mt-1">{metrics?.totalUsers || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-green-400 text-sm mt-4 font-bold">Daily: {metrics?.dailyActiveUsers || 0}</p>
                </div>
                
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-secondary text-sm">Total Wallets</p>
                            <h3 className="text-2xl font-bold font-mono mt-1">{metrics?.totalWallets || 0}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                            <Wallet size={24} />
                        </div>
                    </div>
                </div>

                <div className="glassmorphism rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-secondary text-sm">24H Trading Volume</p>
                            <h3 className="text-2xl font-bold font-mono mt-1">${((metrics?.tradingVolume24h || 0) / 1000000).toFixed(2)}M</h3>
                        </div>
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <p className="text-green-400 text-sm mt-4 font-bold">+5.2% today</p>
                </div>

                <div className="glassmorphism rounded-2xl p-6 border border-red-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 blur-2xl">
                        <div className="w-32 h-32 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-red-300 text-sm font-bold">AML Alerts</p>
                            <h3 className="text-2xl font-bold font-mono mt-1 text-red-400">14 Active</h3>
                        </div>
                        <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <button className="mt-4 w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-primary rounded-lg transition-colors font-bold text-sm">
                        Review Cases
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Recent KYC Applications</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-3 text-secondary">User</th>
                                <th className="p-3 text-secondary">Document</th>
                                <th className="p-3 text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/5">
                                <td className="p-3">Alex Johnson</td>
                                <td className="p-3">Passport</td>
                                <td className="p-3 text-right">
                                    <button className="text-primary font-bold hover:text-primary">Review</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span>Matching Engine API</span>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Healthy (12ms)</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span>Redis Cache</span>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span>Kafka Stream</span>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Healthy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
