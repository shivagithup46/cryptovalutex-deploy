import { ExternalLink, Bookmark, Clock } from 'lucide-react';

export default function CryptoNews() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading text-primary">Market News</h1>
                <div className="flex gap-4">
                    <button className="text-primary border-b-2 border-primary pb-2 font-bold px-4">Latest</button>
                    <button className="text-muted hover:text-primary transition-colors pb-2 font-bold px-4">Bookmarks</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* News Card 1 */}
                <div className="glassmorphism rounded-2xl border border-white/10 hover:border-primary/50 transition-all group overflow-hidden flex flex-col h-full">
                    <div className="h-48 bg-gradient-to-tr from-primary/40 to-blue-500/40 relative">
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                            BTC
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-center text-sm text-secondary mb-3">
                            <span>CryptoInsider</span>
                            <div className="flex items-center gap-1"><Clock size={14} /> 2 hours ago</div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Bitcoin Surges Past Key Resistance Level of $70,000</h3>
                        <p className="text-secondary text-sm mb-6 flex-1">BTC broke out above $70k today amid strong institutional demand and ETF inflows, setting the stage for price discovery.</p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <button className="text-secondary hover:text-primary transition-colors"><Bookmark size={20} /></button>
                            <button className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors text-sm">
                                Read Full <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* News Card 2 */}
                <div className="glassmorphism rounded-2xl border border-white/10 hover:border-primary/50 transition-all group overflow-hidden flex flex-col h-full">
                    <div className="h-48 bg-gradient-to-tr from-secondary/40 to-purple-500/40 relative">
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                            ETH
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-center text-sm text-secondary mb-3">
                            <span>DeFiDaily</span>
                            <div className="flex items-center gap-1"><Clock size={14} /> 5 hours ago</div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Ethereum Layer 2 Total Value Locked Hits New All-Time High</h3>
                        <p className="text-secondary text-sm mb-6 flex-1">The total value locked across all Ethereum rollups reaches $45B, led by Arbitrum and Optimism growth.</p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <button className="text-secondary hover:text-primary transition-colors"><Bookmark size={20} /></button>
                            <button className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors text-sm">
                                Read Full <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
