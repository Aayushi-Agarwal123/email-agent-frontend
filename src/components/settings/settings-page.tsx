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
    <Card className="rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
      <CardHeader>
        <CardTitle
          className="text-[16px] font-normal text-[#1A1A1A]"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
        >
          Reviewer email
        </CardTitle>
        <CardDescription className="text-[13px] text-[#71716A]">
          The reviewer receives each draft quotation and approves it by replying to that email.
          Approvals happen over email, not in this dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reviewer" className="text-[13px] font-medium text-[#1A1A1A]">Reviewer email address</Label>
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
            className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
          />
          {!valid && email.length > 0 && <p className="text-[11px] text-[#9A3B34]">Enter a valid email address.</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={save}
            disabled={!loaded || saving || !valid}
            className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7] shadow-none transition-transform hover:-translate-y-px hover:bg-[#1A1A1A]"
          >
            {saving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
          {status && (
            <span className={`flex items-center gap-1.5 text-[13px] ${status.kind === "ok" ? "text-[#1D7A46]" : "text-[#9A3B34]"}`}>
              {status.kind === "ok" && <CheckCircle2Icon className="h-4 w-4" />}
              {status.msg}
            </span>
          )}
        </div>
        <p className="rounded-[2px] border border-[#DAD5C8] bg-transparent px-3 py-2 text-[11px] text-[#71716A]">
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
    <Card className="rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
      <CardHeader>
        <CardTitle
          className="text-[16px] font-normal text-[#1A1A1A]"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
        >
          Uploaded data
        </CardTitle>
        <CardDescription className="text-[13px] text-[#71716A]">Your catalog files. Add more any time (single file or .zip / .tar.gz, max 100 MB).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-[2px] border border-[#DAD5C8] bg-white px-3 py-2 text-[13px] text-[#1A1A1A] hover:border-[#1A1A1A]">
          <UploadIcon className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload file"}
          <input type="file" className="hidden" onChange={onUpload} disabled={busy} accept=".zip,.tar,.tar.gz,.tgz,.gz,.csv,.xlsx,.json,.txt,.pdf" />
        </label>
        {error && <p className="text-[13px] text-[#9A3B34]">{error}</p>}
        <div className="rounded-[2px] border border-[#DAD5C8] bg-white p-3">
          <FileTree nodes={tree} />
        </div>
      </CardContent>
    </Card>
  );
}
