"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { deleteObject, getStorage, ref as storageRef } from "firebase/storage";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Minimal toast shim using window.alert if provider absent
function useToastShim() {
  return {
    toast: ({ title }: { title: string }) => {
      try {
        // @ts-ignore
        const { useToast } = require("@/components/ui/toast");
        const { toast } = useToast();
        toast({ title });
      } catch {
        alert(title);
      }
    },
  } as const;
}

type ObserverDoc = {
  id: string;
  name: string;
  dob?: string;
  nidNumber: string;
  address: string;
  mobile: string;
  education?: string;
  ref1Text?: string;
  ref2Text?: string;
  ref1?: { name: string; mobile: string; nid: string; address: string };
  ref2?: { name: string; mobile: string; nid: string; address: string };
  files?: {
    photoURL?: string;
    certURL?: string;
    nidURL?: string;
    sigURL?: string;
  };
  createdAt?: Timestamp | null;
};

export default function ObserverApplicationsAdminPage() {
  const router = useRouter();
  const PAGE_SIZE = 50;
  const [rows, setRows] = useState<ObserverDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [pageCursors, setPageCursors] = useState<any[]>([]); // stack of last docs
  const [isLastPage, setIsLastPage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "mobile" | "nid">("name");
  const { toast } = useToastShim();

  // initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const q = query(
        collection(db, "ElectionObserverForm"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      if (!mounted) return;
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as ObserverDoc[];
      setRows(data);
      setTotalLoaded(data.length);
      setIsLastPage(snap.docs.length < PAGE_SIZE);
      setPageCursors(snap.docs.length ? [snap.docs[snap.docs.length - 1]] : []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function nextPage() {
    if (isLastPage || pageCursors.length === 0) return;
    setLoading(true);
    const last = pageCursors[pageCursors.length - 1];
    const q2 = query(
      collection(db, "ElectionObserverForm"),
      orderBy("createdAt", "desc"),
      startAfter(last),
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q2);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as ObserverDoc[];
    setRows(data);
    setIsLastPage(snap.docs.length < PAGE_SIZE);
    setPageCursors((prev) => [...prev, snap.docs[snap.docs.length - 1]]);
    setLoading(false);
  }

  async function prevPage() {
    if (pageCursors.length <= 1) return;
    setLoading(true);
    // Reload from beginning up to the previous cursor
    const prevCursor = pageCursors[pageCursors.length - 2];
    const q2 = query(
      collection(db, "ElectionObserverForm"),
      orderBy("createdAt", "desc"),
      startAfter(prevCursor),
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q2);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as ObserverDoc[];
    setRows(data);
    setIsLastPage(false);
    setPageCursors((prev) => prev.slice(0, -1));
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      if (searchBy === "name") return (r.name || "").toLowerCase().includes(q);
      if (searchBy === "mobile")
        return (r.mobile || "").toLowerCase().includes(q);
      return (r.nidNumber || "").toLowerCase().includes(q);
    });
  }, [rows, searchText, searchBy]);

  async function exportCSV() {
    setExporting(true);
    // Fetch ALL docs across pages (ignores current filters/search to export everything)
    const cols = ["SL", "Name", "Address", "NID", "Phone", "Reference"];
    const lines = [cols.join(",")];
    try {
      const all: ObserverDoc[] = [];
      let last: any | null = null;
      while (true) {
        const q = last
          ? query(
              collection(db, "ElectionObserverForm"),
              orderBy("createdAt", "desc"),
              startAfter(last),
              limit(PAGE_SIZE)
            )
          : query(
              collection(db, "ElectionObserverForm"),
              orderBy("createdAt", "desc"),
              limit(PAGE_SIZE)
            );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as ObserverDoc[];
        all.push(...data);
        if (snap.docs.length < PAGE_SIZE) break;
        last = snap.docs[snap.docs.length - 1];
      }
      all.forEach((r, i) => {
        const reference = r.ref1Text || "";
        const row = [i + 1, r.name, r.address, r.nidNumber, r.mobile, reference]
          .map((v) => (v == null ? "" : String(v)))
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",");
        lines.push(row);
      });
    } catch (e) {
      // fall back to current filtered if fetching all fails for some reason
      filtered.forEach((r, i) => {
        const reference = r.ref1Text || "";
        const baseIndex =
          (pageCursors.length ? pageCursors.length - 1 : 0) * PAGE_SIZE;
        const row = [
          baseIndex + i + 1,
          r.name,
          r.address,
          r.nidNumber,
          r.mobile,
          reference,
        ]
          .map((v) => (v == null ? "" : String(v)))
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",");
        lines.push(row);
      });
    }
    const blob = new Blob(["\ufeff" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    a.download = `Election 2026 Observer application - ${yyyy}-${mm}-${dd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  async function handleDelete(id: string, files?: ObserverDoc["files"]) {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      // delete Firestore doc
      await deleteDoc(doc(collection(db, "ElectionObserverForm"), id));
      // attempt to delete storage objects via URLs if present
      const urls = [
        files?.photoURL,
        files?.certURL,
        files?.nidURL,
        files?.sigURL,
      ].filter(Boolean) as string[];
      await Promise.all(
        urls.map(async (u) => {
          try {
            const r = storageRef(getStorage(), u);
            await deleteObject(r).catch(() => {});
          } catch {}
        })
      );
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted" });
    } catch (e: any) {
      toast({ title: e?.message || "Delete failed" });
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            পর্যবেক্ষক আবেদন
          </h1>
          <p className="text-sm text-foreground/70">
            List of all election observer applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as any)}
              className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="mobile">Phone</option>
              <option value="nid">NID</option>
            </select>
            <div className="relative">
              <Search
                className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/60"
                aria-hidden
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Search by ${searchBy}`}
                className="w-[320px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <Button size="sm" onClick={exportCSV} disabled={exporting}>
            {exporting ? "Downloading..." : "Export CSV"}
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">All Applications</h2>
          <Badge variant="outline">
            {filtered.length}/{rows.length}
          </Badge>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3 w-16">SL</th>
                <th className="p-3">Name</th>
                <th className="p-3">Address</th>
                <th className="p-3">NID Number</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td className="p-3 text-foreground/70">
                    {(pageCursors.length ? pageCursors.length - 1 : 0) *
                      PAGE_SIZE +
                      i +
                      1}
                  </td>
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.address}</td>
                  <td className="p-3">{r.nidNumber}</td>
                  <td className="p-3">{r.mobile}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={() =>
                          router.push(
                            `/admin/observer-applications/view?id=${r.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2"
                        onClick={() => handleDelete(r.id, r.files)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-foreground/60"
                  >
                    {loading ? "Loading..." : "No data"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="sm:hidden flex items-center gap-2">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as any)}
              className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-xs"
            >
              <option value="name">Name</option>
              <option value="mobile">Phone</option>
              <option value="nid">NID</option>
            </select>
            <div className="relative">
              <Search
                className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/60"
                aria-hidden
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Search ${searchBy}`}
                className="w-[200px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 pl-8 pr-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={prevPage}
              disabled={pageCursors.length <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={nextPage}
              disabled={isLastPage || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
