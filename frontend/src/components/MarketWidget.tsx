import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { fetchApi } from '../utils/api';

interface MarketData {
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
}

const MarketWidget: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/api/market/top');
        setMarketData(data);
      } catch (error) {
        console.error("Failed to load market data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-vault-800/80 backdrop-blur-xl border border-vault-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-vault-700/50 rounded-lg text-primary">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Live Market</h3>
            <p className="text-sm text-secondary">Global Aggregated Data</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-vault-700 rounded w-3/4"></div>
              <div className="h-4 bg-vault-700 rounded"></div>
              <div className="h-4 bg-vault-700 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          marketData.map((coin) => (
            <div key={coin.symbol} className="flex items-center justify-between p-3 bg-vault-700/20 rounded-xl hover:bg-vault-700/40 transition-colors cursor-pointer border border-transparent hover:border-vault-600/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vault-800 flex items-center justify-center text-xs font-bold text-secondary">
                  {coin.symbol.split('-')[0]}
                </div>
                <div>
                  <p className="text-primary font-medium">{coin.symbol}</p>
                  <p className="text-xs text-muted">Vol: ${(coin.volume24h / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary font-medium">${coin.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className={`flex items-center justify-end gap-1 text-xs ${coin.priceChangePercentage24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.priceChangePercentage24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(coin.priceChangePercentage24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketWidget;
