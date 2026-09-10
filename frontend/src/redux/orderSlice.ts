import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Order {
    id: string;
    marketId: string;
    type: string;
    side: string;
    price: number;
    quantity: number;
    filledQuantity: number;
    status: string;
    createdAt: string;
}

interface OrderState {
    openOrders: Order[];
}

const initialState: OrderState = {
    openOrders: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOpenOrders(state, action: PayloadAction<Order[]>) {
            state.openOrders = action.payload;
        },
        addOrder(state, action: PayloadAction<Order>) {
            state.openOrders.unshift(action.payload);
        }
    }
});

export const { setOpenOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
