import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, Download, Search, ArrowUpRight, ArrowDownRight, 
  Gift, Wallet, RefreshCcw, CheckCircle2, XCircle, Clock, X
} from 'lucide-react';
import { fetchApi } from '../utils/api';
import clsx from 'clsx';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
};

interface Transaction {
  id: string;
  type: string;
  symbol: string;
  tradingPair: string;
  amount: number;
  price: number;
  fee: number;
  orderValue: number;
  profit: number;
  walletBalanceBefore: number;
  walletBalanceAfter: number;
  portfolioValue: number;
  status: string;
  txHash: string;
  timestamp: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await fetchApi('/api/transactions/all');
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const searchMatch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = typeFilter === 'ALL' || tx.type === typeFilter;
      const statusMatch = statusFilter === 'ALL' || tx.status === statusFilter;
      let dateMatch = true;
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      if (dateFilter === 'TODAY') {
        dateMatch = txDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7DAYS') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        dateMatch = txDate >= sevenDaysAgo;
      } else if (dateFilter === '30DAYS') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        dateMatch = txDate >= thirtyDaysAgo;
      }
      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

  const summary = useMemo(() => {
    let totalBuy = 0;
    let totalSell = 0;
    let netProfit = 0;
    transactions.forEach(tx => {
      if (tx.type === 'BUY') totalBuy += tx.orderValue;
      if (tx.type === 'SELL') {
        totalSell += tx.orderValue;
        netProfit += tx.profit;
      }
    });
    return { totalBuy, totalSell, netProfit, totalCount: transactions.length };
  }, [transactions]);

  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Transaction ID', 'Date', 'Type', 'Pair', 'Amount', 'Price', 'Order Value', 'Fee', 'Profit', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        tx.id,
        new Date(tx.timestamp).toLocaleString(),
        tx.type,
        tx.tradingPair,
        tx.amount,
        tx.price,
        tx.orderValue,
        tx.fee,
        tx.profit,
        tx.status
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'crypto_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={14} className="text-accent-green" />;
      case 'FAILED': return <XCircle size={14} className="text-accent-pink" />;
      case 'PENDING': return <Clock size={14} className="text-accent-yellow" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <ArrowDownRight size={20} className="text-accent-green" />;
      case 'SELL': return <ArrowUpRight size={20} className="text-accent-pink" />;
      case 'LOGIN_REWARD': return <Gift size={20} className="text-accent-primary" />;
      case 'DEPOSIT': return <Wallet size={20} className="text-accent-primary" />;
      case 'WITHDRAWAL': return <ArrowUpRight size={20} className="text-secondary" />;
      default: return <RefreshCcw size={20} className="text-secondary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-end pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">Transaction History</h1>
          <p className="text-secondary text-sm">View and manage your complete trading activity</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Metrics Strip */}
      <div className="flex flex-wrap gap-12 py-4">
        <div>
          <p className="text-secondary text-xs font-semibold tracking-wider mb-1 uppercase">Total Transactions</p>
          <p className="text-2xl font-bold font-mono">{summary.totalCount}</p>
        </div>
        <div>
          <p className="text-secondary text-xs font-semibold tracking-wider mb-1 uppercase">Total Buy Value</p>
          <p className="text-2xl font-bold font-mono text-primary">{formatCurrency(summary.totalBuy)}</p>
        </div>
        <div>
          <p className="text-secondary text-xs font-semibold tracking-wider mb-1 uppercase">Total Sell Value</p>
          <p className="text-2xl font-bold font-mono text-primary">{formatCurrency(summary.totalSell)}</p>
        </div>
        <div>
          <p className="text-secondary text-xs font-semibold tracking-wider mb-1 uppercase">Net Realized Profit</p>
          <p className={clsx("text-2xl font-bold font-mono", summary.netProfit >= 0 ? "text-accent-green" : "text-accent-pink")}>
            {summary.netProfit >= 0 ? '+' : ''}{formatCurrency(summary.netProfit)}
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap gap-6 items-center py-2">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-secondary border-none px-2 py-2 text-sm focus:outline-none cursor-pointer hover:text-primary transition-colors"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="7DAYS">Last 7 Days</option>
            <option value="30DAYS">Last 30 Days</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-secondary border-none px-2 py-2 text-sm focus:outline-none cursor-pointer hover:text-primary transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="LOGIN_REWARD">Reward</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-secondary border-none px-2 py-2 text-sm focus:outline-none cursor-pointer hover:text-primary transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-8">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <History size={32} className="text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Transactions Found</h3>
            <p className="text-secondary max-w-sm mx-auto">
              Your activity history is empty for the selected filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header row (subtle) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              <div className="col-span-3">Asset / Type</div>
              <div className="col-span-2">Date & Time</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-center">Status</div>
            </div>

            {/* Transaction Rows */}
            <div className="flex flex-col gap-2">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-4 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{tx.tradingPair || tx.symbol}</p>
                      <p className="text-xs text-secondary font-medium tracking-wide">{tx.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="font-medium text-sm">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-secondary">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <p className={clsx("font-mono font-medium", tx.type === 'SELL' || tx.type === 'WITHDRAWAL' ? 'text-accent-pink' : 'text-accent-green')}>
                      {tx.type === 'SELL' || tx.type === 'WITHDRAWAL' ? '-' : '+'}{tx.amount.toLocaleString()} {tx.symbol}
                    </p>
                  </div>
                  
                  <div className="col-span-2 text-right font-mono text-sm">
                    {tx.price > 0 ? formatCurrency(tx.price) : '-'}
                  </div>
                  
                  <div className="col-span-2 text-right font-mono font-bold">
                    {formatCurrency(tx.orderValue)}
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                      {getStatusIcon(tx.status)}
                      <span className="hidden lg:inline">{tx.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0c0514] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold">Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-secondary hover:text-primary">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Status</span>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {getStatusIcon(selectedTx.status)}
                  {selectedTx.status}
                </div>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Transaction ID</span>
                <span className="font-mono text-sm">{selectedTx.id.split('-')[0]}...</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Date & Time</span>
                <span className="font-medium text-sm">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Type</span>
                <span className="font-medium text-sm">{selectedTx.type.replace('_', ' ')}</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Trading Pair</span>
                <span className="font-medium text-sm">{selectedTx.tradingPair || selectedTx.symbol}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-t border-white/5 pt-4">
                <span className="text-secondary text-sm">Amount</span>
                <span className="font-bold font-mono">{selectedTx.amount.toLocaleString()} {selectedTx.symbol}</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Price</span>
                <span className="font-medium font-mono">{selectedTx.price > 0 ? formatCurrency(selectedTx.price) : '-'}</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Order Value</span>
                <span className="font-bold text-primary font-mono">{formatCurrency(selectedTx.orderValue)}</span>
              </div>

              <div className="flex justify-between items-center pb-2">
                <span className="text-secondary text-sm">Fee</span>
                <span className="font-medium font-mono">{formatCurrency(selectedTx.fee)}</span>
              </div>

              {selectedTx.type === 'SELL' && (
                <div className="flex justify-between items-center pb-2 border-t border-white/5 pt-4">
                  <span className="text-secondary text-sm">Realized Profit</span>
                  <span className={clsx("font-bold font-mono", selectedTx.profit >= 0 ? "text-accent-green" : "text-accent-pink")}>
                    {selectedTx.profit >= 0 ? '+' : ''}{formatCurrency(selectedTx.profit)}
                  </span>
                </div>
              )}

              <div className="pt-6 text-center">
                <span className="text-xs text-muted font-mono bg-white/5 px-3 py-1 rounded">Ref: {selectedTx.txHash}</span>
              </div>
            </div>
            
            <div className="p-6">
              <button 
                onClick={() => setSelectedTx(null)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transactions;
