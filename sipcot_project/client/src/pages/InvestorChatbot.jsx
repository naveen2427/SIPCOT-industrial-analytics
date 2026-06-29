import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldCheck, AlertCircle, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COMPANIES = {
  'samsung': { name: 'Samsung Electronics', status: 'Approved', certId: 'CERT-2025-001', score: 87, cluster: 'Electronics Hub', investment: '₹1200 Cr' },
  'tcs': { name: 'TCS', status: 'Approved', certId: 'CERT-2025-055', score: 95, cluster: 'IT Hub', investment: '₹1500 Cr' },
  'hyundai': { name: 'Hyundai', status: 'Approved', certId: 'CERT-2025-032', score: 85, cluster: 'Automotive Hub', investment: '₹5000 Cr' },
  'tvs': { name: 'TVS Motors', status: 'Pending', score: 78 },
  'sun pharma': { name: 'Sun Pharma', status: 'Rejected', score: 45 },
};

const InvestorChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am the SIPCOT AI Investor Advisor. I can help you evaluate companies based on their verified authenticity certificates and growth metrics. How can I assist your investment research today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();
    
    // Check for specific companies
    for (const [key, data] of Object.entries(MOCK_COMPANIES)) {
      if (q.includes(key)) {
        if (data.status === 'Approved') {
          return `${data.name} is authenticated by SIPCOT with certificate ID ${data.certId}. It belongs to the ${data.cluster}, has an excellent growth score of ${data.score}/100, and shows strong investment of ${data.investment}. It is highly recommended for investor evaluation.`;
        } else if (data.status === 'Pending') {
          return `${data.name}'s authenticity verification is still pending. They currently have a preliminary score of ${data.score}/100, but I cannot recommend them for investment until their certificate is officially approved by SIPCOT admins.`;
        } else {
          return `I cannot provide investment suggestions for ${data.name}. Their authenticity request has been rejected or they are not verified.`;
        }
      }
    }

    // General queries
    if (q.includes('suggest') || q.includes('recommend')) {
      if (q.includes('electronics')) {
        return "Based on verified data, I suggest evaluating Samsung Electronics. They are authenticated (CERT-2025-001) in the Electronics Hub with a high growth score of 87/100 and strong investment track record.";
      } else if (q.includes('it') || q.includes('software')) {
        return "TCS is a highly recommended verified company in the IT Hub. They hold an approved authenticity certificate and boast a top-tier growth score of 95/100.";
      }
      return "I can suggest several verified companies. Are you interested in a specific sector like Electronics, Automotive, or IT?";
    }

    if (q.includes('growth') || q.includes('highest')) {
      return "Currently, TCS holds the highest growth score (95/100) among verified companies, followed by Foxconn (92/100). Both have approved authenticity certificates and show exceptional revenue and employment growth.";
    }

    return "I analyze companies based strictly on SIPCOT verified certificates and growth data. You can ask me about specific companies (like Hyundai or TCS) or ask for recommendations in a specific sector.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, type: 'bot', text: generateResponse(userMessage.text) };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Investor Advisor</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Get intelligent investment insights based strictly on authenticated company data and growth metrics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-grow">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={20} /> Data Integrity
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                This AI strictly uses SIPCOT verified data. It will never recommend unverified, pending, or rejected companies to investors.
              </p>
              
              <h4 className="font-semibold text-slate-700 text-sm mb-3">Suggested Queries:</h4>
              <div className="space-y-2">
                {[
                  "Tell me about Samsung Electronics",
                  "Suggest a verified company in IT sector",
                  "Which company has the best growth?",
                  "Is TVS Motors safe to invest?"
                ].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(q)}
                    className="block w-full text-left text-xs bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-100 hover:border-emerald-200 p-3 rounded-lg transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                    <Bot size={20} className="text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">SIPCOT InvestBot</h2>
                  <p className="text-emerald-400 text-xs flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Data Source
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0 mt-1">
                      {msg.type === 'user' ? (
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <User size={16} className="text-slate-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/20">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-sm shadow-md shadow-slate-800/10' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.text}
                      {msg.type === 'bot' && msg.id !== 1 && msg.text.includes('authenticated') && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2 rounded inline-flex">
                          <ShieldCheck size={14} /> SIPCOT Verified Match
                        </div>
                      )}
                      {msg.type === 'bot' && (msg.text.includes('pending') || msg.text.includes('cannot recommend')) && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 p-2 rounded inline-flex">
                          <AlertCircle size={14} /> Unverified Status
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a company or sector..."
                  className="w-full pl-4 pr-12 py-4 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorChatbot;
