import { motion } from "motion/react";
import { Linkedin, Quote } from "lucide-react";

export function CEOSection() {
  return (
    <section className="p-6 md:p-10 bg-[#F9FAFB]">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-[10rem] leading-none pointer-events-none">"</div>
        
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl shrink-0 border-4 border-blue-500/30 overflow-hidden relative shadow-2xl rotate-3">
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
            alt="CEO Tariq Nawaz"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 space-y-6 flex-grow">
          <Quote className="w-12 h-12 text-blue-500 mb-2 opacity-50" />
          <p className="text-xl md:text-3xl italic text-slate-300 leading-tight font-medium">
            "Our mission is to architect the future of Pakistani prosperity by providing high-authority verification and elite pathways for every ambitious candidate."
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div>
              <span className="block text-2xl font-bold text-white tracking-tighter">Tariq Nawaz</span>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">CEO & Visualizer</span>
            </div>
            <div className="hidden lg:flex flex-col items-end">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Leadership Protocol</span>
               <span className="text-white font-mono text-sm">SECURE_ACTIVE_2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
