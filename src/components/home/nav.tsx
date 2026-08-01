import { FileTextIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function HomeNav() {
  const navigate = useNavigate();

  return (
    <header
      className="border-b border-[#DAD5C8] bg-[#FCFBF7]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border-[1.5px] border-[#1A1A1A] text-[#1A1A1A]">
            <FileTextIcon className="h-4 w-4" />
          </div>
          <span
            className="text-[17px] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
          >
            FastQuote
          </span>
        </div>

        <nav className="hidden items-center gap-5 text-[13px] font-medium sm:flex">
          <a href="#how-it-works" className="text-[#71716A] hover:text-[#1A1A1A]">How it works</a>
          <a href="#trust" className="text-[#71716A] hover:text-[#1A1A1A]">Security</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/signin" className="text-[13px] font-medium text-[#71716A] hover:text-[#1A1A1A]">
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] px-3.5 py-1.5 text-[12px] font-semibold text-[#FCFBF7] transition-transform hover:-translate-y-px"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
