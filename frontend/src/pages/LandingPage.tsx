import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PlayCircle, Star, Crown, MessageCircle, AlertTriangle, Shield, Calendar, Globe2, ChevronDown } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import Logo from '../components/Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-inter overflow-hidden">
      
      {/* HEADER / NAV */}
      <header className="absolute top-0 w-full z-50 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="text-xl font-bold tracking-tight">CryptoVaultX</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#plans" className="hover:text-white transition-colors">Plans</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#rules" className="hover:text-white transition-colors">Rules</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="btn-primary py-2 text-sm shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]">
            Start Now
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-40 pb-20 min-h-[800px] flex items-center border-b border-white/5">
        {/* Background Image for Right Side (Portrait Style) */}
        <div className="absolute right-0 top-0 w-full md:w-[60%] h-full z-0 opacity-80 md:opacity-100">
             <div className="absolute inset-0 bg-[url('/hero-user.jpg')] bg-cover bg-[center_top_20%]"></div>
             {/* Gradient masks to blend the image seamlessly */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
        
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center relative z-10">
          <div className="flex-1 space-y-8 max-w-2xl py-10">
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Cryptocurrency <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Exchange</span> <br/>
              & Wallet Management System
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              CryptoVaultX gives skilled traders access to professional capital through a modern evaluation experience built for performance.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link to="/register" className="btn-primary px-8 py-4 text-base font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Start Challenge <ArrowRight size={20} />
              </Link>
              <Link 
                to="/tutorials" 
                className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-2 font-medium"
              >
                <PlayCircle size={20} /> Watch How It Works
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-8 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16} /> Instant Dashboard</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16} /> Fast Withdrawals</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16} /> Professional Support</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16} /> B3 & Forex</div>
            </div>
          </div>

          <div className="flex-1 hidden md:block relative h-[600px]">
             {/* Floating UI Elements */}


          </div>
        </div>
      </section>
      {/* MARKET SHOWCASE */}
      <section className="py-24 px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] -z-10"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Where the world does markets</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">
              Join 100 million traders and investors taking the future into their own hands.
          </p>
          
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-blue-500/30 p-2 bg-[#020617] shadow-[0_0_80px_rgba(37,99,235,0.4)]">
              <img src="/trading-showcase.jpg" alt="Trading Interface" className="w-full rounded-xl border border-white/10" />
          </div>
      </section>

      {/* TRADE IDEAS */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
          <Link to="/markets" className="inline-block"><h2 className="text-3xl font-bold mb-8 flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer w-fit">Forex and currencies <ArrowRight className="text-blue-500"/></h2></Link>
          <Link to="/trade" className="inline-block"><h3 className="text-2xl font-bold mb-12 flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer w-fit">Trade ideas <ArrowRight className="text-blue-500"/></h3></Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Idea 1 */}
              <Link to="/trade-idea/eurusd-breakout" className="block bg-[#0b1426] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform group cursor-pointer shadow-lg hover:shadow-blue-900/20">
                  <div className="h-48 overflow-hidden relative border-b border-white/5">
                      <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop" alt="Chart" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                      <h4 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition-colors">EURUSD Breakout and Potential Retrace!</h4>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-3">Hey Traders, in today's trading session we are monitoring EURUSD for a buying opportunity around 1.15500 zone...</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                          <div>
                              <p className="text-white font-medium mb-1 hover:text-blue-400">by JoeChampion</p>
                              <p>Updated 20 hours ago</p>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 hover:text-white transition-colors"><MessageCircle size={14}/> 5</span>
                              <span className="flex items-center gap-1 hover:text-white transition-colors">🚀 9</span>
                          </div>
                      </div>
                  </div>
              </Link>
              {/* Idea 2 */}
              <Link to="/trade-idea/gbpusd-pullback" className="block bg-[#0b1426] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform group cursor-pointer shadow-lg hover:shadow-blue-900/20">
                  <div className="h-48 overflow-hidden relative border-b border-white/5">
                      <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop" alt="Chart" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                      <h4 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition-colors">GBP/USD Bullish Pullback Setup</h4>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-3">GBP/USD is holding above a rising trendline, maintaining a bullish structure despite the recent rejection from resistance zone.</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                          <div>
                              <p className="text-white font-medium mb-1 hover:text-blue-400">by SMART_MONEY_CIRCLE</p>
                              <p>Updated 17 hours ago</p>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 hover:text-white transition-colors"><MessageCircle size={14}/> 6</span>
                              <span className="flex items-center gap-1 hover:text-white transition-colors">🚀 7</span>
                          </div>
                      </div>
                  </div>
              </Link>
              {/* Idea 3 */}
              <Link to="/trade-idea/xauusd-swept" className="block bg-[#0b1426] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform group cursor-pointer shadow-lg hover:shadow-blue-900/20">
                  <div className="h-48 overflow-hidden relative border-b border-white/5">
                      <img src="https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop" alt="Chart" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                      <h4 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition-colors">BSL Swept, Is 1.1457 Next? | XAUUSD</h4>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-3">EURUSD has reached the H4 BSL around 1.1575-1.1585 and swept the liquidity above the previous highs. Price is now showing rejection.</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                          <div>
                              <p className="text-white font-medium mb-1 hover:text-blue-400">by Adrian_NovaTrader</p>
                              <p>22 hours ago</p>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 hover:text-white transition-colors"><MessageCircle size={14}/> 3</span>
                              <span className="flex items-center gap-1 hover:text-white transition-colors">🚀 8</span>
                          </div>
                      </div>
                  </div>
              </Link>
          </div>
      </section>

      {/* GLOBAL ECONOMY MAP */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
          <Link to="/analytics" className="inline-block"><h2 className="text-3xl font-bold mb-6 flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer w-fit">Economy <ArrowRight className="text-blue-500"/></h2></Link>
          <Link to="/analytics" className="inline-block"><h3 className="text-xl font-bold mb-12 flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer w-fit">Global inflation map <ArrowRight className="text-blue-500"/></h3></Link>
          
          <div className="relative w-full h-[600px] mt-8 group">
              <InteractiveMap />
          </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h4 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">The Process</h4>
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-slate-400 max-w-xl mx-auto">A streamlined evaluation process designed to identify and fund consistent traders.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#0b1426] via-blue-900 to-[#0b1426] z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 bg-[#0b1426] border border-white/5 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform shadow-lg">
                  <div className="w-24 h-24 bg-[#020617] rounded-full border-4 border-[#0b1426] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                      <span className="text-3xl font-bold text-blue-500">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Evaluation</h3>
                  <p className="text-slate-400 text-sm">Prove your trading skills by hitting the profit target while managing risk effectively in a simulated environment.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 bg-[#0b1426] border border-white/5 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform shadow-lg">
                  <div className="w-24 h-24 bg-[#020617] rounded-full border-4 border-[#0b1426] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                      <span className="text-3xl font-bold text-cyan-400">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Verification</h3>
                  <p className="text-slate-400 text-sm">Demonstrate consistency. Hit a lower profit target to confirm your strategy is robust and ready for real capital.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 bg-[#0b1426] border border-white/5 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform shadow-lg">
                  <div className="w-24 h-24 bg-[#020617] rounded-full border-4 border-[#0b1426] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                      <span className="text-3xl font-bold text-blue-400">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Funded</h3>
                  <p className="text-slate-400 text-sm">Trade with CryptoVaultX capital. Keep up to 90% of your profits with regular bi-weekly payouts.</p>
              </div>
          </div>
      </section>

      {/* RULES */}
      <section id="rules" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h4 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">Trading Parameters</h4>
              <h2 className="text-4xl font-bold mb-4">Fair & Transparent Rules</h2>
              <p className="text-slate-400 max-w-xl mx-auto">We provide a realistic trading environment with rules designed to foster long-term success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0b1426] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                      <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">5% Daily Loss Limit</h3>
                  <p className="text-sm text-slate-400">Your account equity cannot drop below 5% of the initial starting balance in a single day.</p>
              </div>
              
              <div className="bg-[#0b1426] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                      <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">10% Trailing Drawdown</h3>
                  <p className="text-sm text-slate-400">The maximum overall loss allowed is 10% from the highest recorded equity peak.</p>
              </div>

              <div className="bg-[#0b1426] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                      <Calendar size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Minimum 5 Trading Days</h3>
                  <p className="text-sm text-slate-400">You must execute at least one trade on 5 separate days during the evaluation phase.</p>
              </div>

              <div className="bg-[#0b1426] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                      <Globe2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">News & Weekend Holding</h3>
                  <p className="text-sm text-slate-400">Trading during major news events and holding positions over the weekend is fully allowed on Swing accounts.</p>
              </div>
          </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 border-y border-white/5 bg-slate-900/50">
          <p className="text-center text-sm text-slate-400 mb-8">Are Trusted companies all around the world</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold">XM</span>
              <span className="text-xl font-bold">IC Markets</span>
              <span className="text-xl font-bold">MONETA MARKETS</span>
              <span className="text-xl font-bold">RoboForex</span>
              <span className="text-xl font-bold">fpmarkets</span>
              <span className="text-xl font-bold">BlackBull</span>
          </div>
      </section>

      {/* PRICING PLANS */}
      <section id="plans" className="py-32 px-8 max-w-7xl mx-auto relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
         <div className="text-center mb-16">
             <h4 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">Pricing Plan</h4>
             <h2 className="text-4xl font-bold">Choose Your Trading Challenge</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {/* Starter */}
             <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                 <div className="inline-block px-4 py-1 rounded-full border border-white/10 text-xs font-semibold mb-6">Starter Plan</div>
                 <h3 className="text-4xl font-bold mb-2">₹25K</h3>
                 <p className="text-sm text-slate-400 mb-8 h-10">Maximum Capital Access</p>
                 
                 <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Beginner friendly</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Professional environment</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Performance-focused structure</div>
                 </div>
                 <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">Start Now</button>
             </div>

             {/* Growth */}
             <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                 <div className="inline-block px-4 py-1 rounded-full border border-white/10 text-xs font-semibold mb-6">Growth Plan</div>
                 <h3 className="text-4xl font-bold mb-2">₹50K</h3>
                 <p className="text-sm text-slate-400 mb-8 h-10">Balanced & Popular Choice</p>
                 
                 <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Flexible evaluation</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Accessible entry point</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Full platform access</div>
                 </div>
                 <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">Start Now</button>
             </div>

             {/* Pro (Highlighted) */}
             <div className="bg-gradient-to-b from-[#1e3a8a]/40 to-[#0b1120] border border-blue-500/30 rounded-3xl p-8 transform md:-translate-y-4 shadow-[0_0_40px_rgba(37,99,235,0.15)] relative">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500"><Crown size={40} className="drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" fill="currentColor"/></div>
                 <div className="flex justify-center mb-6">
                    <div className="px-6 py-1 rounded-full bg-blue-600 text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">Pro Plan</div>
                 </div>
                 <h3 className="text-4xl font-bold mb-2 text-center text-blue-400">₹100K</h3>
                 <p className="text-sm text-slate-300 mb-8 text-center h-10">Advanced Traders Choice</p>
                 
                 <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-400" /> Balanced scalability</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-400" /> Competitive objectives</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-400" /> Ideal for experienced traders</div>
                 </div>
                 <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">Start Now</button>
             </div>

             {/* Elite */}
             <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                 <div className="inline-block px-4 py-1 rounded-full border border-white/10 text-xs font-semibold mb-6">Elite Plan</div>
                 <h3 className="text-4xl font-bold mb-2">₹150K</h3>
                 <p className="text-sm text-slate-400 mb-8 h-10">Maximum Capital Access</p>
                 
                 <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Highest scaling potential</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Professional conditions</div>
                     <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-blue-500" /> Priority support</div>
                 </div>
                 <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">Start Now</button>
             </div>
         </div>

         {/* Banner */}
         <div className="mt-16 w-full rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-12 flex flex-col md:flex-row items-center justify-between shadow-[0_0_50px_rgba(37,99,235,0.3)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
             <div className="relative z-10 max-w-xl">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready To Operate Like A Professional?</h2>
                 <p className="text-blue-100 text-lg">Join traders building consistent performance with institutional infrastructure.</p>
             </div>
             <Link to="/login" className="relative z-10 mt-8 md:mt-0 px-8 py-4 bg-[#1e1b4b] hover:bg-[#312e81] text-white rounded-xl font-bold transition-colors shadow-xl inline-block text-center">
                 Start Challenge
             </Link>
         </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-8 max-w-4xl mx-auto">
          <div className="text-center mb-16">
              <h4 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">Support</h4>
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
              <div className="bg-[#0b1426] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-white">When do I get paid?</h3>
                      <ChevronDown className="text-slate-400" />
                  </div>
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed">
                      Payouts are processed bi-weekly. Once you pass the verification stage and operate on a funded account, you can request your first payout 14 days after your first trade.
                  </div>
              </div>

              <div className="bg-[#0b1426] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-white">What platforms do you offer?</h3>
                      <ChevronDown className="text-slate-400" />
                  </div>
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed">
                      We currently offer seamless integration with MetaTrader 4, MetaTrader 5, and cTrader to suit your trading preferences.
                  </div>
              </div>

              <div className="bg-[#0b1426] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-white">Are there hidden fees?</h3>
                      <ChevronDown className="text-slate-400" />
                  </div>
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed">
                      No. The evaluation fee is a one-time upfront cost. There are no recurring monthly charges or hidden data fees. Best of all, your evaluation fee is fully refunded with your first payout.
                  </div>
              </div>

              <div className="bg-[#0b1426] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-white">Can I merge accounts?</h3>
                      <ChevronDown className="text-slate-400" />
                  </div>
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed">
                      Yes! You can merge multiple funded accounts up to a maximum total capital allocation of R$300K to simplify your risk management and trading execution.
                  </div>
              </div>
          </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-24 px-8 max-w-7xl mx-auto border-t border-white/5">
         <div className="text-center mb-16">
             <h4 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">Reviews</h4>
             <h2 className="text-4xl font-bold mb-4">What Traders Are Saying</h2>
             <p className="text-slate-400 max-w-xl mx-auto">Real feedback from traders who joined, passed evaluations, and are now trading funded accounts.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Review 1 */}
             <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 col-span-1">
                <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-green-500" fill="currentColor" />)}
                </div>
                <p className="text-sm text-slate-300 italic mb-6">"The process was fast and seamless. After I hit the payout button it took minutes for reward to show up..."</p>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center font-bold">AT</div>
                    <div>
                        <p className="font-bold text-sm">Alex T.</p>
                        <p className="text-xs text-slate-500">Program Participant</p>
                    </div>
                </div>
             </div>
             
             {/* Highlight Metric */}
             <div className="bg-slate-200 text-slate-900 rounded-3xl p-8 col-span-1 flex flex-col items-center justify-center text-center">
                 <h3 className="text-6xl font-black mb-2">4.80</h3>
                 <p className="font-medium text-slate-600 mb-4">4525 Reviews</p>
                 <div className="flex gap-2 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-yellow-500" fill="currentColor" />)}
                 </div>
                 <h4 className="text-xl font-bold font-serif italic">Trusted in tens of thousands of customers</h4>
             </div>

             {/* Review 2 */}
             <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-8 col-span-1">
                <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-green-500" fill="currentColor" />)}
                </div>
                <p className="text-sm text-slate-300 italic mb-6">"I heard for CryptoVaultX its the best propfirm and i love to be trader in this propfirm..."</p>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center font-bold">OR</div>
                    <div>
                        <p className="font-bold text-sm">Olivia R.</p>
                        <p className="text-xs text-slate-500">Director of People</p>
                    </div>
                </div>
             </div>
         </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.4)]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=2000')] mix-blend-overlay opacity-30 bg-cover bg-center"></div>
              <div className="relative z-10">
                <p className="text-blue-200 font-bold tracking-widest uppercase mb-4 text-sm">Get Started</p>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Start Your <br/>Funding Journey?</h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join traders who are already scaling with real capital and structured evaluation.</p>
                <a href="https://wa.me/917810076395" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 max-w-xs mx-auto hover:bg-slate-900 transition-colors">
                    <MessageCircle size={20} className="text-green-400" /> Chat on Whatsapp
                </a>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 pt-20 pb-10 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <Logo className="w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">CryptoVaultX</span>
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold mb-6">Quick Links</h4>
                  <ul className="space-y-4 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-blue-400 transition-colors">How It Works</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Funding Plans</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Payouts</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Reviews</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold mb-6">Trading Programs</h4>
                  <ul className="space-y-4 text-sm text-slate-400">
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Starter Challenge</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Growth Challenge</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Pro Challenge</a></li>
                      <li><a href="#" className="hover:text-blue-400 transition-colors">Elite Funding</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold mb-6">Contact Information</h4>
                  <div className="space-y-6">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                                <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75V40h7.5C43.881,40,45,38.881,45,37.5V16.2z"></path>
                                <path fill="#1e88e5" d="M3,16.2l5,2.75l5,4.75V40H5.5C4.119,40,3,38.881,3,37.5V16.2z"></path>
                                <path fill="#e53935" d="M35,11.2l-11,8.25L13,11.2l-2.094-1.57C10.155,9.066,9,9.458,9,10.364V16.2l15,11.25l15-11.25V10.364 c0-0.906-1.155-1.298-1.906-0.734L35,11.2z"></path>
                                <path fill="#fbc02d" d="M45,16.2V10.364c0-0.906-1.155-1.298-1.906-0.734L35,16.25v7.5L45,16.2z"></path>
                                <path fill="#e53935" d="M3,16.2V10.364c0-0.906,1.155-1.298,1.906-0.734L13,16.25v7.5L3,16.2z"></path>
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm font-bold">Email</p>
                              <p className="text-sm text-blue-400">vmshiva5@gmail.com</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm text-slate-400">Whatsapp support available 24/7</p>
                              <p className="text-lg font-bold text-blue-400">+91 78100 76395</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="max-w-7xl mx-auto text-xs text-slate-600 leading-relaxed text-justify border-t border-white/5 pt-8">
              Trading involves substantial risk and may not be suitable for all individuals. Past performance does not guarantee future results, profits, or earnings, and trading outcomes can vary significantly based on market conditions and individual performance. CryptoVaultX provides evaluation and funding programs for educational and performance assessment purposes only and does not offer financial investment advice.
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
