import { Hero } from "../components/Hero";
import { motion } from "motion/react";
import { Briefcase, Building, GraduationCap, Plane, Loader2, Sparkles, ArrowRight, Newspaper, Landmark, Globe2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getLatestJobs, Job } from "../lib/firebase";
import { JobCard } from "../components/JobCard";

export function Home() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLatestJobs(9);
      setLatestJobs(data);
      setLoading(false);
    }
    load();
  }, []);

  const topCategories = [
    { id: "government", name: "Government Jobs", icon: <Landmark className="w-6 h-6" />, color: "border-blue-500 text-blue-600" },
    { id: "newspaper", name: "Newspaper Jobs", icon: <Newspaper className="w-6 h-6" />, color: "border-gray-800 text-gray-800" },
    { id: "overseas", name: "Overseas Jobs", icon: <Globe2 className="w-6 h-6" />, color: "border-emerald-600 text-emerald-600" },
    { id: "private", name: "Private Jobs", icon: <Briefcase className="w-6 h-6" />, color: "border-purple-600 text-purple-600" },
  ];

  const subCategories = [
    "FPSC Jobs", "PPSC Jobs", "KPPSC Jobs", "BPSC Jobs", "SPSC Jobs", "NTS Jobs", 
    "Pakistan Army", "Pakistan Navy", "Pakistan Air Force", "Police Jobs",
    "Banking Jobs", "Health Department", "Education Department", "Scholarships"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <Hero />
      
      {/* Category Grid */}
      <section className="py-12 px-6 md:px-10 max-w-7xl mx-auto border-y border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topCategories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              className={`p-6 bg-white border-b-4 ${cat.color} hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center space-y-4 shadow-sm hover:shadow-md`}
            >
              {cat.icon}
              <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Sidebar or Quick Links */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#1E73BE] p-4">
                <h3 className="text-white text-[11px] font-black uppercase tracking-widest flex items-center">
                   <BookOpen className="w-4 h-4 mr-2" />
                   Selection Channels
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {subCategories.map((sub) => (
                  <Link 
                    key={sub} 
                    to="/category/government"
                    className="block px-4 py-3 text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all uppercase tracking-wider"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <h4 className="text-blue-800 text-xs font-black uppercase tracking-widest mb-3">Newsletter</h4>
              <p className="text-[11px] text-blue-600 mb-4 font-bold leading-relaxed">Join 50,000+ professionals getting daily job alerts.</p>
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-white border border-blue-200 px-4 py-2 text-[10px] font-bold uppercase mb-2 outline-none focus:border-blue-400"
              />
              <button className="w-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-2 hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
           </div>
        </div>

        {/* Center - Latest Jobs */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Latest <span className="text-blue-600 underline underline-offset-8 decoration-4 decoration-blue-600/20">Announcements</span>
            </h2>
            <Link to="/category/government" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center transition-colors">
               See All Postings
               <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : latestJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200">
               <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Searching for mission objectives...</p>
            </div>
          )}

          {/* Additional Info Section */}
          <div className="mt-16 bg-slate-50 p-8 border border-slate-200 border-l-4 border-l-blue-600">
             <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">Stay Updated with JobUstad</h3>
             <p className="text-sm text-slate-600 leading-relaxed font-medium">
               This portal is dedicated to providing authentic and verified job information across Pakistan. Whether you are looking for <strong>FPSC Jobs</strong>, <strong>PPSC Jobs</strong>, or <strong>Pakistan Army Careers</strong>, we curate every detail to save you time and effort. Our team monitors over 50+ newspapers daily to bring you the latest opportunities.
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
