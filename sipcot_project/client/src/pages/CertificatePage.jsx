import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, ShieldCheck, Award } from 'lucide-react';
// import jsPDF from 'jspdf'; // In a real app, use jsPDF or html2canvas to download

const CertificatePage = () => {
  const { id } = useParams();
  const certificateRef = useRef(null);

  // Mock data
  const certData = {
    certId: 'CERT-2025-001',
    companyName: 'Samsung Electronics',
    sector: 'Electronics',
    park: 'Sriperumbudur',
    investment: '₹1200 Cr',
    employees: '4,500',
    approvalDate: 'April 20, 2025',
    authority: 'Dr. R. Anand, IAS',
    designation: 'Managing Director, SIPCOT'
  };

  const handleDownload = () => {
    // Implement PDF download logic here using jsPDF/html2canvas
    alert('PDF Download functionality would be triggered here.');
  };

  return (
    <div className="bg-slate-900 min-h-screen py-12 flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <Link to="/companies" className="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Link>
          <button 
            onClick={handleDownload}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>

        {/* Certificate Container */}
        <div className="bg-white p-2 sm:p-4 rounded-sm shadow-2xl overflow-hidden relative max-w-3xl mx-auto">
          <div 
            ref={certificateRef}
            className="border-[12px] border-double border-slate-800 p-8 sm:p-12 relative bg-amber-50/30"
            style={{ minHeight: '800px', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <ShieldCheck size={400} className="text-slate-900" />
            </div>

            {/* Header */}
            <div className="text-center mb-12 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-4 border-amber-500 text-white shadow-lg">
                  <Award size={48} className="text-amber-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-wider uppercase">
                State Industries Promotion Corporation of Tamil Nadu
              </h1>
              <p className="text-sm font-semibold tracking-widest text-slate-500 mt-2">GOVERNMENT OF TAMIL NADU ENTERPRISE</p>
              
              <div className="mt-8 mb-6 border-b-2 border-slate-300 w-3/4 mx-auto"></div>
              
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 tracking-wide">
                CERTIFICATE OF AUTHENTICITY
              </h2>
            </div>

            {/* Content */}
            <div className="text-center space-y-6 relative z-10">
              <p className="text-lg text-slate-700 italic font-serif">This is to certify that</p>
              <h3 className="text-4xl font-bold text-slate-900 font-serif border-b border-slate-400 inline-block px-8 pb-2">
                {certData.companyName}
              </h3>
              
              <p className="text-lg text-slate-700 font-serif max-w-2xl mx-auto leading-relaxed mt-6">
                has successfully completed the verification process and is recognized as an authentic operating entity within the <span className="font-bold text-slate-900">{certData.park}</span> SIPCOT Industrial Park.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mt-10 bg-white/60 p-6 rounded-lg border border-slate-200">
                <div className="text-left">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Sector</p>
                  <p className="font-bold text-slate-800">{certData.sector}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Certificate ID</p>
                  <p className="font-bold text-slate-800 font-mono">{certData.certId}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Declared Investment</p>
                  <p className="font-bold text-slate-800">{certData.investment}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Employment Generated</p>
                  <p className="font-bold text-slate-800">{certData.employees}</p>
                </div>
              </div>
            </div>

            {/* Footer / Signatures */}
            <div className="mt-20 flex justify-between items-end relative z-10">
              <div className="text-center">
                <p className="font-bold text-slate-800 font-serif">{certData.approvalDate}</p>
                <div className="border-t border-slate-800 w-48 mt-2 pt-1">
                  <p className="text-xs text-slate-600 font-semibold uppercase">Date of Issue</p>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center border-[6px] border-double border-red-200 shadow-xl transform -rotate-12">
                  <div className="text-center text-red-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Verified</p>
                    <ShieldCheck size={32} className="mx-auto my-1 text-white" />
                    <p className="text-[8px] font-bold uppercase">SIPCOT</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                {/* Mock Signature */}
                <div className="font-['Brush_Script_MT',cursive] text-4xl text-slate-800 mb-2 transform -rotate-6">R. Anand</div>
                <div className="border-t border-slate-800 w-64 pt-1">
                  <p className="font-bold text-slate-800 text-sm">{certData.authority}</p>
                  <p className="text-xs text-slate-600 font-semibold">{certData.designation}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
