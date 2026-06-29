import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, LogIn, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('company_admin');
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const submissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    const approved = submissions.filter(s => s.status === 'approved');
    setApprovedCompanies(approved);
  }, []);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first to reset your password.");
      return;
    }
    const newPass = window.prompt(`Enter a new password for ${email}:`);
    if (newPass) {
      localStorage.setItem(`company_password_${email}`, newPass);
      setError('');
      alert(`Password updated successfully! You can now log in with your new password.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const emailParts = email.split('@');
      if (emailParts.length !== 2) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      
      const { apiCall } = await import('../utils/api');
      
      const responseData = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role: roleType, password })
      });

      login({
        ...responseData.user,
        token: responseData.token
      });
      
      if (roleType === 'company_admin') {
        navigate(`/companies/${responseData.user.id || 'company-id'}`);
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGuest = () => {
    login({
      id: 'guest-id',
      name: 'Guest',
      email: 'guest@public.com',
      role: 'guest',
      token: 'guest-token'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 mt-16">
      
      {/* Background Blobs for Login */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 glass-dark border border-emerald-500/20 p-10 rounded-3xl z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>
        
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transform rotate-3">
            <Building2 className="h-10 w-10 text-emerald-400 transform -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Secure access to the SIPCOT portal
          </p>
        </div>

        <div className="flex bg-[#09090b]/80 p-1.5 rounded-xl border border-white/5 relative z-20">
          <button
            onClick={() => setRoleType('company_admin')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              roleType === 'company_admin'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Company Admin
          </button>
          <button
            onClick={() => setRoleType('sipcot_admin')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              roleType === 'sipcot_admin'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Website Admin
          </button>
        </div>
        
        <form className="mt-8 space-y-6 relative z-20" onSubmit={handleSubmit}>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
              {error}
            </motion.div>
          )}
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-end mb-1.5 ml-1">
                <label className="block text-sm font-medium text-slate-300">Email Address</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-white/10 rounded-xl bg-[#09090b]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                  placeholder={roleType === 'sipcot_admin' ? "admin@sipcot.com" : "admin@company.com"}
                />
              </div>

              {roleType === 'company_admin' && approvedCompanies.length > 0 && (
                <div className="mt-3 ml-1">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Approved Company Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {approvedCompanies.map(company => {
                      const domain = company.company.toLowerCase().replace(/\s+/g, '') + '.com';
                      const suggEmail = `admin@${domain}`;
                      return (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => {
                            setEmail(suggEmail);
                          }}
                          className="text-xs px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all"
                        >
                          {company.company}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-white/10 rounded-xl bg-[#09090b]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090b] focus:ring-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-70 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-emerald-100" />
                  Sign In to Dashboard
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleGuest}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all group"
            >
              <User className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              Continue as Guest
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </form>
        
        <div className="text-center mt-8 relative z-20">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-all">
              Register your company
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
