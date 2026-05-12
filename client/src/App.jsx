import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IndustrialParks from './pages/IndustrialParks';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import PdfUpload from './pages/PdfUpload';
import AdminPanel from './pages/AdminPanel';
import CertificatePage from './pages/CertificatePage';
import Analytics from './pages/Analytics';
import ClusterAnalysis from './pages/ClusterAnalysis';
import InvestorChatbot from './pages/InvestorChatbot';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen mesh-bg text-white flex flex-col relative">
        {/* Global animated background grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
        <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parks" element={<IndustrialParks />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            <Route path="/upload" element={<PdfUpload />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/certificate/:id" element={<CertificatePage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/clusters" element={<ClusterAnalysis />} />
            <Route path="/chatbot" element={<InvestorChatbot />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
          <footer className="glass-dark border-t border-emerald-500/10 text-slate-300 py-8 mt-auto backdrop-blur-xl">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} SIPCOT Industrial Analytics and Management System. All rights reserved.</p>
          </div>
        </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
