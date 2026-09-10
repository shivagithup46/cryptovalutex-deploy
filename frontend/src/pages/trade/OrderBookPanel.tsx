import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

interface OrderBookEntry {
    price: string;
    amount: string;
    total: number;
}

export default function OrderBookPanel() {
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol) || 'BTC_INR';
    const [bids, setBids] = useState<OrderBookEntry[]>([]);
    const [asks, setAsks] = useState<OrderBookEntry[]>([]);
    
    // Parse symbol parts
    const parts = activeMarket.split('_');
    const base = parts[0] || 'BTC';
    const quote = parts[1] || 'USDT';
    
    // Binance stream only has USDT/BTC pairs mostly
    const streamQuote = quote === 'INR' ? 'USDT' : quote;
    const symbolStr = `${base}${streamQuote}`.toLowerCase();
    
    // Fallback static conversion rate for visual purposes. Real calculation is on backend.
    const conversionRate = quote === 'INR' ? 83.5 : 1;

    useEffect(() => {
        let ws: WebSocket;
        
        const connectWs = () => {
            const url = `wss://stream.binance.com:9443/ws/${symbolStr}@depth20@100ms`;
            ws = new WebSocket(url);
            
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data && data.bids && data.asks) {
                        let currentBidTotal = 0;
                        const formattedBids = data.bids.slice(0, 15).map((b: string[]) => {
                            const amount = parseFloat(b[1]);
                            currentBidTotal += amount;
                            const convertedPrice = parseFloat(b[0]) * conversionRate;
                            return { price: convertedPrice.toFixed(quote === 'INR' ? 0 : 2), amount: amount.toFixed(4), total: currentBidTotal };
                        });

                        let currentAskTotal = 0;
                        const formattedAsks = data.asks.slice(0, 15).map((a: string[]) => {
                            const amount = parseFloat(a[1]);
                            currentAskTotal += amount;
                            const convertedPrice = parseFloat(a[0]) * conversionRate;
                            return { price: convertedPrice.toFixed(quote === 'INR' ? 0 : 2), amount: amount.toFixed(4), total: currentAskTotal };
                        });
                        
                        // Asks should be ordered descending (highest price at top, lowest price at bottom right above spread)
                        // Actually, Binance returns asks ascending. We want to show lowest ask at the bottom.
                        setAsks(formattedAsks.reverse());
                        setBids(formattedBids);
                    }
                } catch (e) {
                    console.error("Orderbook parse error", e);
                }
            };
        };

        connectWs();

        return () => {
            if (ws) ws.close();
        };
    }, [symbolStr]);

    const currentPrice = bids.length > 0 ? bids[0].price : '---';

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden text-sm font-mono p-2">
            {/* Header */}
            <div className="pb-3 flex-shrink-0">
                <h3 className="font-semibold text-primary font-sans">Order Book</h3>
            </div>
            {/* Column Headers */}
            <div className="flex text-secondary text-xs uppercase font-semibold tracking-wider px-3 py-2 flex-shrink-0">
                <div className="w-1/3">Price</div>
                <div className="w-1/3 text-right">Amount</div>
                <div className="w-1/3 text-right">Total</div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Asks (Red) */}
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-end">
                    {asks.map((ask, index) => (
                        <div key={`ask-${index}`} className="flex px-3 py-0.5 hover:bg-white/5 relative group cursor-pointer">
                            {/* Depth bar visual */}
                            <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min(100, (ask.total / (asks[0]?.total || 1)) * 100)}%` }}></div>
                            <div className="w-1/3 text-red-400 relative z-10">{ask.price}</div>
                            <div className="w-1/3 text-right text-secondary relative z-10">{ask.amount}</div>
                            <div className="w-1/3 text-right text-secondary relative z-10">{ask.total.toFixed(4)}</div>
                        </div>
                    ))}
                </div>

                {/* Current Price Divider */}
                <div className="py-3 px-3 flex items-center justify-between flex-shrink-0">
                    <span className="text-lg font-bold text-green-400">{currentPrice}</span>
                    <span className="text-muted font-sans cursor-pointer hover:text-primary">More</span>
                </div>

                {/* Bids (Green) */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {bids.map((bid, index) => (
                        <div key={`bid-${index}`} className="flex px-3 py-0.5 hover:bg-white/5 relative group cursor-pointer">
                            <div className="absolute right-0 top-0 bottom-0 bg-green-500/10" style={{ width: `${Math.min(100, (bid.total / (bids[bids.length-1]?.total || 1)) * 100)}%` }}></div>
                            <div className="w-1/3 text-green-400 relative z-10">{bid.price}</div>
                            <div className="w-1/3 text-right text-secondary relative z-10">{bid.amount}</div>
                            <div className="w-1/3 text-right text-secondary relative z-10">{bid.total.toFixed(4)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
