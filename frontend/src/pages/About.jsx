import React from "react";
import { Target, Users, ShieldCheck, Award } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="bg-white">
      <Hero
        pageType="about"
        title="Our Commitment to Equity"
        subtitle="Dismantling financial barriers to ensure every student reaches their full potential."
        image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80"
        category="About the System"
      />

      {/* Unique About Section: The Narrative Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80" className="rounded-[3rem] shadow-2xl" alt="Team" />
          <div className="absolute -bottom-10 -right-10 bg-blue-600 p-8 rounded-[2rem] text-white hidden md:block">
            <p className="text-4xl font-black italic">"Education for all."</p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest">Transparency First</h2>
          <h3 className="text-4xl font-black text-slate-900">A Digitized Pipeline for Fair Distribution.</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Founded in 2024, the Online Bursary System removes the middle-man. We ensure that tax-payer funds move directly from the treasury to the institution based on verified socio-economic data.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <ValueItem icon={<Target className="text-emerald-500"/>} title="Our Goal" label="100k Students by 2026" />
            <ValueItem icon={<Award className="text-blue-500"/>} title="Compliance" label="Fully Audited Portal" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const ValueItem = ({icon, title, label}) => (
  <div className="flex flex-col gap-2">
    {icon}
    <p className="font-black text-slate-900">{title}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);