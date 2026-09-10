import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, History, Settings, LogOut, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Spot Trading', path: '/trade' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: ArrowLeftRight, label: 'Exchange', path: '/exchange' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#07152B]/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <span className="font-bold text-white text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CryptoVaultX</span>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent',
                isActive
                  ? 'text-white bg-blue-600/20 shadow-[inset_2px_0_0_#2563eb]'
                  : 'text-secondary hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-secondary hover:text-red-400 hover:bg-white/5 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
