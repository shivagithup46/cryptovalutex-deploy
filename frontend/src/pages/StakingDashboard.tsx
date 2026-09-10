import { ArrowRight } from 'lucide-react';

export default function StakingDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-primary">Staking & Yield</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-2xl">
                        <div className="w-32 h-32 bg-green-500/30 rounded-full"></div>
                    </div>
                    <p className="text-secondary text-sm">Total Value Staked</p>
                    <h3 className="text-3xl font-bold font-mono mt-1">$12,450.00</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-2xl">
                        <div className="w-32 h-32 bg-primary/30 rounded-full"></div>
                    </div>
                    <p className="text-secondary text-sm">Total Rewards Earned</p>
                    <h3 className="text-3xl font-bold font-mono mt-1 text-green-400">+$342.89</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                    <button className="w-full py-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-xl font-bold transition-colors">
                        My Active Stakes
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Available Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Product */}
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center font-bold">
                                BTC
                            </div>
                            <h4 className="font-bold text-lg">BTC Staking</h4>
                        </div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
                            5.5% APY
                        </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-secondary">Duration</span>
                            <span className="font-mono">30 Days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-secondary">Min Amount</span>
                            <span className="font-mono">0.01 BTC</span>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white/5 text-primary group-hover:bg-primary group-hover:text-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        Stake Now <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
