import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, Menu, User, BarChart2, Briefcase, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-emerald-500" />
            <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">
              SIPCOT <span className="text-emerald-500 font-light hidden sm:inline">Analytics</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">Home</Link>
              <Link to="/parks" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">Parks</Link>
              <Link to="/companies" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">Companies</Link>
              <Link to="/clusters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">Clusters</Link>
              <Link to="/analytics" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">Analytics</Link>
              <Link to="/chatbot" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-emerald-400 transition-colors">AI Investor</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                  <User size={16} className="text-emerald-500" />
                  {user.role}
                </span>
                <Link to="/dashboard" className="text-sm font-medium hover:text-emerald-400 flex items-center gap-1">
                  <BarChart2 size={16} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium hover:text-emerald-400 transition-colors">Login</Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">Register</Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
