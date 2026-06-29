import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact SIPCOT</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get in touch with the State Industries Promotion Corporation of Tamil Nadu for queries regarding industrial parks, land allocation, and company verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Query regarding land allocation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Your message here..."></textarea>
              </div>
              <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Headquarters</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-emerald-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-slate-400 text-sm">19-A, Rukmini Lakshmipathy Road,<br />Egmore, Chennai - 600 008.<br />Tamil Nadu, India.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-emerald-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-slate-400 text-sm">+91-44-2855 4787</p>
                    <p className="text-slate-400 text-sm">+91-44-2855 4788</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-emerald-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-slate-400 text-sm">info@sipcot.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-emerald-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Website</h4>
                    <p className="text-slate-400 text-sm">sipcot.tn.gov.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Working Hours</h3>
              <p className="text-slate-600 text-sm mb-4">Our offices are open during the following hours:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Monday - Friday</span>
                  <span className="font-medium text-slate-800">10:00 AM - 5:45 PM</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Saturday & Sunday</span>
                  <span className="font-medium text-red-500">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
