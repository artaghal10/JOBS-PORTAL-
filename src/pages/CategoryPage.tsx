import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Calendar, MapPin, Briefcase, ExternalLink, ArrowLeft, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { getJobsByCategory, Job } from "../lib/firebase";

export function CategoryPage() {
  const { id } = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = {
    government: "Government",
    private: "Private",
    overseas: "Overseas",
    scholarship: "Scholarship",
    newspaper: "Newspaper"
  }[id || ""] || "Job";

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getJobsByCategory(categoryName);
      setJobs(data);
      setLoading(false);
    }
    load();
  }, [id, categoryName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen py-12 px-4 md:px-10"
    >
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-600 mb-8 font-black text-[11px] uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <div className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">
            {categoryName} <span className="text-blue-600">Jobs</span>
          </h1>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
             Browse the latest {categoryName.toLowerCase()} job openings in Pakistan. Verified recruitment announcements from authentic sources.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link 
                key={job.id}
                to={`/job/${job.id}`}
                className="block bg-white border border-slate-200 shadow-sm hover:border-blue-600 hover:shadow-md transition-all p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                       <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight uppercase group-hover:text-blue-600">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 mt-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.company}</p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center uppercase tracking-widest border-l border-slate-200 pl-4">
                           <MapPin className="w-3 h-3 mr-1" />
                           {job.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 border border-blue-100 rounded text-[10px] font-black text-blue-600 uppercase tracking-widest">
                       <Calendar className="w-3.5 h-3.5" />
                       <span>Deadline: {job.deadline}</span>
                    </div>
                    <div className="py-2.5 px-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                       <span>Details</span>
                       <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {jobs.length === 0 && (
              <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200">
                <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active job openings found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
