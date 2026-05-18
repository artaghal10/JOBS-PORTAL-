import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, LayoutDashboard, ShieldCheck, LogOut, Loader2, Image as ImageIcon, Trash2, Edit2, FileText, CheckCircle2 } from "lucide-react";

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ userId: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"publish" | "manage">("manage");
  
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    category: "Government",
    deadline: "",
    whatsapp: "923306105115",
    description: "",
    imageUrl: ""
  });

  const categories = ["Government", "Private", "Overseas", "Scholarship", "Newspaper"];

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchJobs(savedToken);
    }
  }, []);

  const fetchJobs = async (authToken: string) => {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        fetchJobs(data.token);
      } else {
        if (res.status === 401) {
          setLoginError("Invalid User ID or Access Code. Access Denied.");
        } else if (res.status === 404) {
          setLoginError("Login Endpoint Not Found. Server configuration issue.");
        } else {
          const data = await res.json().catch(() => ({}));
          setLoginError(data.error || `Server Error: ${res.status}`);
        }
      }
    } catch (error) {
      setLoginError("Network Protocol Failure. Unable to reach terminal.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsLoggedIn(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: data.url });
      } else {
        alert(data.error || "Upload protocol failed.");
      }
    } catch (error) {
      alert("Transmission failure in file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setPublishing(true);
    try {
      const url = editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editingId ? "Update Protocol Successful" : "Deployment Successful");
        setFormData({
          title: "",
          company: "",
          location: "",
          category: "Government",
          deadline: "",
          whatsapp: "923306105115",
          description: "",
          imageUrl: ""
        });
        setEditingId(null);
        fetchJobs(token);
        setActiveTab("manage");
      }
    } catch (error) {
      alert("Critical failure in deployment sequence.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm target deletion?") || !token) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchJobs(token);
      }
    } catch (err) {
      alert("Deletion protocol failed.");
    }
  };

  const handleEdit = (job: any) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      category: job.category,
      deadline: job.deadline,
      whatsapp: job.whatsapp || "923306105115",
      description: job.description,
      imageUrl: job.imageUrl || ""
    });
    setEditingId(job.id);
    setActiveTab("publish");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-900 p-12 rounded-[3rem] shadow-2xl text-center relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
             <ShieldCheck className="w-64 h-64 text-white" />
           </div>
           
           <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-8 shadow-lg shadow-blue-500/20" />
           <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Command Entry</h2>
           <p className="text-slate-400 mb-8 text-xs font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
           
           <AnimatePresence>
             {loginError && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 exit={{ opacity: 0, height: 0 }}
                 className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest"
               >
                 {loginError}
               </motion.div>
             )}
           </AnimatePresence>
           
           <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Credential ID</label>
                <input 
                  type="text"
                  required
                  value={loginData.userId}
                  onChange={e => setLoginData({...loginData, userId: e.target.value})}
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-mono"
                  placeholder="ID_7782"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Code</label>
                <input 
                  type="password"
                  required
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
              <button 
                disabled={loggingIn}
                type="submit"
                className="w-full py-5 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 text-xs uppercase tracking-[0.3em]"
              >
                {loggingIn ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : "Initiate Authorization"}
              </button>
           </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-8 md:min-h-screen">
         <div className="flex items-center space-x-3 mb-16">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold">A</div>
            <span className="font-extrabold text-sm tracking-widest uppercase">Admin Terminal</span>
         </div>
         
         <nav className="space-y-4">
            <button 
              onClick={() => setActiveTab("manage")}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${activeTab === 'manage' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
               <LayoutDashboard className="w-5 h-5" />
               <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab("publish"); setEditingId(null); }}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${activeTab === 'publish' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
               <Plus className="w-5 h-5" />
               <span className="font-bold text-xs uppercase tracking-widest">New Deployment</span>
            </button>
            
            <div className="pt-10">
               <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
               >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-widest">Abort Protocol</span>
               </button>
            </div>
         </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "manage" ? (
            <motion.div 
              key="manage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
               <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Operations Dashboard</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{jobs.length} Active Jobs</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Real-time Sync Active</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {loadingJobs ? (
                    <div className="py-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
                  ) : jobs.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                       <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active job posts found.</p>
                    </div>
                  ) : jobs.map(job => (
                    <div key={job.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all group">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                             <FileText className="w-8 h-8" />
                          </div>
                          <div>
                             <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">{job.title}</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.category} · {job.company}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-4 mt-6 md:mt-0">
                          <button 
                            onClick={() => handleEdit(job)}
                            className="p-4 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                             <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(job.id)}
                            className="p-4 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="publish"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl space-y-10"
            >
               <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{editingId ? "Update Job Post" : "Create New Job Post"}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{editingId ? "Modify existing information" : "Publish new job opportunity to the site"}</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                    <Plus className="w-64 h-64 text-slate-900" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Title</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800"
                        placeholder="e.g. National Bank of Pakistan Jobs"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Organization</label>
                      <input 
                        required
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800"
                        placeholder="e.g. NBP"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Location</label>
                      <input 
                        required
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800"
                        placeholder="e.g. Islamabad, Lahore, Karachi"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Last Date to Apply</label>
                      <input 
                        required
                        type="date"
                        value={formData.deadline}
                        onChange={e => setFormData({...formData, deadline: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">WhatsApp Number</label>
                      <input 
                        required
                        value={formData.whatsapp}
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full p-5 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-800 font-mono"
                        placeholder="923306105115"
                      />
                    </div>
                  </div>

                  <div className="mt-10 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Visual asset / Ad PDF (.jpg, .png, .pdf)</label>
                    <div className="flex items-center space-x-6">
                      <div className={`flex-1 relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${formData.imageUrl ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 hover:border-blue-600'}`}>
                        {uploading ? <Loader2 className="w-10 h-10 animate-spin text-blue-600" /> : (
                          <>
                             {formData.imageUrl ? (
                               <div className="flex items-center space-x-6 w-full">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                     {formData.imageUrl.toLowerCase().endsWith('.pdf') ? (
                                       <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                                         <FileText className="w-6 h-6" />
                                       </div>
                                     ) : (
                                       <img src={formData.imageUrl} className="w-full h-full object-cover" />
                                     )}
                                  </div>
                                  <div className="flex-1 text-left">
                                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">Asset Link Verified</p>
                                     <p className="text-[9px] text-slate-400 truncate max-w-[150px]">{formData.imageUrl}</p>
                                  </div>
                                  <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                             ) : (
                               <>
                                 <ImageIcon className="w-10 h-10 text-slate-200 mb-4" />
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Resource Package</p>
                                 <input 
                                  type="file" 
                                  onChange={handleFileUpload}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                 />
                               </>
                             )}
                          </>
                        )}
                      </div>
                      <div className="hidden md:block w-40 text-[9px] text-slate-400 font-medium italic leading-relaxed">
                         Upload the official High-Ticket advertisement. Acceptable formats for node deployment include JPG, PNG and PDF.
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Implementation Briefing (Narrative)</label>
                    <textarea 
                      required
                      rows={8}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full p-8 bg-slate-50 rounded-3xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium text-slate-600 leading-relaxed"
                      placeholder="Describe the recruitment architecture, key deliverables, and target metrics..."
                    />
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button 
                      disabled={publishing}
                      type="submit"
                      className="flex-grow py-6 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center space-x-4 text-xs uppercase tracking-[0.4em]"
                    >
                      {publishing ? <Loader2 className="animate-spin w-6 h-6" /> : (
                        <>
                          <Plus className="w-6 h-6" />
                          <span>{editingId ? "Deploy Optimized Stream" : "Initiate Vector Broadcast"}</span>
                        </>
                      )}
                    </button>
                    {editingId && (
                       <button 
                         type="button"
                         onClick={() => { setEditingId(null); setActiveTab("manage"); }}
                         className="px-10 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                       >
                         Abort
                       </button>
                    )}
                  </div>
               </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
