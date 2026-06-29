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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
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
        <footer className="bg-slate-900 text-white py-8 mt-auto">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} SIPCOT Industrial Analytics and Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
