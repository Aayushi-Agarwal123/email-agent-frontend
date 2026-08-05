import { FileTextIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function HomeNav() {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo */}
        <div className="group flex items-center gap-4 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/30">
            <FileTextIcon className="h-5 w-5" />
          </div>

          <span
            className="text-2xl tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-300"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
            }}
          >
            FastQuote
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <Link
            to="/signin"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            Sign In
          </Link>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/40"
          >
            Get Started
          </button>

        </div>
      </div>
    </header>
  );
}