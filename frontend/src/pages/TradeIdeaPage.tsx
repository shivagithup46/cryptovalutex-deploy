import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Logo from '../components/Logo';

const tradeIdeasData = {
  'eurusd-breakout': {
    title: 'EURUSD Breakout and Potential Retrace!',
    author: 'JoeChampion',
    date: 'Updated 20 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
    comments: 5,
    likes: 9,
    content: `Hey Traders, in today's trading session we are monitoring EURUSD for a buying opportunity around 1.15500 zone. 

EURUSD has been trading in a downtrend and successfully broke out of the descending channel. We are now expecting a retracement to the broken trendline before the continuation of the bullish momentum.

**Key Levels:**
- **Support:** 1.15500
- **Resistance:** 1.16200

If price action shows rejection at our support zone, we will be looking for long entries targeting the recent highs. Ensure you manage your risk and wait for proper candlestick confirmation.`
  },
  'gbpusd-pullback': {
    title: 'GBP/USD Bullish Pullback Setup',
    author: 'SMART_MONEY_CIRCLE',
    date: 'Updated 17 hours ago',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
    comments: 6,
    likes: 7,
    content: `GBP/USD is holding above a rising trendline, maintaining a bullish structure despite the recent rejection from the resistance zone.

We are observing a healthy pullback into a high-volume node. Market structure remains bullish on the 4H timeframe. 

**Trade Plan:**
Look for accumulation schematics around the 1.2400 psychological level. A break above the local minor structure will confirm the end of the pullback phase.`
  },
  'xauusd-swept': {
    title: 'BSL Swept, Is 1.1457 Next? | XAUUSD',
    author: 'Adrian_NovaTrader',
    date: '22 hours ago',
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1200&auto=format&fit=crop',
    comments: 3,
    likes: 8,
    content: `EURUSD has reached the H4 BSL (Buy Side Liquidity) around 1.1575-1.1585 and swept the liquidity above the previous highs. Price is now showing aggressive rejection.

This indicates smart money has engineered liquidity to fuel a potential reversal. We are now looking for a shift in market structure (SMS) on the lower timeframes (15m/5m) to confirm the bearish bias.

Our primary target is the Sell Side Liquidity (SSL) resting at 1.1457.`
  }
};

const TradeIdeaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const idea = id ? tradeIdeasData[id as keyof typeof tradeIdeasData] : null;

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trade Idea Not Found</h2>
          <Link to="/" className="text-blue-500 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-inter">
      {/* HEADER */}
      <header className="w-full z-50 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#020617]">
        <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="text-xl font-bold tracking-tight">CryptoVaultX</span>
        </Link>
        <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back
        </Link>
      </header>

      {/* ARTICLE */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{idea.title}</h1>
        
        <div className="flex items-center justify-between border-y border-white/10 py-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center font-bold text-sm">
              {idea.author.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold">{idea.author}</p>
              <p className="text-xs text-slate-400">{idea.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-slate-400"><MessageCircle size={18}/> {idea.comments}</span>
              <span className="flex items-center gap-2 text-slate-400">🚀 {idea.likes}</span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
          <img src={idea.image} alt="Chart Analysis" className="w-full h-auto object-cover" />
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-blue">
          {idea.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={index} className="text-xl font-bold mt-8 mb-4">{paragraph.replace(/\*\*/g, '')}</h3>
            }
            if (paragraph.startsWith('- **')) {
                const parts = paragraph.split('**');
                return <li key={index} className="ml-4 list-disc text-slate-300"><strong className="text-white">{parts[1]}</strong>{parts[2]}</li>
            }
            if (paragraph.trim() === '') return <br key={index} />;
            return <p key={index} className="text-slate-300 leading-relaxed mb-6">{paragraph}</p>;
          })}
        </div>
      </main>
    </div>
  );
};

export default TradeIdeaPage;
