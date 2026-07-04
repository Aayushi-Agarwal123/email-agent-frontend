import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { fetchSettings, updateReviewerEmail } from "@/lib/api";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function SettingsPage({ tenantId }: { tenantId: string }) {
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSettings(tenantId).then((s) => {
      if (alive) {
        setEmail(s.reviewerEmail ?? "");
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [tenantId]);

  const valid = EMAIL_RE.test(email.trim());
  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const s = await updateReviewerEmail(tenantId, email.trim());
      setEmail(s.reviewerEmail ?? "");
      setStatus({ kind: "ok", msg: "Saved. New quotations will be sent here for approval." });
    } catch {
      setStatus({ kind: "err", msg: "Could not save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Reviewer email</CardTitle>
        <CardDescription>
          The reviewer receives each draft quotation and approves it by replying to that email.
          Approvals happen over email, not in this dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reviewer">Reviewer email address</Label>
          <Input
            id="reviewer"
            type="email"
            placeholder="reviewer@company.com"
            value={email}
            disabled={!loaded || saving}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus(null);
            }}
          />
          {!valid && email.length > 0 && <p className="text-xs text-destructive">Enter a valid email address.</p>}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={!loaded || saving || !valid}>
            {saving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
          {status && (
            <span className={`flex items-center gap-1.5 text-sm ${status.kind === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
              {status.kind === "ok" && <CheckCircle2Icon className="h-4 w-4" />}
              {status.msg}
            </span>
          )}
        </div>

        <p className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Changing this reassigns who is trusted to approve priced quotations for your business — only
          set it to an address you control.
        </p>
      </CardContent>
    </Card>
  );
}
