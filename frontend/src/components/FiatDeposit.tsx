import React, { useState } from 'react';
import { CreditCard, ArrowRight, CheckCircle } from 'lucide-react';
import { fetchApi } from '../utils/api';

const FiatDeposit: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [txnId, setTxnId] = useState('');

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setStatus('PROCESSING');
    
    try {
      const response = await fetchApi('/api/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(amount),
          symbol: 'INR',
          method: 'RAZORPAY'
        })
      });
      
      setTxnId(response.id || 'txn_' + Date.now());
      setStatus('SUCCESS');
      
    } catch (error) {
      console.error(error);
      setStatus('IDLE');
    }
  };

  return (
    <div className="bg-vault-800/80 backdrop-blur-xl border border-vault-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-vault-700/50 rounded-lg text-accent-green">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary">Fiat Deposit</h3>
          <p className="text-sm text-secondary">Add funds via UPI / Bank</p>
        </div>
      </div>

      {status === 'SUCCESS' ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
            <CheckCircle size={32} />
          </div>
          <h4 className="text-lg font-bold text-primary mb-2">Deposit Successful</h4>
          <p className="text-sm text-secondary mb-4">Transaction ID: {txnId}</p>
          <button 
            onClick={() => { setStatus('IDLE'); setAmount(''); }}
            className="px-6 py-2 bg-vault-700 hover:bg-vault-600 text-primary rounded-lg transition-colors text-sm"
          >
            Make Another Deposit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-secondary mb-2">Amount (INR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-vault-700/30 border border-vault-600/50 rounded-xl pl-8 pr-4 py-3 text-primary focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/50 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <button 
            onClick={handleDeposit}
            disabled={status === 'PROCESSING' || !amount}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-accent-green text-primary font-bold rounded-xl shadow-[0_0_15px_rgba(0,255,170,0.3)] hover:shadow-[0_0_25px_rgba(0,255,170,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'PROCESSING' ? 'Processing...' : (
              <>Pay Securely <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FiatDeposit;
