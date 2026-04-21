import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Send, Clock, Loader2, CheckCircle2 } from "lucide-react";
import API from "../api/axiosConfig"; // Ensure this path is correct
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Contact() {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Capture form data using the 'name' attributes of the inputs
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
      // 2. Send POST request to your backend (http://localhost:5000/api/contacts)
      await API.post("/contacts", payload);
      
      // 3. Update UI to show success
      setSubmitted(true);
      
      // 4. Redirect to Admin Dashboard after 2 seconds
      setTimeout(() => {
       navigate("/admin");
      }, 2000);

    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.error || "Failed to send message. Is your server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero
        pageType="contact"
        title="Support & Assistance"
        subtitle="Our team is here to help you with your application process 24/7."
        image="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80"
        category="Help Center"
      />

      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-5 gap-16">
        {/* Support Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Get in touch.</h2>
            <p className="text-slate-500 text-lg">
              Have technical issues or eligibility questions? Reach out to our regional desks.
            </p>
          </div>
          
          <div className="space-y-6">
            <ContactInfoCard icon={<Mail className="text-rose-500"/>} label="Email Support" val="help@bursary.go.ke" />
            <ContactInfoCard icon={<Phone className="text-rose-500"/>} label="Hotline" val="+254 700 000 000" />
            <ContactInfoCard icon={<Clock className="text-rose-500"/>} label="Business Hours" val="Mon-Fri, 8AM - 5PM" />
          </div>
        </div>

        {/* Support Form Column */}
        <div className="lg:col-span-3">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all">
            {submitted ? (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <div className="bg-emerald-100 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Message Sent!</h3>
                <p className="text-slate-500 text-lg mb-8">Redirecting you to the Admin Dashboard...</p>
                <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full animate-pulse"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <InputGroup name="name" label="Full Name" type="text" placeholder="John Doe" required />
                  <InputGroup name="email" label="Email Address" type="email" placeholder="john@domain.com" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Message Subject</label>
                  <select name="subject" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold transition-all">
                    <option>General Inquiry</option>
                    <option>Application Issues</option>
                    <option>Disbursement Query</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Your Message</label>
                  <textarea 
                    name="message" 
                    required 
                    rows="5" 
                    className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none" 
                    placeholder="Tell us more about your issue..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-rose-600 text-white font-black uppercase tracking-widest py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-xl shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>Processing <Loader2 className="animate-spin" size={20} /></>
                  ) : (
                    <>Submit Inquiry <Send size={20} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* --- ATOMIC COMPONENTS --- */

const ContactInfoCard = ({icon, label, val}) => (
  <div className="flex items-center gap-6 p-7 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
    <div className="bg-rose-50 p-4 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all text-rose-600">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-slate-900 text-lg">{val}</p>
    </div>
  </div>
);

const InputGroup = ({label, name, ...props}) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input 
      name={name} 
      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" 
      {...props} 
    />
  </div>
);