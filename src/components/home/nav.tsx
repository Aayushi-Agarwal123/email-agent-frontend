import { FileTextIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function HomeNav() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
            <FileTextIcon className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">Quotation Agent</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#trust" className="hover:text-foreground">Security</a>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Button size="sm" onClick={() => navigate("/register")}>Get started</Button>
        </div>
      </div>
    </header>
  );
}
