import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, X, Eye, FileText, Search, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultMockSubmissions = [
  { id: 101, type: 'Certificate', company: 'NextGen Auto Parts', sector: 'Automotive', park: 'Oragadam', date: '2025-04-22', status: 'Pending', document: 'company_profile.pdf' },
  { id: 102, type: 'Certificate', company: 'Quantum Tech Solutions', sector: 'IT Services', park: 'Siruseri', date: '2025-04-23', status: 'Pending', document: 'financials_2024.pdf' },
  { id: 103, type: 'Certificate', company: 'BioHealth Pharma', sector: 'Pharmaceuticals', park: 'Alathur', date: '2025-04-20', status: 'Approved', document: 'profile_verified.pdf' },
  { id: 104, type: 'Certificate', company: 'EcoThreads', sector: 'Textiles', park: 'Tiruppur', date: '2025-04-24', status: 'Pending', document: 'ecothreads_data.pdf' },
];

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [requestType, setRequestType] = useState('Registration');

  useEffect(() => {
    const localSubs = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    setSubmissions([...localSubs, ...defaultMockSubmissions]);
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || user.role !== 'sipcot_admin') return <Navigate to="/login" />;

  const filteredSubmissions = submissions.filter(s => s.status === activeTab && (s.type === requestType || (!s.type && requestType === 'Certificate')));

  const handleAction = (id, action) => {
    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    const updatedSubmissions = submissions.map(s => {
      if (s.id === id) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    setSubmissions(updatedSubmissions);
    
    // Extract local subs to update localStorage
    const localSubs = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    const updatedLocalSubs = localSubs.map(s => {
      if (s.id === id) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    localStorage.setItem('mockSubmissions', JSON.stringify(updatedLocalSubs));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Verification Panel</h1>
            <p className="text-slate-600">Review company documents and issue authenticity certificates.</p>
          </div>
          
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setRequestType('Registration')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                requestType === 'Registration' 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Company Registrations
            </button>
            <button
              onClick={() => setRequestType('Certificate')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                requestType === 'Certificate' 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Certificate Approvals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-amber-300 hover:shadow-md transition-all" onClick={() => setActiveTab('Pending')}>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <Clock size={24} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{submissions.filter(s => s.status === 'Pending' && (s.type === requestType || (!s.type && requestType === 'Certificate'))).length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Review</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all" onClick={() => setActiveTab('Approved')}>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{submissions.filter(s => s.status === 'Approved' && (s.type === requestType || (!s.type && requestType === 'Certificate'))).length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Approved</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-300 hover:shadow-md transition-all" onClick={() => setActiveTab('Rejected')}>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
              <X size={24} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{submissions.filter(s => s.status === 'Rejected' && (s.type === requestType || (!s.type && requestType === 'Certificate'))).length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Rejected</div>
          </div>
          
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="text-white font-bold mb-2 relative z-10">Generate Certificates</h3>
            <p className="text-slate-400 text-sm mb-4 relative z-10">Automated PDF generation upon approval.</p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium relative z-10">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              {activeTab === 'Pending' && <Clock className="text-amber-500" size={20} />}
              {activeTab === 'Approved' && <Check className="text-emerald-500" size={20} />}
              {activeTab === 'Rejected' && <X className="text-red-500" size={20} />}
              {activeTab} Submissions
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Company Info</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Location / Sector</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Submission Date</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Document</th>
                  {activeTab === 'Pending' && <th className="p-4 font-semibold text-slate-600 text-sm text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                  <motion.tr 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{sub.company}</div>
                      <div className="text-xs text-slate-500 mt-1">ID: SUB-{sub.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-700">{sub.park}</div>
                      <div className="text-xs text-slate-500 mt-1">{sub.sector}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{sub.date}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors border border-blue-200"
                      >
                        <Eye size={14} /> View PDF
                      </button>
                    </td>
                    {activeTab === 'Pending' && (
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleAction(sub.id, 'approve')}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-200 hover:border-emerald-500 tooltip-wrapper"
                            title="Approve & Generate Certificate"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(sub.id, 'reject')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200 hover:border-red-500 tooltip-wrapper"
                            title="Reject Submission"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={activeTab === 'Pending' ? 5 : 4} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <AlertTriangle className="text-slate-300 mb-2" size={32} />
                        <p>No {activeTab.toLowerCase()} {requestType.toLowerCase()} requests found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
