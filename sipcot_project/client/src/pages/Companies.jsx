import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building, MapPin, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';

const mockCompanies = [
  { id: 1, name: 'Samsung Electronics', sector: 'Electronics', park: 'Sriperumbudur', status: 'Approved', score: 87, investment: '₹1200 Cr' },
  { id: 2, name: 'Foxconn', sector: 'Electronics', park: 'Sriperumbudur', status: 'Approved', score: 92, investment: '₹2500 Cr' },
  { id: 3, name: 'Hyundai', sector: 'Automotive', park: 'Irungattukottai', status: 'Approved', score: 85, investment: '₹5000 Cr' },
  { id: 4, name: 'TVS Motors', sector: 'Automotive', park: 'Hosur', status: 'Pending', score: 78, investment: '₹800 Cr' },
  { id: 5, name: 'TCS', sector: 'IT Services', park: 'Siruseri', status: 'Approved', score: 95, investment: '₹1500 Cr' },
  { id: 6, name: 'Infosys', sector: 'IT Services', park: 'Mahindra World City', status: 'Approved', score: 91, investment: '₹1200 Cr' },
  { id: 7, name: 'Sun Pharma', sector: 'Pharmaceuticals', park: 'Alathur', status: 'Rejected', score: 45, investment: '₹300 Cr' },
  { id: 8, name: 'ABC Textiles', sector: 'Textiles', park: 'Tiruppur', status: 'Pending', score: 65, investment: '₹150 Cr' },
  { id: 9, name: 'GreenTech Industries', sector: 'Renewable', park: 'Oragadam', status: 'Approved', score: 82, investment: '₹600 Cr' }
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || company.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    if (status === 'Approved') return <CheckCircle className="text-emerald-500" size={18} />;
    if (status === 'Pending') return <Clock className="text-amber-500" size={18} />;
    return <XCircle className="text-red-500" size={18} />;
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Registered Companies</h1>
            <p className="text-slate-600">Browse and verify companies registered within SIPCOT industrial parks.</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Company Name</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Sector</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Industrial Park</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Investment</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Growth Score</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, index) => (
                  <motion.tr 
                    key={company.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Building className="text-slate-500" size={18} />
                        </div>
                        <span className="font-medium text-slate-800">{company.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{company.sector}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-600 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        {company.park}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium text-sm">{company.investment}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          company.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          company.score >= 60 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {company.score}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(company.status)}`}>
                        {getStatusIcon(company.status)}
                        {company.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/companies/${company.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredCompanies.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No companies found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
