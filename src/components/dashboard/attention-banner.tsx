import { Button } from "@/components/ui/button";

export function AttentionBanner() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-attention bg-attention-bg px-4 py-3 text-sm">
      <span>
        <span className="font-semibold">2 quotes are waiting for your review</span> — oldest has been waiting 3h 40m.
      </span>
      <Button size="sm" className="ml-auto shrink-0">
        Review now
      </Button>
    </div>
  );
}
