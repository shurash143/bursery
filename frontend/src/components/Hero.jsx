import React from "react";

export default function Hero({ title, subtitle, image, pageType }) {
  // This logic creates a different "vibe" for each page automatically
  const overlays = {
    home: "from-blue-900/80",
    about: "from-blue-900/80",
    contact: "from-blue-900/80"
  };

  return (
    <section className="relative h-[60vh] w-full flex items-center bg-slate-900">
      {/* 1. The Background Image - The 'key' must be unique for React to re-render */}
      <div 
        key={image} 
        className="absolute inset-0 z-0 opacity-50 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 2. The Color Gradient Overlay */}
      <div className={`absolute inset-0 z-10 bg-gradient-to-r ${overlays[pageType] || 'from-slate-900'} to-transparent`} />

      {/* 3. The Text Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">
          {title}
        </h1>
        <p className="text-xl text-slate-200 max-w-2xl font-light">
          {subtitle}
        </p>
      </div>
    </section>
  );
}