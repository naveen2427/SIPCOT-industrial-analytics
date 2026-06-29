import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ShieldCheck, Map, TrendingUp, Cpu, Bot } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-16 pb-32">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
            >
              Next-Gen <span className="text-emerald-400">SIPCOT</span> Industrial Management
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            >
              A premium analytics and certification platform for companies within the State Industries Promotion Corporation of Tamil Nadu.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1">
                Register Company
              </Link>
              <Link to="/chatbot" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2">
                <Bot size={20} className="text-emerald-400" /> AI Investor Chat
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-20 -mt-10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Industrial Analytics</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive tools for company authentication, clustering, and investment intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-emerald-100 transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Authenticity Verification</h3>
              <p className="text-slate-600">Secure PDF upload and administrative approval pipeline generating tamper-proof digital certificates.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-blue-100 transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Map className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cluster Analysis</h3>
              <p className="text-slate-600">AI-driven sector clustering mapping dominant industries across various SIPCOT parks automatically.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-purple-100 transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Growth Metrics</h3>
              <p className="text-slate-600">Advanced scoring algorithms calculating combined growth in investment, employment, and revenue.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Overview Stats */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-emerald-400 mb-2">24+</div>
              <div className="text-slate-400 font-medium text-sm tracking-wider uppercase">Industrial Parks</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-400 mb-2">3500+</div>
              <div className="text-slate-400 font-medium text-sm tracking-wider uppercase">Verified Companies</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-400 mb-2">₹4.5T</div>
              <div className="text-slate-400 font-medium text-sm tracking-wider uppercase">Total Investment</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-400 mb-2">1.2M</div>
              <div className="text-slate-400 font-medium text-sm tracking-wider uppercase">Employment Gen</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
