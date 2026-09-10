import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './marketSlice';
import walletReducer from './walletSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    wallet: walletReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
