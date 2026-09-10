import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { fetchApi } from '../../utils/api';
import { TrendingUp, TrendingDown, Wallet, Activity, Percent, ShieldCheck } from 'lucide-react';

interface AccountSummary {
    baseBalance: number;
    quoteBalance: number;
    estimatedValue: number;
    averageBuyPrice: number;
    currentRoi: number;
    marketStatus: string;
    makerFee: number;
    takerFee: number;
    riskLevel: string;
    riskPercentage: number;
}

export default function AccountSummaryPanel() {
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol) || 'BTC_INR';
    
    // Trigger re-fetch when wallets change (buy/sell/deposit/withdraw events)
    const wallets = useSelector((state: RootState) => state.wallet.wallets);
    
    const [summary, setSummary] = useState<AccountSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const parts = activeMarket.split('_');
    const baseToken = parts[0] || 'BTC';
    const quoteToken = parts[1] || 'INR';

    useEffect(() => {
        let isMounted = true;
        
        const loadSummary = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await fetchApi(`/api/portfolio/summary?market=${activeMarket}`);
                if (isMounted) {
                    setSummary(data);
                }
            } catch (err) {
                console.error("Failed to load account summary:", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadSummary();

        const handleTradeExecuted = () => {
            loadSummary();
        };

        window.addEventListener('trade-executed', handleTradeExecuted);

        return () => {
            isMounted = false;
            window.removeEventListener('trade-executed', handleTradeExecuted);
        };
    }, [activeMarket, wallets, retryCount]); 

    const formatCurrency = (val: number, isQuote: boolean) => {
        if (!val) return isQuote && quoteToken === 'INR' ? '₹0.00' : '0.00';
        const formatted = val.toLocaleString('en-IN', { maximumFractionDigits: isQuote ? 2 : 6 });
        return isQuote && quoteToken === 'INR' ? `₹${formatted}` : formatted;
    };

    if (error) {
        return (
            <div className="glass-card flex flex-col h-full min-h-[300px] items-center justify-center p-4 mt-2">
                <p className="text-red-400 text-sm">Unable to load account summary</p>
                <button onClick={() => setRetryCount(c => c + 1)} className="text-primary text-xs mt-2 hover:underline">Retry</button>
            </div>
        );
    }

    const isProfit = (summary?.currentRoi || 0) >= 0;

    return (
        <div className="glass-card flex flex-col mt-2 p-4">
            <h3 className="font-bold text-primary mb-4 font-heading border-b border-white/5 pb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" /> Account Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-b border-white/5 pb-3">
                    <p className="text-sm text-secondary mb-1">{baseToken} Balance</p>
                    <p className="font-mono text-sm text-primary font-bold">
                        {loading ? 'Loading...' : formatCurrency(summary?.baseBalance || 0, false)}
                    </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                    <p className="text-sm text-secondary mb-1">{quoteToken} Balance</p>
                    <p className="font-mono text-sm text-primary font-bold">
                        {loading ? 'Loading...' : formatCurrency(summary?.quoteBalance || 0, true)}
                    </p>
                </div>
            </div>

            <div className="space-y-3 mb-4 flex-1">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary text-sm">Estimated Value</span>
                    <span className="font-mono text-primary font-semibold">
                        {loading ? 'Loading...' : `~${formatCurrency(summary?.estimatedValue || 0, true)} ${quoteToken !== 'INR' ? quoteToken : ''}`}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary text-sm">Avg. Buy Price</span>
                    <span className="font-mono text-primary">
                        {loading ? 'Loading...' : `${formatCurrency(summary?.averageBuyPrice || 0, true)} ${quoteToken !== 'INR' ? quoteToken : ''}`}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary text-sm">Current ROI</span>
                    <span className={`font-mono font-bold flex items-center gap-1 ${loading ? 'text-muted' : ((summary?.averageBuyPrice === 0 || !summary?.averageBuyPrice) ? 'text-muted' : isProfit ? 'text-green-400' : 'text-red-400')}`}>
                        {loading ? 'Loading...' : (
                            <>
                                {(summary?.averageBuyPrice || 0) > 0 && (isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                                {summary?.currentRoi && summary.currentRoi > 0 ? '+' : ''}{(summary?.currentRoi || 0).toFixed(2)}%
                            </>
                        )}
                    </span>
                </div>
            </div>

            <div className="pt-4 mt-auto space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-secondary">
                        <Activity className="w-3.5 h-3.5" /> Market Status
                    </div>
                    <span className={summary?.marketStatus === 'ACTIVE' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {loading ? 'Loading...' : (summary?.marketStatus || 'UNAVAILABLE')}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-secondary">
                        <Percent className="w-3.5 h-3.5" /> Maker/Taker Fee
                    </div>
                    <span className="text-primary">
                        {loading ? 'Loading...' : `${summary?.makerFee || '0.10'}% / ${summary?.takerFee || '0.10'}%`}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-secondary">
                        <ShieldCheck className="w-3.5 h-3.5" /> Risk Meter
                    </div>
                    {loading ? (
                        <span className="text-muted">Loading...</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary">{summary?.riskLevel || 'LOW'}</span>
                            <div className="w-16 h-1.5 bg-vault-700/50 rounded-full overflow-hidden flex">
                                <div 
                                    className={`h-full ${summary?.riskLevel === 'LOW' ? 'bg-green-500' : summary?.riskLevel === 'MODERATE' ? 'bg-yellow-500' : summary?.riskLevel === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'}`} 
                                    style={{ width: `${Math.max(5, summary?.riskPercentage || 0)}%` }}>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
