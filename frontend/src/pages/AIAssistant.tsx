import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { fetchApi } from '../utils/api';

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Trading Assistant. I can analyze your portfolio, predict market trends, and explain indicators. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        
        const userText = input;
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setInput('');
        setLoading(true);
        
        try {
            const data = await fetchApi('/api/ai/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: userText })
            });
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: data.answer || "I'm sorry, I couldn't process your request." 
            }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Error: ${error.message || 'Failed to connect to AI server.'}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] space-y-6">
            <h1 className="text-3xl font-bold font-heading text-primary">AI Trading Assistant</h1>
            
            <div className="flex-1 glassmorphism rounded-2xl border border-white/10 overflow-hidden flex flex-col relative">
                {/* Glowing Orb Background */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                msg.role === 'user' ? 'bg-secondary' : 'bg-primary'
                            }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`max-w-[70%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-secondary/20 text-primary rounded-tr-none border border-secondary/30' 
                                    : 'bg-black/40 text-gray-200 rounded-tl-none border border-white/5'
                            }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary">
                                <Bot size={20} />
                            </div>
                            <div className="max-w-[70%] p-4 rounded-2xl bg-black/40 text-gray-200 rounded-tl-none border border-white/5">
                                <p className="leading-relaxed animate-pulse">Thinking...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/40 z-10">
                    <div className="flex gap-4 relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your portfolio, market trends, or technical analysis..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-primary outline-none focus:border-primary/50 transition-colors"
                            disabled={loading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-primary text-primary p-4 rounded-xl hover:bg-primary/80 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
