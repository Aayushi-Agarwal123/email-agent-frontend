import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2Icon, Loader2Icon, UploadIcon } from "lucide-react";
import { FileTree } from "@/components/file-tree";
import { fetchSettings, updateReviewerEmail, fetchUploads, uploadFile, type TreeNode } from "@/lib/api";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function SettingsPage({ tenantId }: { tenantId: string }) {
  return (
    <div className="max-w-xl space-y-6">
      <ReviewerEmailCard tenantId={tenantId} />
      <UploadedDataCard tenantId={tenantId} />
    </div>
  );
}

function ReviewerEmailCard({ tenantId }: { tenantId: string }) {
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
    <Card>
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

function UploadedDataCard({ tenantId }: { tenantId: string }) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchUploads(tenantId).then((u) => alive && setTree(u.tree));
    return () => {
      alive = false;
    };
  }, [tenantId]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const res = await uploadFile(tenantId, file);
      setTree(res.tree);
    } catch (err) {
      setError(err instanceof Error && err.message ? `Upload failed: ${err.message}` : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded data</CardTitle>
        <CardDescription>Your catalog files. Add more any time (single file or .zip / .tar.gz, max 100 MB).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
          <UploadIcon className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload file"}
          <input type="file" className="hidden" onChange={onUpload} disabled={busy} accept=".zip,.tar,.tar.gz,.tgz,.gz,.csv,.xlsx,.json,.txt,.pdf" />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="rounded-md border border-border/50 bg-muted/20 p-3">
          <FileTree nodes={tree} />
        </div>
      </CardContent>
    </Card>
  );
}
