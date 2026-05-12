import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, Menu, User, BarChart2, Briefcase, FileText, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark border-b border-emerald-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-[#09090b] border border-emerald-500/30 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">
              SIPCOT <span className="text-emerald-500 font-light hidden sm:inline text-glow">Analytics</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1 glass rounded-full px-2 py-1">
              <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all">Home</Link>
              <Link to="/parks" className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all">Parks</Link>
              <Link to="/companies" className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all">Companies</Link>
              <Link to="/clusters" className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all">Clusters</Link>
              <Link to="/analytics" className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-all">Analytics</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <User size={14} />
                  {user.role}
                </span>
                <Link to="/dashboard" className="text-sm font-medium hover:text-emerald-400 flex items-center gap-2 transition-colors">
                  <BarChart2 size={16} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
