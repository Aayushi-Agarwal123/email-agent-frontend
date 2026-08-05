import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMockSession } from "@/lib/mock-session";
import { IS_DEMO, resetDemoOnboardingState } from "@/lib/api";

export function RegisterPage() {
  const { signIn } = useMockSession();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!businessName.trim() || !email.includes("@") || password.length < 4) {
      setError(
        "Fill in your business name, a valid email, and a password of at least 4 characters."
      );
      return;
    }

    if (IS_DEMO) resetDemoOnboardingState();

    signIn(email);
    navigate("/onboarding", { replace: true });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0B1120] px-6 py-16"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">

        <CardHeader className="space-y-3 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
            F
          </div>

          <CardTitle
            className="text-3xl font-semibold text-white"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Create your account
          </CardTitle>

          <CardDescription className="text-slate-400">
            Create your FastQuote workspace and automate your quotation process.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <Label
                htmlFor="register-business"
                className="text-sm font-medium text-slate-200"
              >
                Business Name
              </Label>

              <Input
                id="register-business"
                placeholder="Golden Steel Supplier Co."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="register-email"
                className="text-sm font-medium text-slate-200"
              >
                Email Address
              </Label>

              <Input
                id="register-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="register-password"
                className="text-sm font-medium text-slate-200"
              >
                Password
              </Label>

              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              Create Account
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Sign In
            </Link>
          </p>

        </CardContent>

      </Card>
    </div>
  );
}