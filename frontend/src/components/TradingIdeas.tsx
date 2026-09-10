import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Rocket } from 'lucide-react';

const ideas = [
  {
    id: 'eurusd-breakout',
    title: 'EURUSD Breakout and Potential Retrace!',
    author: 'JoeChampion',
    date: '20 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
    comments: 5,
    likes: 9,
    snippet: 'Hey Traders, in today\'s trading session we are monitoring EURUSD for a buying opportunity around 1.15500 zone...'
  },
  {
    id: 'gbpusd-pullback',
    title: 'GBP/USD Bullish Pullback Setup',
    author: 'SMART_MONEY_CIRCLE',
    date: '17 hours ago',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop',
    comments: 6,
    likes: 7,
    snippet: 'GBP/USD is holding above a rising trendline, maintaining a bullish structure despite the recent rejection from the resistance zone...'
  },
  {
    id: 'xauusd-swept',
    title: 'BSL Swept, Is 1.1457 Next? | XAUUSD',
    author: 'Adrian_NovaTrader',
    date: '22 hours ago',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=600&auto=format&fit=crop',
    comments: 3,
    likes: 8,
    snippet: 'EURUSD has reached the H4 BSL (Buy Side Liquidity) around 1.1575-1.1585 and swept the liquidity above the previous highs...'
  }
];

const TradingIdeas: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ideas.map((idea) => (
        <Link to={`/trade-idea/${idea.id}`} key={idea.id} className="bg-[#0b1120] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 hover:border-blue-500/30 group flex flex-col">
          <div className="h-48 overflow-hidden shrink-0 border-b border-white/5">
            <img src={idea.image} alt={idea.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{idea.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-grow">{idea.snippet}</p>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-xs text-slate-300">by <span className="font-bold">{idea.author}</span></p>
                <p className="text-xs text-slate-500 mt-0.5">{idea.date}</p>
              </div>
              <div className="flex gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {idea.comments}</span>
                <span className="flex items-center gap-1.5"><Rocket size={14} /> {idea.likes}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TradingIdeas;
