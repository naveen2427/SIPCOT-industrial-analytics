import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { BarChart3, Upload, FileCheck, Shield, Building, Map, Layers } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [userStatus, setUserStatus] = React.useState('Pending');
  const [recentCompanies, setRecentCompanies] = React.useState([]);

  React.useEffect(() => {
    const submissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    
    if (user?.role === 'company_admin') {
      const userSub = [...submissions].reverse().find(s => s.company === user.name);
      if (userSub) {
        setUserStatus(userSub.status);
      }
    }
    
    if (user?.role === 'sipcot_admin' || user?.role === 'guest') {
      setRecentCompanies([...submissions].reverse().filter(c => c.type === 'Registration'));
    }
  }, [user]);

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
          
          <div className={`${userStatus === 'Approved' ? 'bg-emerald-50 border-emerald-200' : userStatus === 'Rejected' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} p-6 rounded-xl border flex flex-col items-center text-center transition-colors`}>
            <div className={`w-12 h-12 ${userStatus === 'Approved' ? 'bg-emerald-500' : userStatus === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center mb-4 transition-colors`}>
              <FileCheck size={24} />
            </div>
            <h3 className={`font-semibold ${userStatus === 'Approved' ? 'text-emerald-900' : userStatus === 'Rejected' ? 'text-red-900' : 'text-blue-900'} mb-2`}>
              Status: {userStatus}
            </h3>
            <p className={`text-sm ${userStatus === 'Approved' ? 'text-emerald-700' : userStatus === 'Rejected' ? 'text-red-700' : 'text-blue-700'}`}>
              {userStatus === 'Approved' ? 'Your latest submission was approved' : userStatus === 'Rejected' ? 'Your latest submission was rejected' : 'Your latest submission is under review'}
            </p>
          </div>
          
          <Link to={userStatus === 'Approved' ? `/certificate/${user.id}` : "#"} className={`${userStatus === 'Approved' ? 'bg-purple-50 hover:bg-purple-100 border-purple-200' : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed pointer-events-none'} p-6 rounded-xl border transition-colors flex flex-col items-center text-center group`}>
            <div className={`w-12 h-12 ${userStatus === 'Approved' ? 'bg-purple-500' : 'bg-slate-400'} text-white rounded-full flex items-center justify-center mb-4`}>
              <Shield size={24} />
            </div>
            <h3 className={`font-semibold ${userStatus === 'Approved' ? 'text-purple-900' : 'text-slate-500'} mb-2`}>Download Certificate</h3>
            <p className={`text-sm ${userStatus === 'Approved' ? 'text-purple-700' : 'text-slate-400'}`}>
              {userStatus === 'Approved' ? 'Click to view & download' : 'Available after approval'}
            </p>
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
            <h3 className="font-semibold text-white mb-2">Company Registration Approvals</h3>
            <p className="text-sm text-slate-400">Review and approve new company registrations</p>
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
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Newly Registered Companies</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-semibold text-slate-600">Company Name</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Industry Sector</th>
                <th className="py-3 px-4 font-semibold text-slate-600">SIPCOT Park</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Registration Date</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCompanies.length > 0 ? recentCompanies.slice(0, 5).map((company, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">{company.company}</td>
                  <td className="py-3 px-4 text-slate-600">{company.sector}</td>
                  <td className="py-3 px-4 text-slate-600">{company.park}</td>
                  <td className="py-3 px-4 text-slate-600">{company.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      company.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No recent company registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const GuestDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome, Public Guest</h2>
        <p className="text-slate-600 mb-6">Explore the public industrial analytics, available parks, and registered companies in SIPCOT.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/parks" className="bg-emerald-50 hover:bg-emerald-100 p-6 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map size={24} />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">View Parks</h3>
            <p className="text-sm text-emerald-700">Explore SIPCOT industrial parks</p>
          </Link>
          
          <Link to="/companies" className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl border border-blue-200 flex flex-col items-center text-center transition-colors group">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building size={24} />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Registered Companies</h3>
            <p className="text-sm text-blue-700">Browse companies in the parks</p>
          </Link>
          
          <Link to="/clusters" className="bg-purple-50 hover:bg-purple-100 p-6 rounded-xl border border-purple-200 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Cluster Analysis</h3>
            <p className="text-sm text-purple-700">View industrial sector dominance</p>
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Newly Registered Companies</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-semibold text-slate-600">Company Name</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Industry Sector</th>
                <th className="py-3 px-4 font-semibold text-slate-600">SIPCOT Park</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Registration Date</th>
                <th className="py-3 px-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCompanies.length > 0 ? recentCompanies.slice(0, 5).map((company, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">{company.company}</td>
                  <td className="py-3 px-4 text-slate-600">{company.sector}</td>
                  <td className="py-3 px-4 text-slate-600">{company.park}</td>
                  <td className="py-3 px-4 text-slate-600">{company.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      company.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No recent company registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {user.role === 'company_admin' && <CompanyAdminDashboard />}
      {user.role === 'sipcot_admin' && <SipcotAdminDashboard />}
      {user.role === 'guest' && <GuestDashboard />}
    </div>
  );
};

export default Dashboard;
