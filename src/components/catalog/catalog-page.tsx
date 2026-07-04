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

const CATEGORY_META: Record<string, { label: string; chip: string }> = {
  ball_valve: { label: "Ball valve", chip: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  butterfly_valve: { label: "Butterfly valve", chip: "bg-teal-500/15 text-teal-600 dark:text-teal-400" },
  gate_valve: { label: "Gate valve", chip: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  globe_valve: { label: "Globe valve", chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  check_valve: { label: "Check valve", chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
};

function CategoryChip({ category }: { category: string }) {
  const meta = CATEGORY_META[category];
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", meta?.chip ?? "bg-muted text-muted-foreground")}>
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

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Your price catalog is served by the retrieval (RAG) service. Showing sample data until that
          service's catalog endpoint is connected.
        </span>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle>Catalog</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - LIMIT))} aria-label="Previous page">
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {filtered.length > 0 ? `${offset + 1}-${Math.min(offset + LIMIT, filtered.length)} of ${filtered.length}` : "0"}
              </span>
              <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => setOffset((o) => o + LIMIT)} aria-label="Next page">
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", category === "" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}
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
                className="w-56"
              />
              <Button variant="outline" onClick={applySearch}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>End</TableHead>
                <TableHead>MOC</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows === null ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No catalog items match the filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow key={row.id}>
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
