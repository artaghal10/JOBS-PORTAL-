import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Calendar, ArrowRight, Building2 } from "lucide-react";
import { Job } from "../lib/firebase";

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      viewport={{ once: true }}
      className="bg-white group border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-md h-full flex flex-col"
    >
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span>{job.category}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 flex items-center uppercase tracking-tighter">
            <Calendar className="w-3 h-3 mr-1" />
            {job.deadline}
          </p>
        </div>

        <Link to={`/job/${job.id}`}>
          <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-3">
            {job.title}
          </h3>
        </Link>
        
        <div className="space-y-2">
          <p className="text-xs text-slate-500 flex items-center font-medium">
            <Building2 className="w-3 h-3 mr-2 text-slate-400" />
            {job.company}
          </p>
          <p className="text-xs text-slate-500 flex items-center font-medium">
            <MapPin className="w-3 h-3 mr-2 text-slate-400" />
            {job.location}
          </p>
        </div>
      </div>

      <Link
        to={`/job/${job.id}`}
        className="mt-auto px-5 py-3 bg-slate-50 border-t border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-600"
      >
        <span>Apply Now</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
