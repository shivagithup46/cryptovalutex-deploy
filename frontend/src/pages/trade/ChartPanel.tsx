import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

export default function ChartPanel() {
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol) || 'BTC_INR';
    
    // Parse symbol parts
    const parts = activeMarket.split('_');
    const base = parts[0] || 'BTC';
    const quote = parts[1] || 'USDT';
    
    // TradingView (Binance) rarely supports INR pairs. Fallback to USDT chart to prevent "Invalid Symbol".
    const chartQuote = quote === 'INR' ? 'USDT' : quote;
    const tvSymbol = `BINANCE:${base}${chartQuote}`;

    return (
        <div className="glass-card flex-1 w-full h-full overflow-hidden relative">
            <AdvancedRealTimeChart 
                symbol={tvSymbol}
                theme="dark"
                autosize
                allow_symbol_change={false}
                save_image={false}
                hide_top_toolbar={false}
                hide_legend={false}
                enable_publishing={false}
                backgroundColor="#0b1830"
                toolbar_bg="#0b1830"
                studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies"]}
                style="1" // Candlestick
            />
        </div>
    );
}
