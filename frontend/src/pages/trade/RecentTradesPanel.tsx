import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

interface Trade {
    id: number;
    price: string;
    amount: string;
    time: string;
    isBuyerMaker: boolean; // if true -> red (sell), if false -> green (buy)
}

export default function RecentTradesPanel() {
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol) || 'BTC_INR';
    const [trades, setTrades] = useState<Trade[]>([]);
    
    const parts = activeMarket.split('_');
    const base = parts[0] || 'BTC';
    const quote = parts[1] || 'INR';
    const streamQuote = quote === 'INR' ? 'USDT' : quote;
    const symbolStr = `${base}${streamQuote}`.toLowerCase();
    const conversionRate = quote === 'INR' ? 83.5 : 1;

    useEffect(() => {
        let ws: WebSocket;
        
        // Reset trades when symbol changes
        setTrades([]);

        const connectWs = () => {
            const url = `wss://stream.binance.com:9443/ws/${symbolStr}@trade`;
            ws = new WebSocket(url);
            
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data && data.e === 'trade') {
                        const d = new Date(data.T);
                        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
                        
                        const convertedPrice = parseFloat(data.p) * conversionRate;

                        const newTrade: Trade = {
                            id: data.t,
                            price: convertedPrice.toFixed(quote === 'INR' ? 0 : 2),
                            amount: parseFloat(data.q).toFixed(4),
                            time: timeStr,
                            isBuyerMaker: data.m
                        };

                        setTrades(prev => {
                            const updated = [newTrade, ...prev];
                            // Keep only last 50 trades
                            if (updated.length > 50) return updated.slice(0, 50);
                            return updated;
                        });
                    }
                } catch (e) {
                    console.error("Trades parse error", e);
                }
            };
        };

        connectWs();

        return () => {
            if (ws) ws.close();
        };
    }, [symbolStr]);

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden text-sm font-mono p-2">
            {/* Header */}
            <div className="pb-3 flex-shrink-0">
                <h3 className="font-semibold text-primary font-sans">Recent Trades</h3>
            </div>
            
            {/* Column Headers */}
            <div className="flex text-secondary text-xs uppercase font-semibold tracking-wider px-3 py-2 flex-shrink-0">
                <div className="w-1/3">Price</div>
                <div className="w-1/3 text-right">Amount</div>
                <div className="w-1/3 text-right">Time</div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {trades.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted font-sans">Waiting for trades...</div>
                ) : (
                    <div className="flex flex-col">
                        {trades.map(trade => (
                            <div key={trade.id} className="flex px-3 py-2 hover:bg-white/5 rounded cursor-pointer">
                                <div className={`w-1/3 ${trade.isBuyerMaker ? 'text-red-400' : 'text-green-400'}`}>
                                    {trade.price}
                                </div>
                                <div className="w-1/3 text-right text-secondary">{trade.amount}</div>
                                <div className="w-1/3 text-right text-secondary">{trade.time}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
