import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Command, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Check, Sun, Moon } from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { webSocketService } from '../services/WebSocketService';
import { fetchApi } from '../utils/api';

import { formatDistanceToNow } from 'date-fns';

interface NotificationDTO {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [toasts, setToasts] = useState<NotificationDTO[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const data = await fetchApi('/api/notifications');
        if (Array.isArray(data)) {
            setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    fetchNotifications();

    webSocketService.connect();
    
    const topic = `/topic/notifications-${user.id}`;
    const unsubscribe = webSocketService.subscribe(topic, (newNotification: NotificationDTO) => {
        setNotifications(prev => {
            // Avoid duplicates
            if (prev.some(n => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
        });
        
        setToasts(prev => [...prev, newNotification]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newNotification.id));
        }, 5000);
    });

    return () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    };
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await fetchApi('/api/notifications/read-all', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await fetchApi(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getIcon = (type: string) => {
      switch(type?.toUpperCase()) {
          case 'BUY': return <ArrowUpRight className="text-green-500" size={18} />;
          case 'SELL': return <ArrowDownLeft className="text-red-500" size={18} />;
          case 'DEPOSIT': return <Wallet className="text-accent-electricCyan" size={18} />;
          case 'WITHDRAWAL': return <Wallet className="text-primary" size={18} />;
          case 'TRADE': return <TrendingUp className="text-primary" size={18} />;
          case 'SUCCESS': return <CheckCircle2 className="text-green-500" size={18} />;
          case 'FAILED': return <AlertCircle className="text-red-500" size={18} />;
          default: return <Bell className="text-secondary" size={18} />;
      }
  };

  return (
    <>
    <header className="h-20 bg-[#050B18]/70 backdrop-blur-md flex items-center justify-between px-8 z-10 relative border-b border-white/5">
      <div className="flex-1 max-w-xl">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-full relative group flex items-center bg-[#0B1830] hover:bg-[#0F1F3D] border border-white/5 hover:border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] rounded-xl px-4 py-2 text-left transition-all"
        >
          <Search className="text-secondary group-hover:text-primary transition-colors mr-3" size={20} />
          <span className="text-muted group-hover:text-secondary">Search tokens, users, transactions...</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted bg-black/40 px-2 py-1 rounded">
            <Command size={12} /> K
          </div>
        </button>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className="p-2 text-secondary hover:text-primary transition-colors"
        >
          {themeMode === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-secondary hover:text-primary transition-colors"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent-pink text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,0,127,0.8)]">
                  {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-96 glass-card p-4 rounded-xl shadow-2xl z-50 border border-white/10 flex flex-col max-h-[500px]">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                <h4 className="text-primary font-bold">Notifications {unreadCount > 0 && <span className="text-secondary text-xs font-normal ml-2">{unreadCount} unread</span>}</h4>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary transition-colors flex items-center gap-1">
                        <Check size={14} /> Mark all read
                    </button>
                )}
              </div>
              
              <div className="overflow-y-auto no-scrollbar flex-1 flex flex-col gap-2">
                {notifications.length === 0 ? (
                  <p className="text-secondary text-sm py-4 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((note) => (
                      <div 
                        key={note.id} 
                        onClick={() => markAsRead(note.id, note.read)}
                        className={`p-3 rounded-lg text-sm border cursor-pointer transition-colors flex gap-3 ${note.read ? 'bg-[#0B1830]/50 border-transparent text-secondary' : 'bg-[#0B1830] border-[#22D3EE]/30 shadow-[0_4px_15px_rgba(34,211,238,0.1)] text-white hover:bg-[#0F1F3D]'}`}
                    >
                      <div className="mt-0.5">
                          {getIcon(note.type)}
                      </div>
                      <div className="flex-1">
                          <h5 className={`font-semibold ${note.read ? 'text-secondary' : 'text-primary'}`}>{note.title}</h5>
                          <p className="text-xs mt-1 leading-relaxed opacity-90">{note.message}</p>
                          <span className="text-[10px] text-muted mt-2 block">
                              {note.createdAt ? formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }) : 'Just now'}
                          </span>
                      </div>
                      {!note.read && <div className="w-2 h-2 rounded-full bg-accent-neonBlue mt-1"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-primary">
              {user?.privacy?.hideEmail && user?.email 
                ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') 
                : (user?.email || 'Guest')}
            </p>
            <p className="text-xs text-secondary">{user?.roles?.[0] || 'User'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] p-0.5 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <div className="w-full h-full bg-[#07152B] rounded-full flex items-center justify-center">
              <User size={20} className="text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    
    {/* Toast Container */}
    <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
            <div key={`toast-${toast.id}`} className="glass-card flex items-start gap-3 p-4 rounded-xl shadow-2xl border border-white/10 w-80 animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-auto bg-[#050B18]/90 backdrop-blur-xl">
                <div className="mt-0.5">
                    {getIcon(toast.type)}
                </div>
                <div className="flex-1">
                    <h5 className="font-bold text-primary text-sm">{toast.title}</h5>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">{toast.message}</p>
                </div>
                <button 
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="text-muted hover:text-primary transition-colors"
                >
                    &times;
                </button>
            </div>
        ))}
    </div>
    </>
  );
};

export default Header;
