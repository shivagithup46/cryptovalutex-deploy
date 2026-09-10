import { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

export default function TradingFormPanel() {
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol) || 'BTC/USDT';
    const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', isError: false });

    const parts = activeMarket.includes('_') ? activeMarket.split('_') : activeMarket.split('/');
    const baseToken = parts[0] || 'BTC';
    const quoteToken = parts[1] || 'USDT';
    
    const [availableBase, setAvailableBase] = useState(0);
    const [availableQuote, setAvailableQuote] = useState(0);

    useEffect(() => {
        const loadWallets = async () => {
            try {
                const data = await fetchApi('/api/wallet');
                const baseW = data.find((w: any) => w.token?.symbol === baseToken);
                const quoteW = data.find((w: any) => w.token?.symbol === quoteToken);
                setAvailableBase(baseW ? baseW.balance : 0);
                setAvailableQuote(quoteW ? quoteW.balance : 0);
            } catch (e) {
                console.error("Failed to load balances", e);
            }
        };
        loadWallets();
        const interval = setInterval(loadWallets, 5000);
        return () => clearInterval(interval);
    }, [baseToken, quoteToken]);
    
    const marketData = useSelector((state: RootState) => state.market.markets[activeMarket]);
    const currentPrice = marketData ? marketData.price : 65000;

    const parsedPrice = orderType === 'MARKET' ? currentPrice : parseFloat(price || currentPrice.toString());
    const parsedQty = parseFloat(quantity || '0');
    const totalCost = parsedPrice * parsedQty;

    const handlePercent = (pct: number) => {
        if (orderSide === 'BUY') {
            if (parsedPrice > 0) {
                setQuantity(((availableQuote * (pct / 100)) / parsedPrice).toFixed(6));
            }
        } else {
            setQuantity((availableBase * (pct / 100)).toFixed(6));
        }
    };

    const handleSubmit = async () => {
        if (!parsedQty || parsedQty <= 0) {
            setMsg({ text: 'Please enter a valid quantity', isError: true });
            return;
        }

        setLoading(true);
        setMsg({ text: '', isError: false });

        try {
            const endpoint = orderSide === 'BUY' ? '/api/wallet/buy' : '/api/wallet/sell';

            await fetchApi(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    symbol: baseToken,
                    quantity: parsedQty
                })
            });

            // Dispatch event to trigger refresh in other components
            window.dispatchEvent(new CustomEvent('trade-executed'));

            const formattedCost = quoteToken === 'INR' ? '₹' + totalCost.toLocaleString('en-IN') : totalCost.toLocaleString() + ' ' + quoteToken;
            setMsg({ text: `✓ ${baseToken} ${orderSide === 'BUY' ? 'Buy' : 'Sell'} Successful — ${parsedQty} ${baseToken} for ${formattedCost}`, isError: false });
            setQuantity('');
            
            setTimeout(() => {
                setMsg({ text: '', isError: false });
            }, 5000);

        } catch (error: any) {
            setMsg({ text: error.message || 'Transaction failed', isError: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card flex flex-col relative h-full p-4">
            <div className="flex flex-col relative">
                {/* Action Segmented Control */}
                <div className="flex gap-6 mb-6 border-b border-white/5 pb-2">
                    <button 
                        onClick={() => setOrderSide('BUY')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wide transition-all ${orderSide === 'BUY' ? 'text-green-400 border-b-2 border-green-400' : 'text-secondary hover:text-primary border-b-2 border-transparent'}`}
                    >
                        Buy {baseToken}
                    </button>
                    <button 
                        onClick={() => setOrderSide('SELL')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wide transition-all ${orderSide === 'SELL' ? 'text-red-400 border-b-2 border-red-400' : 'text-secondary hover:text-primary border-b-2 border-transparent'}`}
                    >
                        Sell {baseToken}
                    </button>
                </div>

                {/* Order Types */}
                <div className="flex gap-4 mb-6">
                    {['LIMIT', 'MARKET'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setOrderType(type as any)}
                            className={`transition-all font-medium text-sm ${orderType === type ? 'text-accent-primary' : 'text-muted hover:text-secondary'}`}
                        >
                            {type.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-sm text-secondary mb-1 block">Price ({quoteToken})</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={orderType === 'MARKET' && currentPrice > 0 ? currentPrice : price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder={currentPrice.toString()}
                                className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-primary font-mono text-sm focus:outline-none focus:border-accent-primary transition-colors disabled:opacity-50" 
                                disabled={orderType === 'MARKET' || loading}
                            />
                            {orderType === 'MARKET' && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted font-semibold">MARKET</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-secondary mb-1 block">Amount ({baseToken})</label>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Amount"
                            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-primary font-mono text-sm focus:outline-none focus:border-accent-primary transition-colors" 
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Percentages */}
                <div className="flex gap-2 mb-6">
                    {[25, 50, 75, 100].map(pct => (
                        <button 
                            key={pct}
                            onClick={(e) => { e.preventDefault(); handlePercent(pct); }}
                            className="flex-1 py-1 text-xs rounded hover:bg-white/5 text-secondary hover:text-primary transition-colors font-mono"
                        >
                            {pct}%
                        </button>
                    ))}
                </div>

                {/* Summary */}
                <div className="mb-6 space-y-2 py-3 border-y border-white/5">
                    <div className="flex justify-between text-xs text-muted">
                        <span>Avail</span>
                        <span className="font-mono text-secondary">
                            {orderSide === 'BUY' ? availableQuote.toLocaleString() : availableBase.toLocaleString()} {orderSide === 'BUY' ? quoteToken : baseToken}
                        </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-secondary font-mono">
                        <span>Order Value</span>
                        <span className="text-primary">{quoteToken === 'INR' ? '₹' : ''}{totalCost > 0 ? totalCost.toLocaleString('en-IN', {maximumFractionDigits: 4}) : '0.00'} {quoteToken !== 'INR' && quoteToken}</span>
                    </div>
                    <div className="flex justify-between text-sm text-secondary font-mono">
                        <span>Est. Fee (0.10%)</span>
                        <span className="text-primary">{quoteToken === 'INR' ? '₹' : ''}{(totalCost * 0.001).toLocaleString('en-IN', {maximumFractionDigits: 4}) } {quoteToken !== 'INR' && quoteToken}</span>
                    </div>
                    <div className="flex justify-between text-sm text-secondary font-mono font-bold mt-2 pt-2 border-t border-white/5">
                        <span>Total Est.</span>
                        <span className={orderSide === 'BUY' ? 'text-green-400' : 'text-red-400'}>
                            {quoteToken === 'INR' ? '₹' : ''}{orderSide === 'BUY' 
                                ? (totalCost + (totalCost * 0.001)).toLocaleString('en-IN', {maximumFractionDigits: 4}) 
                                : (totalCost - (totalCost * 0.001)).toLocaleString('en-IN', {maximumFractionDigits: 4})} {quoteToken !== 'INR' && quoteToken}
                        </span>
                    </div>
                </div>

                {msg.text && (
                    <div className={`text-sm text-center mb-4 p-2 rounded bg-black/30 border ${msg.isError ? 'text-red-400 border-red-500/20' : 'text-green-400 border-green-500/20'}`}>
                        {msg.text}
                    </div>
                )}
            </div>

            <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-primary transition-all mt-auto disabled:opacity-50 ${orderSide === 'BUY' ? 'bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
            >
                {orderSide === 'BUY' ? 'Buy' : 'Sell'} {baseToken}
            </button>
        </div>
    );
}
