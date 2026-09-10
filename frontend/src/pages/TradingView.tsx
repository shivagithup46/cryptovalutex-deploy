import { useEffect } from 'react';
import MarketListPanel from './trade/MarketListPanel';
import ChartPanel from './trade/ChartPanel';
import OrderBookPanel from './trade/OrderBookPanel';
import TradingFormPanel from './trade/TradingFormPanel';
import RecentTradesPanel from './trade/RecentTradesPanel';
import OpenOrdersPanel from './trade/OpenOrdersPanel';
import AccountSummaryPanel from './trade/AccountSummaryPanel';

export default function TradingView() {
    // Hide body scrollbar since this page is a full-screen app layout
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-2 overflow-hidden pb-4 px-2">
            
            {/* Left Column: Markets & Account Summary (Full Height) */}
            <div className="w-full lg:w-[300px] flex flex-col gap-2 h-full overflow-hidden shrink-0">
                <div className="flex-[3] overflow-hidden min-h-0 flex flex-col">
                    <MarketListPanel />
                </div>
                <div className="flex-[2] overflow-hidden min-h-0 hidden lg:flex flex-col">
                    <RecentTradesPanel />
                </div>
            </div>
            
            {/* Right Section: Split into Top (Chart + Trading) and Bottom (Open Orders) */}
            <div className="flex-1 flex flex-col gap-2 h-full overflow-hidden min-w-[500px]">
                
                {/* Top Row: Chart & Trading Panel (75% height) */}
                <div className="flex-[7] flex flex-col lg:flex-row gap-2 overflow-hidden min-h-0">
                    
                    {/* Chart Panel */}
                    <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                        <ChartPanel />
                    </div>
                    
                    {/* Trading Panel */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-2 overflow-y-auto shrink-0 no-scrollbar pb-2">
                        <div className="hidden lg:flex flex-col min-h-[300px] flex-shrink-0">
                            <OrderBookPanel />
                        </div>
                        <div className="flex-shrink-0">
                            <TradingFormPanel />
                        </div>
                        <div className="flex-shrink-0">
                            <AccountSummaryPanel />
                        </div>
                    </div>

                </div>

                {/* Bottom Row: Open Orders (25% height) */}
                <div className="flex-[3] overflow-hidden min-h-0 hidden lg:flex flex-col">
                    <OpenOrdersPanel />
                </div>

            </div>
            
        </div>
    );
}
