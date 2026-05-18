import { Mail, Phone, MapPin, ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Government Jobs", path: "/category/government" },
    { name: "Private Jobs", path: "/category/private" },
    { name: "International Jobs", path: "/category/overseas" },
    { name: "Scholarships", path: "/category/scholarship" },
    { name: "Admin Portal", path: "/admin" },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-black tracking-tighter">
            Job<span className="text-blue-500">Ustad</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            JobUstad Pakistan (jobustad.com) provides the latest information about government jobs, private jobs, and international vacancies. We help you find the best career opportunities in Pakistan and abroad.
          </p>
          <div className="flex items-center space-x-4">
             <a href="https://wa.me/923306105115" className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
             </a>
             <a href="mailto:oservices94@gmail.com" className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
             </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-[11px] border-b border-white/10 pb-2">Navigation</h3>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-slate-400 hover:text-blue-500 flex items-center text-[12px] font-bold uppercase transition-colors group">
                  <ChevronRight className="w-3 h-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-[11px] border-b border-white/10 pb-2">Contact Info</h3>
           <div className="space-y-4">
              <div className="flex items-start space-x-3">
                 <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                 <p className="text-sm text-slate-400 font-medium">Serai Naurang, Lakki Marwat, Pakistan</p>
              </div>
              <div className="flex items-center space-x-3">
                 <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                 <p className="text-sm text-slate-400 font-medium">0330 6105115</p>
              </div>
              <div className="flex items-center space-x-3">
                 <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                 <p className="text-sm text-slate-400 font-medium">oservices94@gmail.com</p>
              </div>
           </div>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-[11px] border-b border-white/10 pb-2">Daily Alerts</h3>
           <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">Subscribe to get the latest job notifications every day in your inbox.</p>
           <form className="flex flex-col space-y-3">
              <input type="email" placeholder="Your Email Address" className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest py-3 rounded-lg transition-all">Subscribe Now</button>
           </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
           © {currentYear} JobUstad · Career Services · All Rights Reserved
         </p>
      </div>
    </footer>
  );
}
