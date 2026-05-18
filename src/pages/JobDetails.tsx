import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Loader2, Calendar, MapPin, Briefcase, ExternalLink, 
  ArrowLeft, Download, ShieldCheck, Share2, Clipboard,
  FileSearch, Building2, MessageCircle
} from "lucide-react";
import { db, Job } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "jobs", id));
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() } as Job);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const jobDetailsTable = job ? [
    { label: "Organization", value: job.company },
    { label: "Job Category", value: job.category },
    { label: "Location", value: job.location },
    { label: "Deadline", value: job.deadline },
    { label: "Job Type", value: "Permanent/Contract" },
    { label: "Qualification", value: "As per Advertisement" },
    { label: "WhatsApp", value: job.whatsapp },
  ] : [];

  const handleDownload = async () => {
    if (!job || !job.imageUrl) return;
    
    try {
      // For local files, try fetching as blob to force download
      if (job.imageUrl.startsWith('/uploads/')) {
        const response = await fetch(job.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const extension = job.imageUrl.split('.').pop() || 'png';
        link.download = `Job_Ad_${job.title.replace(/\s/g, '_')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Fallback for external URLs
        window.open(job.imageUrl, '_blank');
      }
    } catch (error) {
      console.error("Download failed:", error);
      window.open(job.imageUrl, '_blank');
    }
  };

  const isPDF = job?.imageUrl?.toLowerCase().endsWith('.pdf');

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <FileSearch className="w-16 h-16 text-slate-200 mx-auto mb-6" />
        <h1 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-tighter">Job Opening Not Found</h1>
        <Link to="/" className="text-blue-600 font-black text-[11px] uppercase tracking-widest border-b-2 border-blue-600 pb-1">Return Home</Link>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pb-20"
    >
      <div className="bg-slate-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-10 font-black text-[11px] uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="px-3 py-1.5 bg-blue-600 text-white inline-block text-[10px] font-black uppercase tracking-widest">
                {job.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
               <div className="grid grid-cols-2 gap-8 pb-8 border-b border-slate-100 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Publish Date</p>
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                       <Calendar className="w-4 h-4 text-blue-600" />
                       <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</p>
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                       <ShieldCheck className="w-4 h-4 text-red-500" />
                       <span>{job.deadline}</span>
                    </div>
                  </div>
               </div>

                <div className="mb-12 border-b border-slate-100 pb-12">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-l-blue-600 pl-4">
                     Apply Method & Information
                  </h3>
                  <div className="bg-blue-50/50 p-6 border border-blue-100 rounded-xl">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium mb-6">
                      Interested candidates who fulfill the eligibility criteria can apply through the following procedure. Please ensure you have all required documents ready before applying.
                    </p>
                    <div className="bg-white border border-slate-100 overflow-hidden rounded-lg">
                      {jobDetailsTable.map((row, idx) => (
                        <div key={row.label} className={`flex border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <div className="w-1/3 p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-100 flex items-center">
                            {row.label}
                          </div>
                          <div className="w-2/3 p-4 text-xs font-bold text-slate-800">
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="prose prose-slate max-w-none mb-12">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-l-blue-600 pl-4">
                     Vacant Positions
                  </h3>
                  <div className="text-slate-600 leading-relaxed text-base font-medium bg-white p-6 border border-slate-100 rounded-xl whitespace-pre-line">
                     {job.description}
                  </div>
               </div>

               {job.imageUrl && (
                 <div className="mt-12 group relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tighter border-l-4 border-l-blue-600 pl-4">Official Advertisement</h3>
                      <button onClick={handleDownload} className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center bg-blue-50 px-3 py-1 rounded">
                         <Download className="w-3.5 h-3.5 mr-1" />
                         {isPDF ? 'Download PDF' : 'Download Image'}
                      </button>
                    </div>
                    
                    {isPDF ? (
                      <div className="w-full aspect-[1/1.4] bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-12 text-center rounded-xl">
                        <FileSearch className="w-16 h-16 text-slate-300 mb-6" />
                        <h4 className="text-lg font-bold text-slate-800 mb-2">Official PDF Advertisement</h4>
                        <p className="text-sm text-slate-500 mb-8 max-w-sm">This advertisement is in PDF format. You can view it by downloading or opening in a new tab.</p>
                        <div className="flex gap-4">
                          <button onClick={handleDownload} className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg hover:bg-blue-700 transition-all">Download PDF</button>
                          <a href={job.imageUrl} target="_blank" className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg hover:bg-black transition-all">Open Full Ad</a>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={job.imageUrl} className="w-full border border-slate-200 shadow-sm" alt="Official Ad" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button onClick={handleDownload} className="bg-white text-slate-900 px-6 py-3 font-black text-[11px] uppercase tracking-widest flex items-center space-x-2 rounded shadow-xl">
                              <Download className="w-4 h-4" />
                              <span>Download High Quality Ad</span>
                           </button>
                        </div>
                      </>
                    )}
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-10 space-y-6">
              <div className="bg-blue-600 p-8 text-white shadow-xl flex flex-col space-y-6">
                <h4 className="text-lg font-black tracking-tighter uppercase mb-2">Quick Apply</h4>
                <a 
                  href={`https://wa.me/${job.whatsapp.startsWith('0') ? '92' + job.whatsapp.slice(1) : job.whatsapp}?text=I am applying for: ${job.title}`}
                  target="_blank"
                  className="w-full py-4 bg-white text-blue-600 font-black rounded hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>On WhatsApp</span>
                </a>
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-blue-700 text-white font-black rounded flex items-center justify-center space-x-2 hover:bg-blue-800 transition-all text-[11px] uppercase tracking-widest"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Scan</span>
                </button>
              </div>

              <div className="bg-slate-50 p-6 border border-slate-200">
                 <h5 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-4">Important Message</h5>
                 <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Please apply before the deadline. Make sure to read the complete advertisement scan provided above for eligibility criteria.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
