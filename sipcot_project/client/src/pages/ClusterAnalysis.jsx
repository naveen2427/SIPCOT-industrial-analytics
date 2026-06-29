import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Layers, Map, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const clusterDominanceData = [
  { park: 'Sriperumbudur', Electronics: 65, Automotive: 20, IT: 10, Other: 5 },
  { park: 'Oragadam', Electronics: 15, Automotive: 70, IT: 5, Other: 10 },
  { park: 'Hosur', Electronics: 40, Automotive: 35, IT: 15, Other: 10 },
  { park: 'Siruseri', Electronics: 5, Automotive: 5, IT: 85, Other: 5 },
  { park: 'Tiruppur', Electronics: 0, Automotive: 5, IT: 5, Textiles: 90 },
];

const clusterStrengthData = [
  { subject: 'Electronics', A: 85, fullMark: 100 },
  { subject: 'Automotive', A: 92, fullMark: 100 },
  { subject: 'IT Services', A: 78, fullMark: 100 },
  { subject: 'Textiles', A: 65, fullMark: 100 },
  { subject: 'Pharma', A: 55, fullMark: 100 },
  { subject: 'Renewable', A: 45, fullMark: 100 },
];

const clusters = [
  { name: 'Electronics Hub', count: 5, companies: 450, color: 'bg-blue-500' },
  { name: 'Automotive Hub', count: 4, companies: 380, color: 'bg-emerald-500' },
  { name: 'IT Hub', count: 3, companies: 290, color: 'bg-purple-500' },
  { name: 'Textile Hub', count: 2, companies: 150, color: 'bg-amber-500' },
  { name: 'Mixed Cluster', count: 10, companies: 680, color: 'bg-slate-500' },
];

const ClusterAnalysis = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Industrial Cluster Analysis</h1>
          <p className="text-slate-600">AI-driven mapping of dominant industry sectors across SIPCOT parks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {clusters.map((cluster, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className={`h-2 w-full ${cluster.color}`}></div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-sm mb-1">{cluster.name}</h3>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{cluster.count}</div>
                    <div className="text-xs text-slate-500 uppercase">Parks</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-700">{cluster.companies}</div>
                    <div className="text-xs text-slate-500 uppercase">Companies</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Map size={20} className="text-emerald-500" />
                Sector Dominance by Park
              </h3>
              <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded">Dominant sector defines cluster type</span>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterDominanceData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="park" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} width={100} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="Electronics" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Automotive" stackId="a" fill="#10b981" />
                  <Bar dataKey="IT" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Textiles" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Other" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-purple-500" />
              Overall Cluster Strength
            </h3>
            <div className="h-96 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={clusterStrengthData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Radar name="Cluster Strength" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.5} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-900 text-white rounded-xl shadow-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Automotive Hub Performance</h3>
              <p className="text-emerald-100 max-w-2xl">The Automotive cluster, centered around Oragadam and Irungattukottai, has shown the highest growth index this quarter with a 14% increase in foreign direct investment.</p>
            </div>
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/50 p-4 rounded-xl text-center min-w-[150px]">
              <div className="text-sm text-emerald-200 uppercase tracking-wider mb-1">Top Cluster</div>
              <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <TrendingUp size={24} className="text-emerald-400" />
                #1
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClusterAnalysis;
