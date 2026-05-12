import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockParks = [
  { id: 1, name: 'Sriperumbudur', cluster: 'Electronics Hub', companies: 145, investment: '₹1.2T', employees: '450K', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000' },
  { id: 2, name: 'Oragadam', cluster: 'Automotive Hub', companies: 210, investment: '₹1.5T', employees: '520K', image: 'https://images.unsplash.com/photo-1565642456485-f5f4a62ebcc7?auto=format&fit=crop&q=80&w=1000' },
  { id: 3, name: 'Gummidipoondi', cluster: 'Mixed Cluster', companies: 85, investment: '₹0.4T', employees: '120K', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1000' },
  { id: 4, name: 'Irungattukottai', cluster: 'Automotive Hub', companies: 110, investment: '₹0.8T', employees: '200K', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000' },
  { id: 5, name: 'Hosur', cluster: 'Electronics Hub', companies: 130, investment: '₹0.9T', employees: '250K', image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&q=80&w=1000' },
  { id: 6, name: 'Tiruppur', cluster: 'Textile Hub', companies: 300, investment: '₹0.6T', employees: '400K', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&q=80&w=1000' }
];

const IndustrialParks = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SIPCOT Industrial Parks</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Explore our state-of-the-art industrial parks across Tamil Nadu, categorized by dominant industry clusters.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockParks.map((park, index) => (
            <motion.div 
              key={park.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={park.image} 
                  alt={park.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md bg-opacity-90">
                  {park.cluster}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <MapPin className="text-emerald-500" size={20} />
                  {park.name}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-1">
                      <Building size={14} /> Companies
                    </div>
                    <div className="text-lg font-bold text-slate-800">{park.companies}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-1">
                      <TrendingUp size={14} /> Investment
                    </div>
                    <div className="text-lg font-bold text-emerald-600">{park.investment}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold mb-1">
                      <Briefcase size={14} /> Total Employment
                    </div>
                    <div className="text-lg font-bold text-blue-600">{park.employees}</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link to={`/companies?park=${park.name}`} className="text-emerald-600 font-semibold hover:text-emerald-500 text-sm flex items-center justify-between w-full group-hover:translate-x-1 transition-transform">
                    View Companies
                    <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustrialParks;
