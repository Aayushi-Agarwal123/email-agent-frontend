import { Link, Outlet } from "react-router-dom";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";

/** Shared chrome for /signin and /register — the marketing nav from the
 *  homepage doesn't belong here, just a way back home. */
export function PublicLayout() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#FCFBF7] text-[#1A1A1A]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header className="border-b border-[#DAD5C8]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border-[1.5px] border-[#1A1A1A] text-[#1A1A1A]">
              <FileTextIcon className="h-4 w-4" />
            </div>
            <span
              className="text-[17px] tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              FastQuote
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#71716A] hover:text-[#1A1A1A]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
