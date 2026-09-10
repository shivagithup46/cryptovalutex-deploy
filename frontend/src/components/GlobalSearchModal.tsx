import { useState, useEffect } from 'react';
import { Search, X, User, Activity, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const handleSelect = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0f0c1b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4" onClick={(e) => e.stopPropagation()}>
                
                {/* Search Input */}
                <div className="flex items-center px-4 py-4 border-b border-white/10">
                    <Search className="text-primary mr-3" size={24} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for Coins, Users, Orders, or Pages..."
                        className="flex-1 bg-transparent border-none text-xl text-primary outline-none placeholder-gray-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-primary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Results (Mocked) */}
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {query.length === 0 ? (
                        <div className="p-8 text-center text-muted">
                            <p>Type to search across the platform</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="px-3 py-2 text-xs font-bold text-muted uppercase tracking-wider">Pages</div>
                            <button 
                                onClick={() => handleSelect('/trade')}
                                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-primary/20 rounded-xl transition-colors group"
                            >
                                <Activity className="text-primary" size={18} />
                                <div>
                                    <p className="text-primary font-bold group-hover:text-primary transition-colors">Spot Trading</p>
                                    <p className="text-xs text-secondary">Trade BTC, ETH, and other assets</p>
                                </div>
                            </button>
                            <button 
                                onClick={() => handleSelect('/wallet')}
                                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-primary/20 rounded-xl transition-colors group"
                            >
                                <Wallet className="text-primary" size={18} />
                                <div>
                                    <p className="text-primary font-bold group-hover:text-primary transition-colors">My Wallet</p>
                                    <p className="text-xs text-secondary">View balances and deposit</p>
                                </div>
                            </button>

                            <div className="px-3 py-2 mt-4 text-xs font-bold text-muted uppercase tracking-wider">Users</div>
                            <button 
                                onClick={() => handleSelect('/admin')}
                                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 rounded-xl transition-colors group"
                            >
                                <User className="text-secondary" size={18} />
                                <div>
                                    <p className="text-primary font-bold group-hover:text-secondary transition-colors">John Doe (Trader)</p>
                                    <p className="text-xs text-secondary">ID: #990142</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs text-muted">
                    <span>Press <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> to close</span>
                </div>
            </div>
            
            {/* Click outside to close */}
            <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
        </div>
    );
}
