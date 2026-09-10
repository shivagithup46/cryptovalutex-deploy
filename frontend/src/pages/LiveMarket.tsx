import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { updateMarketData, setActiveMarket, setWatchlist, toggleWatchlistItem } from '../redux/marketSlice';
import { 
    TrendingUp, TrendingDown, Star, Search, RefreshCw, ArrowUpDown, X, ActivitySquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';

interface MarketDataDTO {
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    volume24h: number;
    marketCap: number;
    high24h: number;
    low24h: number;
    name: string;
    image: string;
    circulatingSupply: number;
    totalSupply: number;
}

interface AnalyticsDTO {
    totalMarketCapUsd: number;
    totalVolume24hUsd: number;
    btcDominancePercentage: number;
    fearAndGreedIndex: number;
    fearAndGreedClassification: string;
}

export default function LiveMarket() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [markets, setMarkets] = useState<MarketDataDTO[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc'|'desc' }>({ key: 'volume24h', direction: 'desc' });
    const [selectedCoin, setSelectedCoin] = useState<MarketDataDTO | null>(null);

    const reduxMarkets = useSelector((state: RootState) => state.market.markets);
    const watchlist = useSelector((state: RootState) => state.market.watchlist) || [];

    const tabs = ['All', 'Top Gainers', 'Top Losers'];

    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        try {
            const [marketsData, analyticsData, watchlistData] = await Promise.all([
                fetchApi('/api/exchange/markets'),
                fetchApi('/api/exchange/analytics').catch(() => null),
                fetchApi('/api/watchlist').catch(() => []) // Catch if not logged in
            ]);

            setMarkets(marketsData);
            if (analyticsData) setAnalytics(analyticsData);
            dispatch(setWatchlist(watchlistData));
            setLastUpdated(new Date());

            // Init Redux
            marketsData.forEach((m: MarketDataDTO) => {
                dispatch(updateMarketData({
                    symbol: m.symbol,
                    price: m.currentPrice,
                    change24h: (m.priceChangePercentage24h > 0 ? '+' : '') + m.priceChangePercentage24h.toFixed(2) + '%',
                    volume24h: m.volume24h,
                    high24h: m.high24h,
                    low24h: m.low24h
                }));
            });
        } catch (error) {
            console.error("Failed to fetch exchange data", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 10000);
        return () => clearInterval(interval);
    }, []);

    const toggleFavorite = async (symbol: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const isFav = watchlist.includes(symbol);
        try {
            if (isFav) {
                await fetchApi(`/api/watchlist/${symbol}`, { method: 'DELETE' });
            } else {
                await fetchApi(`/api/watchlist/${symbol}`, { method: 'POST' });
            }
            dispatch(toggleWatchlistItem(symbol));
        } catch (error) {
            console.error("Failed to update watchlist", error);
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const handleTrade = (symbol: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setActiveMarket(symbol));
        navigate('/trade');
    };

    const formatCurrency = (val: number, isBtc = false) => {
        if (val == null) return '0.00';
        if (isBtc) return val.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 8 });
        if (val < 0.01) return val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
        return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatNumber = (val: number) => {
        if (!val) return '0';
        if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
        if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
        if (val >= 1e3) return (val / 1e3).toFixed(2) + 'K';
        return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const filteredAndSortedMarkets = useMemo(() => {
        let result = [...markets];

        // Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(m => m.symbol.toLowerCase().includes(lower) || m.name?.toLowerCase().includes(lower));
        }

        // Tabs
        switch (activeTab) {
            case 'BTC': result = result.filter(m => m.symbol.endsWith('_BTC')); break;
            case 'Top Gainers': result = result.filter(m => m.priceChangePercentage24h > 0).sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h); break;
            case 'Top Losers': result = result.filter(m => m.priceChangePercentage24h < 0).sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h); break;
        }

        // Sort
        result.sort((a, b) => {
            let aVal: any = a[sortConfig.key as keyof MarketDataDTO];
            let bVal: any = b[sortConfig.key as keyof MarketDataDTO];
            
            // Apply live redux price if sorting by price
            if (sortConfig.key === 'currentPrice') {
                aVal = reduxMarkets[a.symbol]?.price ?? aVal;
                bVal = reduxMarkets[b.symbol]?.price ?? bVal;
            }

            if (aVal == null) aVal = 0;
            if (bVal == null) bVal = 0;

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [markets, searchTerm, activeTab, sortConfig, watchlist, reduxMarkets]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin text-primary"><RefreshCw size={32} /></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in relative pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary flex items-center gap-3">
                        Exchange
                        <div className="flex items-center gap-2 text-sm font-normal bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live Crypto Markets
                        </div>
                    </h1>
                    <p className="text-secondary mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search coins..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-primary focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <button 
                        onClick={() => fetchData(true)}
                        className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={20} className="text-secondary" />
                    </button>
                </div>
            </div>

            {/* Global Analytics */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glassmorphism rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-secondary text-sm mb-1">Total Market Cap</h3>
                        <div className="text-2xl font-bold font-mono text-primary">₹{formatNumber(analytics.totalMarketCapUsd)}</div>
                    </div>
                    <div className="glassmorphism rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-secondary text-sm mb-1">24h Volume</h3>
                        <div className="text-2xl font-bold font-mono text-primary">₹{formatNumber(analytics.totalVolume24hUsd)}</div>
                    </div>
                    <div className="glassmorphism rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-secondary text-sm mb-1">BTC Dominance</h3>
                        <div className="text-2xl font-bold font-mono text-primary">{analytics.btcDominancePercentage.toFixed(2)}%</div>
                    </div>
                    <div className="glassmorphism rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between">
                        <div>
                            <h3 className="text-secondary text-sm mb-1">Fear & Greed Index</h3>
                            <div className="text-2xl font-bold font-mono text-primary">{analytics.fearAndGreedIndex}</div>
                        </div>
                        <div className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                            analytics.fearAndGreedIndex > 60 ? 'bg-green-500/20 text-green-400' :
                            analytics.fearAndGreedIndex < 40 ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {analytics.fearAndGreedClassification}
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                            activeTab === tab 
                            ? 'bg-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                            : 'bg-white/5 text-secondary hover:bg-white/10 hover:text-primary'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Market Table */}
            <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 text-sm">
                            <tr>
                                <th className="p-4 font-semibold text-secondary w-10"></th>
                                <th className="p-4 font-semibold text-secondary cursor-pointer hover:text-primary" onClick={() => handleSort('symbol')}>
                                    <div className="flex items-center gap-1">Coin <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary cursor-pointer hover:text-primary" onClick={() => handleSort('currentPrice')}>
                                    <div className="flex items-center gap-1">Price <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary cursor-pointer hover:text-primary" onClick={() => handleSort('priceChangePercentage24h')}>
                                    <div className="flex items-center gap-1">24h % <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary hidden lg:table-cell cursor-pointer hover:text-primary" onClick={() => handleSort('high24h')}>
                                    <div className="flex items-center gap-1">24h High <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary hidden lg:table-cell cursor-pointer hover:text-primary" onClick={() => handleSort('low24h')}>
                                    <div className="flex items-center gap-1">24h Low <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary hidden md:table-cell cursor-pointer hover:text-primary" onClick={() => handleSort('volume24h')}>
                                    <div className="flex items-center gap-1">24h Volume <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary hidden xl:table-cell cursor-pointer hover:text-primary" onClick={() => handleSort('marketCap')}>
                                    <div className="flex items-center gap-1">Market Cap <ArrowUpDown size={14}/></div>
                                </th>
                                <th className="p-4 font-semibold text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredAndSortedMarkets.map((m) => {
                                const isBtcPair = m.symbol.endsWith('_BTC');
                                const prefix = isBtcPair ? '₿' : (m.symbol.endsWith('_INR') ? '₹' : '₹');
                                
                                const liveData = reduxMarkets[m.symbol];
                                const price = liveData?.price ?? m.currentPrice;
                                const changeVal = m.priceChangePercentage24h ?? 0;
                                const isPositive = changeVal >= 0;

                                return (
                                    <tr 
                                        key={m.symbol} 
                                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                                        onClick={(e) => handleTrade(m.symbol, e)}
                                    >
                                        <td className="p-4" onClick={(e) => toggleFavorite(m.symbol, e)}>
                                            <button className={`transition-colors ${watchlist.includes(m.symbol) ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}>
                                                <Star size={18} fill={watchlist.includes(m.symbol) ? "currentColor" : "none"} />
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {m.image ? (
                                                    <img src={m.image} alt={m.name} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {m.symbol.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-primary flex items-center gap-2">
                                                        {m.symbol.replace('_', '/')}
                                                    </div>
                                                    <div className="text-xs text-muted">{m.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono font-medium text-primary">
                                            {prefix}{formatCurrency(price, isBtcPair)}
                                        </td>
                                        <td className="p-4 font-mono">
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded w-fit ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {isPositive ? '+' : ''}{changeVal.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-secondary hidden lg:table-cell">
                                            {prefix}{formatCurrency(m.high24h, isBtcPair)}
                                        </td>
                                        <td className="p-4 font-mono text-secondary hidden lg:table-cell">
                                            {prefix}{formatCurrency(m.low24h, isBtcPair)}
                                        </td>
                                        <td className="p-4 text-secondary hidden md:table-cell">
                                            {prefix}{formatNumber(m.volume24h)}
                                        </td>
                                        <td className="p-4 text-secondary hidden xl:table-cell">
                                            {prefix}{formatNumber(m.marketCap)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={(e) => handleTrade(m.symbol, e)}
                                                    className="px-4 py-2 rounded-lg bg-primary text-primary hover:bg-primary-light transition-all text-sm font-semibold opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                                >
                                                    Trade
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredAndSortedMarkets.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center p-8 text-secondary">
                                        No markets found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coin Details Panel (Slide-over) */}
            {selectedCoin && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCoin(null)}></div>
                    <div className="relative w-full max-w-md bg-[#0F0B1A] border-l border-white/10 h-full overflow-y-auto animate-slide-in-right p-6">
                        <button 
                            onClick={() => setSelectedCoin(null)}
                            className="absolute top-6 right-6 text-secondary hover:text-primary p-2 bg-white/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            {selectedCoin.image && <img src={selectedCoin.image} alt={selectedCoin.name} className="w-16 h-16 rounded-full" />}
                            <div>
                                <h2 className="text-2xl font-bold text-primary">{selectedCoin.name}</h2>
                                <div className="text-primary font-mono bg-primary/10 px-2 py-1 rounded w-fit mt-1">
                                    {selectedCoin.symbol.replace('_', '/')}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-sm text-muted mb-1">Current Price</div>
                                <div className="text-xl font-bold font-mono text-primary">
                                    {selectedCoin.symbol.endsWith('_BTC') ? '₿' : '₹'}{formatCurrency(reduxMarkets[selectedCoin.symbol]?.price ?? selectedCoin.currentPrice)}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-sm text-muted mb-1">24h Change</div>
                                <div className={`text-xl font-bold font-mono flex items-center gap-1 ${selectedCoin.priceChangePercentage24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {selectedCoin.priceChangePercentage24h >= 0 ? '+' : ''}{selectedCoin.priceChangePercentage24h?.toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h3 className="text-lg font-semibold border-b border-white/10 pb-2 flex items-center gap-2 text-primary">
                                <ActivitySquare size={18} className="text-primary"/> Market Stats
                            </h3>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">Market Cap</span>
                                <span className="font-mono text-primary">₹{formatNumber(selectedCoin.marketCap)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">24h Volume</span>
                                <span className="font-mono text-primary">₹{formatNumber(selectedCoin.volume24h)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">Circulating Supply</span>
                                <span className="font-mono text-primary">{formatNumber(selectedCoin.circulatingSupply)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">Total Supply</span>
                                <span className="font-mono text-primary">{selectedCoin.totalSupply ? formatNumber(selectedCoin.totalSupply) : '∞'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">24h High</span>
                                <span className="font-mono text-green-400">{selectedCoin.symbol.endsWith('_BTC') ? '₿' : '₹'}{formatCurrency(selectedCoin.high24h)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-secondary">24h Low</span>
                                <span className="font-mono text-red-400">{selectedCoin.symbol.endsWith('_BTC') ? '₿' : '₹'}{formatCurrency(selectedCoin.low24h)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={(e) => handleTrade(selectedCoin.symbol, e)}
                                className="col-span-2 py-3 rounded-xl bg-primary text-primary font-bold hover:bg-primary-light transition-colors shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                            >
                                Trade {selectedCoin.symbol.replace('_', '/')}
                            </button>
                            
                            <button 
                                onClick={(e) => toggleFavorite(selectedCoin.symbol, e)}
                                className={`py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border ${
                                    watchlist.includes(selectedCoin.symbol) 
                                    ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
                                    : 'bg-white/5 text-secondary border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <Star size={18} fill={watchlist.includes(selectedCoin.symbol) ? "currentColor" : "none"}/>
                                {watchlist.includes(selectedCoin.symbol) ? 'Saved' : 'Watchlist'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
