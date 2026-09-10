import React, { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { fetchApi } from '../utils/api';

interface P2pAd {
    id: string;
    tokenSymbol: string;
    fiatCurrency: string;
    type: 'BUY' | 'SELL';
    price: number;
    availableQuantity: number;
    minLimit: number;
    maxLimit: number;
    paymentMethods: string;
    isActive: boolean;
    user: {
        email: string;
    };
}

export default function P2pMarket() {
    const [ads, setAds] = useState<P2pAd[]>([]);
    const [side, setSide] = useState<'BUY' | 'SELL'>('SELL'); // When you click "Buy" tab, you want to see "SELL" ads from others.
    const [fiat, setFiat] = useState('INR');
    const [token, setToken] = useState('USDT');
    const [loading, setLoading] = useState(true);

    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<P2pAd | null>(null);
    const [fiatAmount, setFiatAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const loadAds = async () => {
        setLoading(true);
        try {
            // When user wants to Buy, they look for SELL ads from others
            const searchSide = side === 'BUY' ? 'BUY' : 'SELL';
            const data = await fetchApi(`/api/p2p/ads?type=${searchSide}&fiatCurrency=${fiat}`);
            // Simple filter for token
            const filtered = data.filter((a: P2pAd) => a.tokenSymbol === token && a.isActive);
            setAds(filtered);
        } catch (error) {
            console.error("Failed to load ads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAds();
    }, [side, fiat, token]);

    const handleOpenBuy = (ad: P2pAd) => {
        setSelectedAd(ad);
        setBuyModalOpen(true);
        setFiatAmount('');
        setPaymentMethod(ad.paymentMethods.split(',')[0]);
        setMsg('');
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAd) return;
        
        setOrderLoading(true);
        setMsg('');
        try {
            await fetchApi('/api/p2p/orders', {
                method: 'POST',
                body: JSON.stringify({
                    adId: selectedAd.id,
                    fiatAmount: parseFloat(fiatAmount),
                    paymentMethod: paymentMethod
                })
            });
            setMsg('Order placed successfully! Check your orders.');
            setTimeout(() => {
                setBuyModalOpen(false);
                loadAds();
            }, 2000);
        } catch (err: any) {
            setMsg(err.message || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading text-primary">P2P Trading</h1>
                <button className="bg-primary/20 text-primary px-6 py-2 rounded-lg font-bold hover:bg-primary/30 transition-colors">
                    Post New Ad
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setSide('SELL')} 
                    className={`pb-2 font-bold px-4 border-b-2 transition-colors ${side === 'SELL' ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary'}`}
                >
                    Buy
                </button>
                <button 
                    onClick={() => setSide('BUY')} 
                    className={`pb-2 font-bold px-4 border-b-2 transition-colors ${side === 'BUY' ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary'}`}
                >
                    Sell
                </button>
                
                <div className="ml-auto flex gap-4">
                    <select value={token} onChange={(e) => setToken(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none">
                        <option value="USDT">USDT</option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                    </select>
                    <select value={fiat} onChange={(e) => setFiat(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                    <select className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none">
                        <option>All Payments</option>
                    </select>
                </div>
            </div>

            <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 font-semibold text-secondary">Advertiser</th>
                            <th className="p-4 font-semibold text-secondary">Price</th>
                            <th className="p-4 font-semibold text-secondary">Limit / Available</th>
                            <th className="p-4 font-semibold text-secondary">Payment</th>
                            <th className="p-4 font-semibold text-secondary text-right">Trade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-secondary">Loading ads...</td></tr>
                        ) : ads.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-secondary">No ads found.</td></tr>
                        ) : (
                            ads.map(ad => (
                                <tr key={ad.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold">
                                                {ad.user.email.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1 font-bold">
                                                    {ad.user.email.split('@')[0]} <ShieldCheck size={14} className="text-blue-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xl font-bold font-mono">{fiat === 'INR' ? '₹' : '$'}{ad.price.toFixed(2)}</span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="text-secondary">
                                            Available: <span className="text-primary font-mono">{ad.availableQuantity.toFixed(2)} {ad.tokenSymbol}</span>
                                        </div>
                                        <div className="text-secondary">
                                            Limit: <span className="text-primary font-mono">{fiat === 'INR' ? '₹' : '$'}{ad.minLimit} - {fiat === 'INR' ? '₹' : '$'}{ad.maxLimit}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {ad.paymentMethods.split(',').map(m => (
                                                <span key={m} className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-bold">{m.trim()}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleOpenBuy(ad)}
                                            className={`px-6 py-2 rounded-lg font-bold transition-all ${side === 'SELL' ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-primary' : 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-primary'}`}
                                        >
                                            {side === 'SELL' ? `Buy ${ad.tokenSymbol}` : `Sell ${ad.tokenSymbol}`}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {buyModalOpen && selectedAd && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-vault-800 border border-vault-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setBuyModalOpen(false)} className="absolute top-4 right-4 text-secondary hover:text-primary">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold mb-4">{side === 'SELL' ? 'Buy' : 'Sell'} {selectedAd.tokenSymbol}</h3>
                        
                        <div className="bg-black/30 rounded-lg p-4 mb-6 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-secondary">Price</span>
                                <span className="font-mono">{fiat === 'INR' ? '₹' : '$'}{selectedAd.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">Limit</span>
                                <span className="font-mono">{fiat === 'INR' ? '₹' : '$'}{selectedAd.minLimit} - {fiat === 'INR' ? '₹' : '$'}{selectedAd.maxLimit}</span>
                            </div>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm text-secondary mb-2">I will pay ({fiat})</label>
                                <input 
                                    type="number"
                                    required
                                    min={selectedAd.minLimit}
                                    max={selectedAd.maxLimit}
                                    value={fiatAmount}
                                    onChange={(e) => setFiatAmount(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none focus:border-primary"
                                    placeholder={`Enter amount in ${fiat}`}
                                />
                                <div className="text-right text-xs text-secondary mt-1">
                                    You will receive ≈ {fiatAmount ? (parseFloat(fiatAmount) / selectedAd.price).toFixed(6) : '0.00'} {selectedAd.tokenSymbol}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-secondary mb-2">Payment Method</label>
                                <select 
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-primary outline-none focus:border-primary"
                                >
                                    {selectedAd.paymentMethods.split(',').map(m => (
                                        <option key={m} value={m.trim()}>{m.trim()}</option>
                                    ))}
                                </select>
                            </div>

                            {msg && <div className={`text-sm text-center ${msg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{msg}</div>}

                            <button type="submit" disabled={orderLoading} className="w-full py-3 rounded-lg font-bold text-primary bg-primary hover:bg-primary/90 transition-colors">
                                {orderLoading ? 'Processing...' : (side === 'SELL' ? 'Confirm Buy' : 'Confirm Sell')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
