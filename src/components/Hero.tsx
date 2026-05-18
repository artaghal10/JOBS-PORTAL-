import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="py-20 px-6 md:px-10 bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight uppercase"
        >
          New Jobs in Pakistan 2026 – Today Jobs in Pakistan Newspaper
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-slate-600 leading-relaxed font-medium"
        >
          If you want to get new jobs in Pakistan 2026 or you want to make a career in Pakistan then you get jobs information in different ways like jobs in Pakistan newspaper and vacancies in Pakistan which is published in daily newspapers of Pakistan such as daily jang newspaper, daily nawaiwaqt newspaper, express newspaper, dawn newspaper, the news, the nation, dunya newspaper, aaj newspaper etc. In addition you visit official websites of government departments like FPSC, PPSC, KPPSC, BPSC, SPSC, NTS jobs, PTS jobs, OTS jobs, NADRA, WAPDA websites for career opportunity and jobs opening in Pakistan. Because you can't visit all these on daily basis. At <span className="text-blue-600 font-bold underline">artaghaljobs.com</span> you can get all these jobs information at one place.
        </motion.p>

        <div className="pt-8 flex justify-center">
           <div className="w-24 h-1.5 bg-blue-600/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-full bg-blue-600 rounded-full animate-pulse"></div>
           </div>
        </div>
      </div>
    </section>
  );
}
