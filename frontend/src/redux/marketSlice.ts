import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Market {
    id?: string;
    symbol: string;
    price: number;
    volume24h: number;
    change24h: string;
    high24h?: number;
    low24h?: number;
}

interface MarketState {
    markets: Record<string, Market>;
    activeMarketSymbol: string | null;
    watchlist: string[];
}

const initialState: MarketState = {
    markets: {},
    activeMarketSymbol: 'BTC_INR',
    watchlist: [],
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        updateMarketData(state, action: PayloadAction<Market>) {
            state.markets[action.payload.symbol] = action.payload;
        },
        setActiveMarket(state, action: PayloadAction<string>) {
            state.activeMarketSymbol = action.payload;
        },
        setWatchlist(state, action: PayloadAction<string[]>) {
            state.watchlist = action.payload;
        },
        toggleWatchlistItem(state, action: PayloadAction<string>) {
            const symbol = action.payload;
            if (state.watchlist.includes(symbol)) {
                state.watchlist = state.watchlist.filter(s => s !== symbol);
            } else {
                state.watchlist.push(symbol);
            }
        }
    }
});

export const { updateMarketData, setActiveMarket, setWatchlist, toggleWatchlistItem } = marketSlice.actions;
export default marketSlice.reducer;
