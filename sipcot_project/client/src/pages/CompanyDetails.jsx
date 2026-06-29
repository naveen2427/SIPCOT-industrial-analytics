import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, MapPin, Briefcase, TrendingUp, DollarSign, ShieldCheck, Download, ArrowLeft } from 'lucide-react';

const mockGrowthData = [
  { year: '2020', investment: 500, employment: 200, revenue: 150 },
  { year: '2021', investment: 600, employment: 250, revenue: 200 },
  { year: '2022', investment: 800, employment: 320, revenue: 350 },
  { year: '2023', investment: 1000, employment: 400, revenue: 500 },
  { year: '2024', investment: 1200, employment: 480, revenue: 650 },
];

const CompanyDetails = () => {
  const { id } = useParams();
  
  // Mock company data (in real app, fetch based on ID)
  const company = {
    id,
    name: 'Samsung Electronics',
    sector: 'Electronics',
    park: 'Sriperumbudur',
    status: 'Approved',
    certId: 'CERT-2025-001',
    investment: '₹1200 Cr',
    employees: '4,500',
    revenue: '₹2500 Cr',
    score: 87,
    description: 'Samsung Electronics is a global leader in consumer electronics, semiconductor manufacturing, and telecommunications. Their facility in Sriperumbudur SIPCOT park is a state-of-the-art manufacturing unit focusing on televisions and home appliances.'
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/companies" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Companies
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                  <Building2 size={40} className="text-slate-800" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1"><Briefcase size={16} className="text-emerald-400" /> {company.sector}</span>
                    <span className="flex items-center gap-1"><MapPin size={16} className="text-emerald-400" /> {company.park}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span className="font-semibold text-emerald-50">Verified Entity</span>
                </div>
                <Link to={`/certificate/${company.id}`} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2">
                  <Download size={14} /> View Certificate
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Info */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Company Overview</h3>
                  <p className="text-slate-600 leading-relaxed">{company.description}</p>
                </div>
                
                {/* Charts */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Growth Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-600 mb-4 text-center">Investment & Revenue Growth (Cr)</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Legend wrapperStyle={{fontSize: '12px'}} />
                            <Line type="monotone" dataKey="investment" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} activeDot={{r: 6}} name="Investment" />
                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 6}} name="Revenue" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-600 mb-4 text-center">Employment Generation</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={mockGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="employment" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Employees" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar Stats */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm text-center">
                  <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Growth Score</div>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * company.score) / 100} className="text-emerald-500" />
                    </svg>
                    <div className="absolute text-3xl font-bold text-slate-800">{company.score}</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">Based on 3-year performance metrics</p>
                </div>
                
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <DollarSign size={16} />
                      </div>
                      <span className="font-medium">Total Investment</span>
                    </div>
                    <span className="font-bold text-slate-800">{company.investment}</span>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <TrendingUp size={16} />
                      </div>
                      <span className="font-medium">Annual Revenue</span>
                    </div>
                    <span className="font-bold text-slate-800">{company.revenue}</span>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                        <Building2 size={16} />
                      </div>
                      <span className="font-medium">Total Employees</span>
                    </div>
                    <span className="font-bold text-slate-800">{company.employees}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
