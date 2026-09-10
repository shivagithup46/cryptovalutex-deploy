import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function AdvancedAnalytics() {
    const data = [
        { name: 'BTC', value: 45 },
        { name: 'ETH', value: 30 },
        { name: 'INR', value: 15 },
        { name: 'SOL', value: 10 },
    ];
    
    const COLORS = ['#a78bfa', '#34d399', '#fbbf24', '#60a5fa'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-primary">Advanced Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 h-96 flex flex-col">
                    <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-6">Trading Summary</h3>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-secondary">Win / Loss Ratio</span>
                            <span className="font-bold text-lg"><span className="text-green-400">68%</span> / <span className="text-red-400">32%</span></span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-secondary">Best Trade</span>
                            <span className="font-bold text-green-400">+₹1,45,000 (BTC)</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-secondary">Worst Trade</span>
                            <span className="font-bold text-red-400">-₹22,000 (ETH)</span>
                        </div>
                        <div className="flex justify-between items-center pb-4">
                            <span className="text-secondary">Diversification Score</span>
                            <span className="font-bold text-lg text-primary">8.5 / 10 (Excellent)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
