import React, { useState } from 'react';
import { Wallet, Shield, Zap } from 'lucide-react';

const Web3Connect: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Mocking Web3 injected provider connection (e.g., window.ethereum)
      setTimeout(() => {
        const mockAddress = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setWalletAddress(mockAddress);
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
  };

  return (
    <div className="bg-vault-800/80 backdrop-blur-xl border border-vault-700/50 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-accent-neonBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-vault-700/50 rounded-lg text-accent-electricCyan">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Web3 Wallet</h3>
            <p className="text-sm text-secondary">Connect decentralized wallets</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {walletAddress ? (
          <div className="bg-vault-700/30 p-4 rounded-xl border border-vault-600/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-secondary">Connected Address</span>
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30 flex items-center gap-1">
                <Shield size={12} /> Verified
              </span>
            </div>
            <p className="text-primary font-mono text-sm break-all">{walletAddress}</p>
            <button 
              onClick={disconnect}
              className="mt-4 w-full py-2 bg-vault-600/50 hover:bg-vault-500/50 text-primary rounded-lg transition-colors text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-neonBlue text-primary font-bold rounded-xl shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.5)] transition-all flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <span className="animate-pulse">Connecting to Provider...</span>
            ) : (
              <>
                <Zap size={18} /> Connect MetaMask
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Web3Connect;
