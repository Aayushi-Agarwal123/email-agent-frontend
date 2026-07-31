import { Button } from "@/components/ui/button";

export function AttentionBanner() {
  return (
    <div className="flex items-center gap-3 rounded-[2px] border border-[#1A1A1A] bg-transparent px-4 py-3 text-[13px] text-[#1A1A1A]">
      <span>
        <span className="font-semibold">2 quotes are waiting for your review</span> — oldest has been waiting 3h 40m.
      </span>
      <Button
        size="sm"
        className="ml-auto shrink-0 rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7] shadow-none transition-transform hover:-translate-y-px hover:bg-[#1A1A1A]"
      >
        Review now
      </Button>
    </div>
  );
}
