import { Link, Outlet } from "react-router-dom";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";

export function PublicLayout() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#0B1120] text-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">

          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-lg transition-all duration-300 group-hover:scale-105">
              <FileTextIcon className="h-5 w-5" />
            </div>

            <span
              className="text-2xl text-white"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
              }}
            >
              FastQuote
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>

        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
    <Outlet />
</main>
    </div>
  );
}