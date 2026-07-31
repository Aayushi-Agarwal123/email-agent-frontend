import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      setError("Fill in your business name, a valid email, and a password of at least 4 characters.");
      return;
    }
    // Demo mode has a single fixture tenant whose onboarding progress persists
    // in localStorage — without this reset, a new registration would inherit
    // whatever a previous demo session left behind and skip onboarding.
    if (IS_DEMO) resetDemoOnboardingState();
    signIn(email);
    // New accounts land in onboarding; existing accounts (Sign in) go straight to the dashboard.
    navigate("/onboarding", { replace: true });
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
        <CardHeader>
          <CardTitle
            className="text-[22px] font-normal tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
          >
            Create your account
          </CardTitle>
          <CardDescription className="text-[13px] text-[#71716A]">
            This is a demo environment — any details work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="register-business" className="text-[13px] font-medium text-[#1A1A1A]">
                Business name
              </Label>
              <Input
                id="register-business"
                placeholder="Golden Steel Supplier Co"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="register-email" className="text-[13px] font-medium text-[#1A1A1A]">
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="register-password" className="text-[13px] font-medium text-[#1A1A1A]">
                Password
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            {error && <p className="text-[13px] text-[#9A3B34]">{error}</p>}
            <Button
              type="submit"
              className="w-full rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7] shadow-none transition-transform hover:-translate-y-px hover:bg-[#1A1A1A]"
            >
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-[13px] text-[#71716A]">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-[#1A1A1A] hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
