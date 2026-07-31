import { useEffect, useMemo, useState } from "react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCatalog, type CatalogRow } from "@/lib/api";
import { cn } from "@/lib/utils";

const LIMIT = 6;

// One restrained neutral chip style for every category — color here would just be
// decoration, not meaning (status color is reserved for review/health state).
const CATEGORY_META: Record<string, { label: string }> = {
  ball_valve: { label: "Ball valve" },
  butterfly_valve: { label: "Butterfly valve" },
  gate_valve: { label: "Gate valve" },
  globe_valve: { label: "Globe valve" },
  check_valve: { label: "Check valve" },
};

function CategoryChip({ category }: { category: string }) {
  const meta = CATEGORY_META[category];
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-[2px] border border-[#DAD5C8] px-2 py-0.5 text-[11px] font-medium text-[#71716A]">
      {meta?.label ?? category}
    </span>
  );
}

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const attr = (row: CatalogRow, key: string) => row.attributes[key] ?? "—";

export function CatalogPage({ tenantId }: { tenantId: string }) {
  const [rows, setRows] = useState<CatalogRow[] | null>(null);
  const [category, setCategory] = useState("");
  const [draftQ, setDraftQ] = useState("");
  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchCatalog(tenantId).then((d) => {
      if (alive) setRows(d.rows);
    });
    return () => {
      alive = false;
    };
  }, [tenantId]);

  const categories = useMemo(() => [...new Set((rows ?? []).map((r) => r.category))], [rows]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (!category || r.category === category) &&
        (!term ||
          r.label.toLowerCase().includes(term) ||
          Object.values(r.attributes).some((v) => v.toLowerCase().includes(term))),
    );
  }, [rows, category, q]);

  const pageRows = filtered.slice(offset, offset + LIMIT);
  const hasNext = offset + LIMIT < filtered.length;

  const setFilterCategory = (c: string) => {
    setOffset(0);
    setCategory(c);
  };
  const applySearch = () => {
    setOffset(0);
    setQ(draftQ.trim());
  };

  const pillBase = "rounded-[2px] border px-3 py-1 text-[11px] font-medium transition-colors";
  const pillActive = "border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7]";
  const pillInactive = "border-[#DAD5C8] text-[#71716A] hover:border-[#1A1A1A] hover:text-[#1A1A1A]";

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex items-start gap-2 rounded-[2px] border border-[#DAD5C8] bg-transparent px-4 py-2.5 text-[11px] text-[#71716A]">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Your price catalog is served by the retrieval (RAG) service. Showing sample data until that
          service's catalog endpoint is connected.
        </span>
      </div>

      <Card className="rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle
              className="text-[16px] font-normal text-[#1A1A1A]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              Catalog
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
                aria-label="Previous page"
                className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-transparent text-[#1A1A1A] shadow-none hover:bg-transparent hover:-translate-y-px"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-[13px] text-[#71716A]">
                {filtered.length > 0 ? `${offset + 1}-${Math.min(offset + LIMIT, filtered.length)} of ${filtered.length}` : "0"}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                onClick={() => setOffset((o) => o + LIMIT)}
                aria-label="Next page"
                className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-transparent text-[#1A1A1A] shadow-none hover:bg-transparent hover:-translate-y-px"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              className={cn(pillBase, category === "" ? pillActive : pillInactive)}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={cn(pillBase, category === c ? pillActive : pillInactive)}
              >
                {CATEGORY_META[c]?.label ?? c}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <Input
                placeholder="Search model, MOC, size…"
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                className="w-56 rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
              <Button
                variant="outline"
                onClick={applySearch}
                className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-transparent text-[#1A1A1A] shadow-none hover:bg-transparent hover:-translate-y-px"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="text-[13px] text-[#1A1A1A]">
            <TableHeader>
              <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Category</TableHead>
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Item</TableHead>
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Class</TableHead>
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">End</TableHead>
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">MOC</TableHead>
                <TableHead className="h-9 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Size</TableHead>
                <TableHead className="h-9 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#71716A]">Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows === null ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`} className="border-[#DAD5C8] hover:bg-transparent">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow className="border-[#DAD5C8] hover:bg-transparent">
                  <TableCell colSpan={7} className="py-10 text-center text-[#71716A]">
                    No catalog items match the filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow key={row.id} className="border-[#DAD5C8] hover:bg-[#F9F7F1]">
                    <TableCell>
                      <CategoryChip category={row.category} />
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-medium" title={row.label}>
                      {row.label}
                    </TableCell>
                    <TableCell>{attr(row, "pressure_class")}</TableCell>
                    <TableCell className="capitalize">{attr(row, "end_type")}</TableCell>
                    <TableCell>{attr(row, "moc")}</TableCell>
                    <TableCell>{attr(row, "size")}</TableCell>
                    <TableCell className="text-right tabular-nums">{money(row.unitPrice, row.currency)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
