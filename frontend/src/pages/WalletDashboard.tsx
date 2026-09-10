import React, { useEffect, useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, CreditCard, Banknote, IndianRupee, Activity } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface TokenData {
    symbol: string;
    name: string;
    currentPrice: number;
}

interface WalletData {
    id: string;
    balance: number;
    lockedBalance: number;
    averageBuyPrice?: number;
    token: TokenData;
}



export default function WalletDashboard() {
    const [wallets, setWallets] = useState<WalletData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'trade'>('overview');
    
    // Trade state
    const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
    const [tradeSymbol, setTradeSymbol] = useState('BTC');
    const [tradeQuantity, setTradeQuantity] = useState('');
    
    // Deposit/Withdraw state
    const [fiatAmount, setFiatAmount] = useState('');
    
    const [actionMsg, setActionMsg] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    const { user } = useAuth();
    const privacy = user?.privacy;

    const fetchData = async () => {
        try {
            const [walletsData] = await Promise.all([
                fetchApi('/api/wallet'),
                fetchApi('/api/wallet/transactions')
            ]);
            setWallets(walletsData);
        } catch (error) {
            console.error("Failed to load wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        const handleRefresh = () => fetchData();
        window.addEventListener('refreshWallet', handleRefresh);
        return () => window.removeEventListener('refreshWallet', handleRefresh);
    }, []);

    const inrWallet = wallets.find(w => w.token?.symbol === 'INR');
    const inrBalance = inrWallet ? inrWallet.balance : 0;
    const cryptoWallets = wallets.filter(w => w.token?.symbol !== 'INR' && w.balance > 0);
    
    const totalPortfolioValue = inrBalance + cryptoWallets.reduce((sum, w) => sum + (w.balance * (w.token?.currentPrice || 0)), 0);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setActionMsg('');
        try {
            await fetchApi('/api/wallet/deposit', {
                method: 'POST',
                body: JSON.stringify({
                    symbol: 'INR',
                    amount: parseFloat(fiatAmount),
                    method: 'UPI'
                })
            });
            setActionMsg('Deposit successful!');
            setFiatAmount('');
            fetchData();
        } catch (err: any) {
            setActionMsg(err.message || 'Deposit failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setActionMsg('');
        try {
            await fetchApi('/api/wallet/withdraw', {
                method: 'POST',
                body: JSON.stringify({
                    symbol: 'INR',
                    amount: parseFloat(fiatAmount),
                    toAddress: 'BANK_ACC_DEMO'
                })
            });
            setActionMsg('Withdrawal successful!');
            setFiatAmount('');
            fetchData();
        } catch (err: any) {
            setActionMsg(err.message || 'Withdrawal failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleTrade = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setActionMsg('');
        try {
            const endpoint = tradeAction === 'buy' ? '/api/wallet/buy' : '/api/wallet/sell';
            await fetchApi(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    symbol: tradeSymbol,
                    quantity: parseFloat(tradeQuantity)
                })
            });
            setActionMsg(`${tradeAction === 'buy' ? 'Buy' : 'Sell'} order successful!`);
            setTradeQuantity('');
            fetchData();
        } catch (err: any) {
            setActionMsg(err.message || 'Trade failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="text-primary text-center py-20 flex justify-center"><Activity className="animate-spin text-primary" size={48} /></div>;
    }

    const availableTokens = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'MATIC', 'LINK', 'AVAX'];
    const selectedTokenData = wallets.find(w => w.token?.symbol === tradeSymbol)?.token || { currentPrice: 8400000 }; // fallback mock price

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold font-heading text-primary mb-2">Enterprise Wallet</h1>
                    <p className="text-secondary">Manage your fiat and cryptocurrency portfolio</p>
                </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex space-x-2 overflow-x-auto border-b border-vault-700/50 pb-2 scrollbar-hide">
                {['overview', 'deposit', 'withdraw', 'trade'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab as any); setActionMsg(''); }}
                        className={`px-6 py-3 rounded-t-xl font-medium capitalize transition-all ${activeTab === tab ? 'bg-vault-800 text-primary border-t-2 border-accent-neonBlue' : 'text-secondary hover:text-primary hover:bg-vault-800/50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glassmorphism rounded-2xl p-6 border border-white/10 relative overflow-hidden group col-span-1 md:col-span-2 bg-gradient-to-br from-vault-800 to-vault-900">
                            <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-accent-neonBlue/20 transition-all duration-500"></div>

                            <div className="flex gap-6">
                                <div>
                                    <p className="text-muted text-sm">Available INR</p>
                                    <p className="text-2xl font-bold text-accent-electricCyan">
                                        {privacy?.hideWalletBalance ? '₹***' : `₹${inrBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted text-sm">Total Profit</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        {privacy?.hideTotalProfit ? '***' : '+₹0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glassmorphism rounded-2xl p-6 border border-white/10 flex flex-col justify-center gap-4">
                            <button onClick={() => setActiveTab('deposit')} className="btn-primary w-full py-4 flex justify-center items-center gap-2">
                                <ArrowDownRight size={20} /> Deposit INR
                            </button>
                            <button onClick={() => setActiveTab('withdraw')} className="w-full py-4 bg-vault-700 hover:bg-vault-600 text-primary rounded-xl transition-all font-bold flex justify-center items-center gap-2">
                                <ArrowUpRight size={20} /> Withdraw
                            </button>
                            <button onClick={() => setActiveTab('trade')} className="w-full py-4 bg-gradient-to-r from-accent-purple to-accent-neonBlue text-primary rounded-xl transition-all font-bold flex justify-center items-center gap-2 hover:opacity-90">
                                <RefreshCcw size={20} /> Trade Crypto
                            </button>
                        </div>
                    </div>

                    <div className="glassmorphism rounded-2xl p-6 border border-white/10">
                        <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2"><Wallet className="text-primary" /> Crypto Holdings</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-secondary border-b border-vault-700/50">
                                        <th className="pb-4 font-medium">Asset</th>
                                        <th className="pb-4 font-medium">Quantity</th>
                                        <th className="pb-4 font-medium">Buy Price</th>
                                        <th className="pb-4 font-medium">Current Price</th>
                                        <th className="pb-4 font-medium text-right">Current Value</th>
                                        <th className="pb-4 font-medium text-right">Profit/Loss</th>
                                        <th className="pb-4 font-medium text-right">Allocation %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cryptoWallets.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-8 text-muted">No crypto holdings yet. Go trade!</td></tr>
                                    )}
                                    {cryptoWallets.map(w => {
                                        const currentValue = w.balance * w.token.currentPrice;
                                        const buyValue = w.balance * (w.averageBuyPrice || 0);
                                        const profitLoss = currentValue - buyValue;
                                        const profitLossPct = buyValue > 0 ? (profitLoss / buyValue) * 100 : 0;
                                        const allocation = totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0;
                                        
                                        return (
                                        <tr key={w.id} className="border-b border-vault-700/30 hover:bg-vault-800/30 transition-colors">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-vault-700 flex items-center justify-center font-bold text-primary">{w.token.symbol[0]}</div>
                                                <div>
                                                    <p className="font-bold text-primary">{w.token.symbol}</p>
                                                    <p className="text-xs text-secondary">{w.token.name}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 font-mono text-secondary">
                                                {privacy?.hideWalletBalance ? '***' : w.balance}
                                            </td>
                                            <td className="py-4 font-mono text-secondary">₹{w.averageBuyPrice?.toLocaleString('en-IN', {maximumFractionDigits: 2}) || '0.00'}</td>
                                            <td className="py-4 font-mono text-secondary">₹{w.token.currentPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                                            <td className="py-4 text-right font-mono font-bold text-primary">
                                                {privacy?.hideWalletBalance ? '₹***' : `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            </td>
                                            <td className={`py-4 text-right font-mono font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-accent-pink'}`}>
                                                {privacy?.hideTotalProfit ? '***' : (
                                                    <>{profitLoss >= 0 ? '+' : ''}₹{profitLoss.toLocaleString('en-IN', {maximumFractionDigits: 2})} ({profitLoss >= 0 ? '+' : ''}{profitLossPct.toFixed(2)}%)</>
                                                )}
                                            </td>
                                            <td className="py-4 text-right font-mono text-secondary">{allocation.toFixed(2)}%</td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DEPOSIT */}
            {activeTab === 'deposit' && (
                <div className="max-w-xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><ArrowDownRight className="text-green-400"/> Deposit INR</h2>
                    <form onSubmit={handleDeposit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-secondary mb-2">Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                                <input 
                                    type="number" 
                                    required 
                                    min="100"
                                    value={fiatAmount}
                                    onChange={(e) => setFiatAmount(e.target.value)}
                                    className="glass-input w-full pl-12 text-xl font-mono" 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-secondary mb-2">Payment Method (Demo)</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-accent-neonBlue bg-primary/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                                    <Activity className="text-primary"/> <span className="font-bold text-primary">UPI</span>
                                </div>
                                <div className="border border-vault-600 bg-vault-800 rounded-xl p-4 flex items-center gap-3 cursor-pointer opacity-50">
                                    <Banknote className="text-secondary"/> <span className="font-bold text-secondary">Net Banking</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={actionLoading} className="btn-primary w-full py-4 text-lg">
                            {actionLoading ? 'Processing...' : 'Deposit Funds'}
                        </button>
                        {actionMsg && <div className={`p-4 rounded-lg text-center ${actionMsg.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-accent-pink/20 text-accent-pink'}`}>{actionMsg}</div>}
                    </form>
                </div>
            )}

            {/* TAB CONTENT: WITHDRAW */}
            {activeTab === 'withdraw' && (
                <div className="max-w-xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><ArrowUpRight className="text-accent-pink"/> Withdraw INR</h2>
                    <p className="text-sm text-secondary mb-6">Available Balance: <span className="font-bold text-primary">₹{inrBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></p>
                    <form onSubmit={handleWithdraw} className="space-y-6">
                        <div>
                            <label className="block text-sm text-secondary mb-2">Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                                <input 
                                    type="number" 
                                    required 
                                    min="100"
                                    max={inrBalance}
                                    value={fiatAmount}
                                    onChange={(e) => setFiatAmount(e.target.value)}
                                    className="glass-input w-full pl-12 text-xl font-mono" 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-secondary mb-2">Withdraw To</label>
                            <div className="border border-vault-600 bg-vault-800 rounded-xl p-4 flex items-center gap-3">
                                <CreditCard className="text-primary"/> 
                                <div>
                                    <span className="font-bold text-primary block">Saved Bank Account</span>
                                    <span className="text-xs text-muted">HDFC Bank **** 1234</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={actionLoading || inrBalance <= 0} className="w-full py-4 bg-accent-pink hover:bg-pink-600 text-primary rounded-xl font-bold text-lg transition-colors">
                            {actionLoading ? 'Processing...' : 'Withdraw Funds'}
                        </button>
                        {actionMsg && <div className={`p-4 rounded-lg text-center ${actionMsg.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-accent-pink/20 text-accent-pink'}`}>{actionMsg}</div>}
                    </form>
                </div>
            )}

            {/* TAB CONTENT: TRADE */}
            {activeTab === 'trade' && (
                <div className="max-w-2xl mx-auto glassmorphism rounded-2xl p-8 border border-white/10">
                    <div className="flex bg-vault-800 rounded-xl p-1 mb-8">
                        <button onClick={() => {setTradeAction('buy'); setActionMsg('');}} className={`flex-1 py-3 rounded-lg font-bold transition-all ${tradeAction === 'buy' ? 'bg-green-500/20 text-green-400' : 'text-secondary hover:text-primary'}`}>Buy</button>
                        <button onClick={() => {setTradeAction('sell'); setActionMsg('');}} className={`flex-1 py-3 rounded-lg font-bold transition-all ${tradeAction === 'sell' ? 'bg-accent-pink/20 text-accent-pink' : 'text-secondary hover:text-primary'}`}>Sell</button>
                    </div>

                    <form onSubmit={handleTrade} className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-secondary mb-2">Coin</label>
                                <select 
                                    value={tradeSymbol} 
                                    onChange={(e) => setTradeSymbol(e.target.value)}
                                    className="glass-input w-full font-bold"
                                >
                                    {availableTokens.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex-2 w-2/3">
                                <label className="block text-sm text-secondary mb-2">Quantity</label>
                                <input 
                                    type="number" 
                                    step="0.000001"
                                    required 
                                    value={tradeQuantity}
                                    onChange={(e) => setTradeQuantity(e.target.value)}
                                    className="glass-input w-full font-mono" 
                                    placeholder="0.00" 
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-vault-800/50 rounded-xl border border-vault-700 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Current Market Price</span>
                                <span className="font-mono text-primary">₹{selectedTokenData?.currentPrice?.toLocaleString('en-IN') || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Estimated Total (INR)</span>
                                <span className="font-mono font-bold text-primary">
                                    ₹{((parseFloat(tradeQuantity) || 0) * (selectedTokenData?.currentPrice || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>

                        {tradeAction === 'buy' ? (
                            <button type="submit" disabled={actionLoading} className="w-full py-4 bg-green-500 hover:bg-green-600 text-primary rounded-xl font-bold text-lg transition-colors">
                                {actionLoading ? 'Processing...' : `Buy ${tradeSymbol}`}
                            </button>
                        ) : (
                            <button type="submit" disabled={actionLoading} className="w-full py-4 bg-accent-pink hover:bg-pink-600 text-primary rounded-xl font-bold text-lg transition-colors">
                                {actionLoading ? 'Processing...' : `Sell ${tradeSymbol}`}
                            </button>
                        )}
                        {actionMsg && <div className={`p-4 rounded-lg text-center ${actionMsg.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-accent-pink/20 text-accent-pink'}`}>{actionMsg}</div>}
                    </form>
                </div>
            )}

        </div>
    );
}
