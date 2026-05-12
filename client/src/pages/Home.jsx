import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ShieldCheck, Map, TrendingUp, Cpu, Bot, ArrowRight, Activity, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]"></div>
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Zap size={16} />
              <span>SIPCOT Analytics v2.0 is now live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
            >
              Next-Gen <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 text-glow">
                Industrial Intelligence
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              A premium analytics and certification platform for companies within the State Industries Promotion Corporation of Tamil Nadu. Connect, analyze, and scale with verified data.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/register" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:-translate-y-1 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                Register Company
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/chatbot" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 glass-dark hover:bg-white/5 border-slate-700 hover:border-emerald-500/50 text-white font-semibold py-4 px-10 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Bot size={22} className="text-emerald-400 group-hover:animate-pulse" /> AI Investor Chat
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Stats - Glassmorphic */}
      <section className="pb-24 relative z-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-dark border-t border-b border-l-0 border-r-0 md:border md:rounded-3xl p-10 backdrop-blur-2xl grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center relative overflow-hidden"
          >
            {/* Inner glow line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            
            <div className="relative z-10 group cursor-default">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 group-hover:from-emerald-300 group-hover:to-teal-500 transition-all duration-500">24+</div>
              <div className="text-emerald-400/80 font-semibold tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                <Map size={14} /> Industrial Parks
              </div>
            </div>
            <div className="relative z-10 group cursor-default">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 group-hover:from-emerald-300 group-hover:to-teal-500 transition-all duration-500">3.5k</div>
              <div className="text-emerald-400/80 font-semibold tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                <Building size={14} /> Verified Companies
              </div>
            </div>
            <div className="relative z-10 group cursor-default">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 group-hover:from-emerald-300 group-hover:to-teal-500 transition-all duration-500">₹4.5T</div>
              <div className="text-emerald-400/80 font-semibold tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                <TrendingUp size={14} /> Total Investment
              </div>
            </div>
            <div className="relative z-10 group cursor-default">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2 group-hover:from-emerald-300 group-hover:to-teal-500 transition-all duration-500">1.2M</div>
              <div className="text-emerald-400/80 font-semibold tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                <Activity size={14} /> Employment Gen
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Industrial Analytics</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Comprehensive tools built with cutting-edge technology for company authentication, dynamic clustering, and actionable intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-emerald rounded-3xl p-10 glass-card transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Authenticity Verification</h3>
              <p className="text-slate-400 leading-relaxed">Secure PDF upload and advanced administrative approval pipeline generating tamper-proof digital certificates secured by cryptographic hashing.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-emerald rounded-3xl p-10 glass-card transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Map className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Dynamic Clustering</h3>
              <p className="text-slate-400 leading-relaxed">AI-driven sector clustering mapping dominant industries across various SIPCOT parks automatically, uncovering hidden supply chain opportunities.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-emerald rounded-3xl p-10 glass-card transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-400/30 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Cpu className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Predictive Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Advanced scoring algorithms calculating combined growth in investment, employment, and revenue to predict future industrial trends.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

