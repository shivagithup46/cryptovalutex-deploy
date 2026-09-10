import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { store } from '../redux/store';
import { updateMarketData } from '../redux/marketSlice';

class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, any> = new Map();

    connect() {
        if (this.client) return;

        this.client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to STOMP WebSocket');
                // Auto-subscribe to the active market
                const activeSymbol = store.getState().market.activeMarketSymbol;
                if (activeSymbol) {
                    this.subscribeToMarket(activeSymbol);
                }
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            }
        });

        this.client.activate();
    }

    subscribeToMarket(symbol: string) {
        if (!this.client || !this.client.connected) return;

        // Unsubscribe from others if needed, but for now we'll just track it
        const topic = `/topic/market/${symbol}`;
        
        if (this.subscriptions.has(topic)) {
            return;
        }

        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            const data = JSON.parse(message.body);
            store.dispatch(updateMarketData(data));
        });

        this.subscriptions.set(topic, subscription);
    }

    unsubscribeFromMarket(symbol: string) {
        const topic = `/topic/market/${symbol}`;
        const sub = this.subscriptions.get(topic);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    subscribe(topic: string, callback: (data: any) => void) {
        if (!this.client || !this.client.connected) {
            // Wait for connection
            setTimeout(() => this.subscribe(topic, callback), 1000);
            return () => {};
        }

        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            const data = JSON.parse(message.body);
            callback(data);
        });

        return () => subscription.unsubscribe();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.subscriptions.clear();
        }
    }
}

export const webSocketService = new WebSocketService();
