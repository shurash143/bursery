import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, Phone, MapPin, ExternalLink, 
  ShieldCheck, Facebook, Twitter, Linkedin 
} from "lucide-react";

export default function ProfessionalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">
              Bursary<span className="text-blue-500">Portal</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed font-medium">
            The national standard for digital bursary administration. 
            Ensuring transparency, equity, and efficiency in educational 
            financing for every Kenyan student.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Facebook size={18} />} />
            <SocialIcon icon={<Linkedin size={18} />} />
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Resources</h4>
          <ul className="space-y-4 text-sm font-semibold">
            <li><FooterLink to="/" label="Platform Home" /></li>
            <li><FooterLink to="/about" label="Program Mission" /></li>
            <li><FooterLink to="/contact" label="Support Center" /></li>
            <li><FooterLink to="/register" label="Apply for Bursary" /></li>
          </ul>
        </div>

        {/* Legal/Official Column */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Legal & Policy</h4>
          <ul className="space-y-4 text-sm font-semibold">
            <li><FooterLink to="/privacy" label="Data Privacy Policy" /></li>
            <li><FooterLink to="/terms" label="Terms of Service" /></li>
            <li><FooterLink to="/compliance" label="Anti-Corruption Policy" /></li>
            <li><FooterLink to="/faq" label="Help & FAQ" /></li>
          </ul>
        </div>

        {/* Contact/Support Column */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Official Contact</h4>
          <div className="space-y-4">
            <ContactItem icon={<Mail size={16} />} text="support@bursarysystem.go.ke" />
            <ContactItem icon={<Phone size={16} />} text="+254 700 000 000" />
            <ContactItem icon={<MapPin size={16} />} text="Government Plaza, Nairobi, KE" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</p>
             <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-500 font-bold uppercase">Operational</span>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold tracking-wide">
            © {currentYear} ONLINE BURSARY MANAGEMENT SYSTEM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <span className="flex items-center gap-1"><ExternalLink size={12}/> e-Government Services</span>
             <span className="flex items-center gap-1"><ExternalLink size={12}/> Ministry of Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- HELPER COMPONENTS --- */

const FooterLink = ({ to, label }) => (
  <Link 
    to={to} 
    className="hover:text-blue-500 transition-colors duration-200 flex items-center gap-1"
  >
    {label}
  </Link>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="text-blue-500">{icon}</div>
    <span className="font-medium text-slate-300">{text}</span>
  </div>
);

const SocialIcon = ({ icon }) => (
  <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
    {icon}
  </button>
);