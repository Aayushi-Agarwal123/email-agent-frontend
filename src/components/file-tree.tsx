import { FileIcon, FolderIcon } from "lucide-react";
import type { TreeNode } from "@/lib/api";

function humanSize(n?: number): string {
  if (n == null) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileTree({ nodes, depth = 0 }: { nodes: TreeNode[]; depth?: number }) {
  if (nodes.length === 0) {
    return <p className="text-[13px] text-[#71716A]">No files uploaded yet.</p>;
  }
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.name}>
          <div className="flex items-center gap-2 text-[13px] text-[#1A1A1A]" style={{ paddingLeft: depth * 16 }}>
            {n.type === "dir" ? (
              <FolderIcon className="h-4 w-4 shrink-0 text-[#1A1A1A]" />
            ) : (
              <FileIcon className="h-4 w-4 shrink-0 text-[#71716A]" />
            )}
            <span className="truncate">{n.name}</span>
            {n.type === "file" && <span className="ml-auto text-[11px] text-[#71716A]">{humanSize(n.size)}</span>}
          </div>
          {n.children && n.children.length > 0 && <FileTree nodes={n.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}
