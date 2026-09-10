import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { setActiveMarket, updateMarketData } from '../../redux/marketSlice';
import { fetchApi } from '../../utils/api';
import { Search, Star } from 'lucide-react';

interface MarketDataDTO {
    symbol: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    volume24h: number;
}

export default function MarketListPanel() {
    const dispatch = useDispatch();
    const activeMarket = useSelector((state: RootState) => state.market.activeMarketSymbol);
    const reduxMarkets = useSelector((state: RootState) => state.market.markets);
    
    const [markets, setMarkets] = useState<MarketDataDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('INR');

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const data = await fetchApi('/api/market/top');
                setMarkets(data);
                data.forEach((m: MarketDataDTO) => {
                    dispatch(updateMarketData({
                        symbol: m.symbol,
                        price: m.currentPrice,
                        change24h: m.priceChangePercentage24h.toFixed(2) + '%',
                        volume24h: m.volume24h
                    }));
                });
            } catch (error) {
                console.error("Failed to load markets", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarkets();
    }, [dispatch]);

    const filteredMarkets = markets.filter(m => {
        const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === 'All' || m.symbol.endsWith(`_${activeTab}`) || m.symbol.endsWith(activeTab);
        return matchesSearch && matchesTab;
    });

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden">
            {/* Header & Search */}
            <div className="pb-4 flex-shrink-0">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 pl-9 pr-3 py-2 text-sm text-primary focus:outline-none focus:border-accent-primary transition-colors"
                    />
                </div>
                <div className="flex gap-2 text-sm font-semibold overflow-x-auto no-scrollbar">
                    {['All', 'INR'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 whitespace-nowrap transition-colors font-medium text-sm ${activeTab === tab ? 'text-accent-primary' : 'text-secondary hover:text-primary'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Headers */}
            <div className="flex text-xs uppercase font-semibold text-secondary tracking-wider px-3 py-2 flex-shrink-0">
                <div className="flex-[4]">Pair</div>
                <div className="w-[25%] text-right">Price</div>
                <div className="w-[20%] text-right">24H %</div>
                <div className="w-[20%] text-right">Volume</div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">Loading...</div>
                ) : (
                    <div className="flex flex-col pb-2">
                        {filteredMarkets.map(m => {
                            const liveData = reduxMarkets[m.symbol];
                            const price = liveData?.price ?? m.currentPrice;
                            const changeStr = typeof liveData?.change24h === 'string' 
                                ? liveData.change24h 
                                : (m.priceChangePercentage24h > 0 ? '+' : '') + m.priceChangePercentage24h.toFixed(2) + '%';
                            const isPositive = changeStr.startsWith('+') || parseFloat(changeStr) >= 0;
                            const isActive = activeMarket === m.symbol;
                            const displaySymbol = m.symbol.replace('_', '/');

                            const baseSymbol = m.symbol.split('_')[0].toLowerCase();
                            const logoUrl = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${baseSymbol}.svg`;
                            
                            // Format volume: if > 1M, show M. if > 1k, show K.
                            const vol = liveData?.volume24h ?? m.volume24h;
                            let volStr = vol.toFixed(0);
                            if (vol >= 1000000) volStr = (vol / 1000000).toFixed(1) + 'M';
                            else if (vol >= 1000) volStr = (vol / 1000).toFixed(1) + 'K';

                            return (
                                <div 
                                    key={m.symbol}
                                    onClick={() => dispatch(setActiveMarket(m.symbol))}
                                    className={`flex items-center text-sm px-3 py-3 cursor-pointer transition-colors hover:bg-white/5 rounded-lg ${isActive ? 'bg-white/5' : ''}`}
                                >
                                    <div className="flex-[4] flex items-center gap-1.5">
                                        <Star size={12} className="text-gray-600 hover:text-yellow-500 flex-shrink-0" />
                                        <img src={logoUrl} alt={baseSymbol} className="w-4 h-4 rounded-full bg-black/20" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        <span className="font-bold text-primary truncate text-sm">{displaySymbol}</span>
                                    </div>
                                    <div className="w-[25%] text-right font-mono text-secondary truncate text-sm">
                                        {price < 10 ? price.toFixed(4) : price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </div>
                                    <div className={`w-[20%] text-right font-mono truncate text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {changeStr}
                                    </div>
                                    <div className="w-[20%] text-right font-mono text-muted truncate text-sm">
                                        {volStr}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
