import { useEffect, useState } from 'react';
import { fetchApi } from '../../utils/api';

interface Transaction {
    id: string;
    tokenSymbol: string;
    type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'STAKE' | 'UNSTAKE' | 'REWARD' | 'FEE';
    amount: number;
    price: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: string;
}

export default function OpenOrdersPanel() {
    const [activeTab, setActiveTab] = useState('Trade History');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTxs = async () => {
            if (activeTab !== 'Trade History') return;
            setLoading(true);
            try {
                const data = await fetchApi('/api/wallet/transactions');
                setTransactions(data.filter((t: Transaction) => t.type === 'BUY' || t.type === 'SELL'));
            } catch (e) {
                console.error('Failed to fetch transactions', e);
            } finally {
                setLoading(false);
            }
        };

        fetchTxs();

        const handleTradeExecuted = () => {
            fetchTxs();
        };

        window.addEventListener('trade-executed', handleTradeExecuted);
        
        return () => {
            window.removeEventListener('trade-executed', handleTradeExecuted);
        };
    }, [activeTab]);

    return (
        <div className="glass-card flex flex-col h-full overflow-hidden text-sm p-4">
            <div className="flex gap-6 pb-2">
                {['Trade History'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 font-semibold text-sm transition-colors ${activeTab === tab ? 'text-accent-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-4 min-h-[250px]">
                {activeTab !== 'Trade History' ? (
                    <div className="h-full flex items-center justify-center text-muted font-sans">
                        No {activeTab.toLowerCase()} found.
                    </div>
                ) : (
                    loading ? (
                        <div className="h-full flex items-center justify-center text-muted">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted font-sans">No trade history found.</div>
                    ) : (
                        <table className="w-full text-left text-sm font-mono">
                            <thead className="text-secondary text-xs uppercase font-semibold tracking-wider">
                                <tr>
                                    <th className="pb-2">Time</th>
                                    <th className="pb-2">Side</th>
                                    <th className="pb-2">BTC</th>
                                    <th className="pb-2">Total Amount</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                                        <td className="py-2 text-secondary">{new Date(tx.createdAt).toLocaleString()}</td>
                                        <td className={`py-2 font-bold ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</td>
                                        <td className="py-2">{parseFloat(tx.amount.toFixed(6))}</td>
                                        <td className="py-2 text-secondary">{(tx.price * tx.amount).toFixed(2)}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded text-sm 
                                                ${tx.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 
                                                  tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                  'bg-red-500/20 text-red-400'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
}
