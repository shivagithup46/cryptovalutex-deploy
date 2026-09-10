import { Download, AlertTriangle } from 'lucide-react';

export default function TaxDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading text-primary">Tax Management (India)</h1>
                <select className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none">
                    <option>FY 2026-2027</option>
                    <option>FY 2025-2026</option>
                </select>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-4 items-start">
                <AlertTriangle className="text-yellow-500 shrink-0" />
                <div className="text-sm text-yellow-200/80">
                    <p className="font-bold mb-1">Important Tax Information</p>
                    <p>Under Indian regulations, cryptocurrency profits are taxed at a flat 30%. Losses cannot be offset against profits from other assets. A 1% TDS is applicable on all sell transactions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <p className="text-secondary text-sm">Total 1% TDS Paid</p>
                    <h3 className="text-2xl font-bold font-mono mt-1">₹4,250.00</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <p className="text-secondary text-sm">Total Profit</p>
                    <h3 className="text-2xl font-bold font-mono mt-1 text-green-400">₹85,000.00</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                    <p className="text-secondary text-sm">Total Loss (Non-offset)</p>
                    <h3 className="text-2xl font-bold font-mono mt-1 text-red-400">₹12,000.00</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 blur-2xl">
                        <div className="w-32 h-32 bg-primary/50 rounded-full"></div>
                    </div>
                    <p className="text-primary text-sm font-bold">Estimated 30% Tax Liability</p>
                    <h3 className="text-3xl font-bold font-mono mt-1">₹25,500.00</h3>
                </div>
            </div>

            <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Tax Reports</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg font-bold transition-colors text-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 text-secondary">Date</th>
                            <th className="p-4 text-secondary">Token</th>
                            <th className="p-4 text-secondary">Type</th>
                            <th className="p-4 text-secondary">Total Value (INR)</th>
                            <th className="p-4 text-secondary">Profit/Loss (INR)</th>
                            <th className="p-4 text-secondary">TDS (1%)</th>
                            <th className="p-4 text-secondary">Tax (30%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {/* Mock Record */}
                        <tr className="hover:bg-white/5">
                            <td className="p-4">12 Oct 2026</td>
                            <td className="p-4 font-bold">BTC</td>
                            <td className="p-4 text-red-400 font-bold">SELL</td>
                            <td className="p-4 font-mono">₹450,000</td>
                            <td className="p-4 font-mono text-green-400">+₹50,000</td>
                            <td className="p-4 font-mono">₹4,500</td>
                            <td className="p-4 font-mono text-red-300">₹15,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
