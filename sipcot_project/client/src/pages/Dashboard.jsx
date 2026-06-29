import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { BarChart3, Upload, FileCheck, Shield, Building } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const CompanyAdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome, {user.name}</h2>
        <p className="text-slate-600 mb-6">Manage your company profile, view authenticity status, and upload required documents.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/upload" className="bg-emerald-50 hover:bg-emerald-100 p-6 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">Upload Document</h3>
            <p className="text-sm text-emerald-700">Submit company details PDF for authentication</p>
          </Link>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4">
              <FileCheck size={24} />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Status: Pending</h3>
            <p className="text-sm text-blue-700">Your latest submission is under review</p>
          </div>
          
          <Link to={`/certificate/${user.id}`} className="bg-purple-50 hover:bg-purple-100 p-6 rounded-xl border border-purple-200 transition-colors flex flex-col items-center text-center group opacity-50 cursor-not-allowed pointer-events-none">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Download Certificate</h3>
            <p className="text-sm text-purple-700">Available after approval</p>
          </Link>
        </div>
      </div>
    </div>
  );

  const SipcotAdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">SIPCOT Admin Portal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin" className="bg-slate-800 hover:bg-slate-900 p-6 rounded-xl border border-slate-700 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Verify Submissions</h3>
            <p className="text-sm text-slate-400">Review pending company PDF uploads</p>
          </Link>
          
          <Link to="/analytics" className="bg-slate-800 hover:bg-slate-900 p-6 rounded-xl border border-slate-700 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-slate-400">View overall industrial growth metrics</p>
          </Link>
          
          <Link to="/clusters" className="bg-slate-800 hover:bg-slate-900 p-6 rounded-xl border border-slate-700 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">Cluster Management</h3>
            <p className="text-sm text-slate-400">Analyze sector-wise dominance</p>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {user.role === 'company_admin' && <CompanyAdminDashboard />}
      {user.role === 'sipcot_admin' && <SipcotAdminDashboard />}
    </div>
  );
};

export default Dashboard;
