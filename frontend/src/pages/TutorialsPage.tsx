import React from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const tutorials = [
  {
    id: 1,
    title: 'Crypto Trading for Beginners (Hindi)',
    language: 'Hindi',
    duration: '45:20',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Technical Analysis Full Course',
    language: 'Hindi',
    duration: '1:20:15',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Crypto Market Trading (Tamil)',
    language: 'Tamil',
    duration: '32:10',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'How to start Day Trading (Telugu)',
    language: 'Telugu',
    duration: '28:45',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Option Trading Basic Concepts',
    language: 'Hindi',
    duration: '55:30',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1641391515256-42d416b27e4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Price Action Trading Strategies',
    language: 'Tamil',
    duration: '41:12',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Nifty & Bank Nifty Options',
    language: 'Telugu',
    duration: '38:20',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Crypto Futures Trading Guide',
    language: 'Hindi',
    duration: '50:00',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 9,
    title: 'How to use TradingView',
    language: 'Hindi',
    duration: '22:15',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 10,
    title: 'Complete Beginner Guide to Crypto',
    language: 'Malayalam',
    duration: '1:05:30',
    url: 'https://www.youtube.com/watch?v=unuHBJdRDGQ',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop'
  }
];

const TutorialsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-inter">
      {/* HEADER */}
      <header className="w-full z-50 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#020617] sticky top-0">
        <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="text-xl font-bold tracking-tight">CryptoVaultX</span>
        </Link>
        <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Trading Tutorials</h1>
            <p className="text-slate-400 text-lg max-w-2xl">Learn the basics of cryptocurrency, technical analysis, and price action trading in your preferred language.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tutorials.map((video) => (
            <a 
                key={video.id} 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0b1120] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 group flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden shrink-0 border-b border-white/5">
                <img src={video.image} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        <PlayCircle size={24} className="text-white fill-white" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                    {video.duration}
                </div>
                <div className="absolute top-2 left-2 bg-blue-600/90 px-2 py-1 rounded text-xs font-bold text-white shadow-sm">
                    {video.language}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                <p className="text-sm text-slate-400 mt-auto flex items-center gap-2">
                    Watch on YouTube <ArrowLeft className="rotate-135" size={14} /> 
                </p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TutorialsPage;
