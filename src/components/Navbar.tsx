import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, UserCircle, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topLinks = [
    { name: "NADRA Jobs", path: "/category/government" },
    { name: "FIA Jobs", path: "/category/government" },
    { name: "FBR Jobs", path: "/category/government" },
    { name: "WAPDA Jobs", path: "/category/government" },
  ];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Govt jobs", path: "/category/government" },
    { name: "Private jobs", path: "/category/private" },
    { name: "Newspaper Jobs", path: "/category/newspaper" },
    { name: "FPSC", path: "/category/government" },
    { name: "PPSC", path: "/category/government" },
    { name: "KPPSC", path: "/category/government" },
    { name: "BPSC", path: "/category/government" },
    { name: "SPSC", path: "/category/government" },
    { name: "Scholarships", path: "/category/scholarship" },
  ];

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Bar */}
      <div className="bg-[#4D4D4D] text-white py-2 px-4 sm:px-10 hidden sm:flex justify-center items-center space-x-6 text-[11px] font-bold uppercase tracking-wider">
        {topLinks.map((link) => (
          <Link key={link.name} to={link.path} className="hover:text-blue-300 transition-colors">
            {link.name}
          </Link>
        ))}
      </div>

      {/* Logo Section */}
      <div className="bg-white py-8 flex flex-col items-center justify-center border-b border-slate-100">
        <Link to="/" className="flex flex-col items-center group">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
            Job<span className="text-blue-600">Ustad</span>
          </h1>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">JobUstad Dashboard</span>
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
          </div>
          {/* Central Icon Representative of the Mentor/Ustad Figure */}
          <div className="mt-6 w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3429/3429370.png" 
               alt="Instructor" 
               className="w-full h-full object-contain filter grayscale opacity-20 border-b-4 border-blue-600 rounded-lg shadow-sm"
               referrerPolicy="no-referrer"
             />
          </div>
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#1E73BE] sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 h-full">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-4 h-full flex items-center text-[12px] font-bold text-white uppercase tracking-wider hover:bg-black/10 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-white hover:bg-black/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to="/admin"
              className="hidden sm:flex items-center space-x-2 px-4 py-1.5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <UserCircle className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu container */}
        <motion.div
           initial={false}
           animate={{ height: isMenuOpen ? "auto" : 0 }}
           className="lg:hidden overflow-hidden bg-[#1E73BE] border-t border-white/10"
        >
          <div className="px-4 py-4 flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-[12px] font-bold text-white uppercase tracking-wider border-b border-white/5 last:border-0"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
