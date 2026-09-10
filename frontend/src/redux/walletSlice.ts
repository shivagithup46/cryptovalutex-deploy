import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Wallet {
    id: string;
    tokenId: string;
    tokenSymbol: string;
    balance: number;
    lockedBalance: number;
    averageBuyPrice?: number;
}

interface WalletState {
    wallets: Wallet[];
}

const initialState: WalletState = {
    wallets: [],
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWallets(state, action: PayloadAction<Wallet[]>) {
            state.wallets = action.payload;
        }
    }
});

export const { setWallets } = walletSlice.actions;
export default walletSlice.reducer;
