import { Link, Outlet } from "react-router-dom";
import { FileTextIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

/** Shared chrome for /signin and /register — the marketing nav from the
 *  homepage doesn't belong here, just a way back home and a theme toggle. */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <FileTextIcon className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Quotation Agent</span>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
