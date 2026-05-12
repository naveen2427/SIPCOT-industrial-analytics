import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus(null);
    } else {
      setFile(null);
      setStatus('error');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStatus('success');
      
      const newSubmission = {
        id: Math.floor(Math.random() * 1000) + 500,
        type: 'Certificate',
        company: user ? user.name : 'Unknown Company',
        sector: user ? user.sector : 'Unassigned',
        park: 'To be verified',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        document: file.name
      };
      
      const existing = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
      localStorage.setItem('mockSubmissions', JSON.stringify([...existing, newSubmission]));

      setFile(null);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Company Document Verification</h1>
        <p className="text-slate-600 text-center mb-10">Upload your company profile PDF for authenticity verification by SIPCOT admin.</p>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="text-emerald-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-emerald-800">Upload Successful</h4>
                <p className="text-sm text-emerald-600 mt-1">Your document has been submitted for review. The status is currently Pending.</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-red-800">Invalid File</h4>
                <p className="text-sm text-red-600 mt-1">Please select a valid PDF file containing your company details.</p>
              </div>
            </motion.div>
          )}

          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              file ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              id="pdf-upload"
            />
            
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
              {file ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-emerald-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{file.name}</h3>
                  <p className="text-sm text-slate-500 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="mt-4 text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-700">
                    <XCircle size={16} /> Remove File
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Upload className="text-slate-500" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Click to upload PDF</h3>
                  <p className="text-sm text-slate-500 mb-4">or drag and drop your document here</p>
                  <div className="text-xs text-slate-400 max-w-xs mx-auto">
                    Must contain: Company name, Sector, Investment, Employee count, Park location, Lease details, and Profit/revenue.
                  </div>
                </>
              )}
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                !file || uploading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Submit for Verification
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle size={18} /> Important Information
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 ml-1">
            <li>Submissions usually take 2-3 business days to review.</li>
            <li>Upon approval, a digital Authenticity Certificate will be generated automatically.</li>
            <li>Ensure all financial data is accurate as it affects your Growth Score.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
