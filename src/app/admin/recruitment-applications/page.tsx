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

type RecruitDoc = {
  id: string;
  fullName: string;
  education?: string;
  nidNumber: string;
  mobile: string;
  address?: string;
  position?: string;
  experience?: string;
  files?: {
    photoURL?: string;
    certURL?: string;
    nidURL?: string;
  };
  createdAt?: Timestamp | null;
};

export default function RecruitmentApplicationsAdminPage() {
  const router = useRouter();
  const PAGE_SIZE = 50;
  const [rows, setRows] = useState<RecruitDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pageCursors, setPageCursors] = useState<any[]>([]);
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
        collection(db, "RecruitmentApplication"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      if (!mounted) return;
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as RecruitDoc[];
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

  const [totalLoaded, setTotalLoaded] = useState(0);

  async function nextPage() {
    if (isLastPage || pageCursors.length === 0) return;
    setLoading(true);
    const last = pageCursors[pageCursors.length - 1];
    const q2 = query(
      collection(db, "RecruitmentApplication"),
      orderBy("createdAt", "desc"),
      startAfter(last),
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q2);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as RecruitDoc[];
    setRows(data);
    setIsLastPage(snap.docs.length < PAGE_SIZE);
    setPageCursors((prev) => [...prev, snap.docs[snap.docs.length - 1]]);
    setLoading(false);
  }

  async function prevPage() {
    if (pageCursors.length <= 1) return;
    setLoading(true);
    const prevCursor = pageCursors[pageCursors.length - 2];
    const q2 = query(
      collection(db, "RecruitmentApplication"),
      orderBy("createdAt", "desc"),
      startAfter(prevCursor),
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q2);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as RecruitDoc[];
    setRows(data);
    setIsLastPage(false);
    setPageCursors((prev) => prev.slice(0, -1));
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      if (searchBy === "name")
        return (r.fullName || "").toLowerCase().includes(q);
      if (searchBy === "mobile")
        return (r.mobile || "").toLowerCase().includes(q);
      return (r.nidNumber || "").toLowerCase().includes(q);
    });
  }, [rows, searchText, searchBy]);

  async function exportCSV() {
    setExporting(true);
    // Include human-readable application date
    const cols = ["SL", "Name", "Education", "NID", "Phone", "ApplicationDate"];
    const lines = [cols.join(",")];
    try {
      const all: RecruitDoc[] = [];
      let last: any | null = null;
      while (true) {
        const qAll = last
          ? query(
              collection(db, "RecruitmentApplication"),
              orderBy("createdAt", "desc"),
              startAfter(last),
              limit(PAGE_SIZE)
            )
          : query(
              collection(db, "RecruitmentApplication"),
              orderBy("createdAt", "desc"),
              limit(PAGE_SIZE)
            );
        const snap = await getDocs(qAll);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as RecruitDoc[];
        all.push(...data);
        if (snap.docs.length < PAGE_SIZE) break;
        last = snap.docs[snap.docs.length - 1];
      }

      // Apply current search filter across ALL data
      const qtext = searchText.trim().toLowerCase();
      const filteredAll = qtext
        ? all.filter((r) => {
            if (searchBy === "name")
              return (r.fullName || "").toLowerCase().includes(qtext);
            if (searchBy === "mobile")
              return (r.mobile || "").toLowerCase().includes(qtext);
            return (r.nidNumber || "").toLowerCase().includes(qtext);
          })
        : all;

      filteredAll.forEach((r, i) => {
        const created = (r.createdAt as any)?.toDate
          ? (r.createdAt as any).toDate().toLocaleString()
          : "";
        const row = [
          i + 1,
          r.fullName,
          r.education || "",
          r.nidNumber,
          r.mobile,
          created,
        ]
          .map((v) => (v == null ? "" : String(v)))
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",");
        lines.push(row);
      });
    } finally {
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
      a.download = `Recruitment applications - ${yyyy}-${mm}-${dd}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    }
  }

  async function handleDelete(id: string, files?: RecruitDoc["files"]) {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteDoc(doc(collection(db, "RecruitmentApplication"), id));
      const urls = [files?.photoURL, files?.certURL, files?.nidURL].filter(
        Boolean
      ) as string[];
      await Promise.all(
        urls.map(async (u) => {
          try {
            const r = storageRef(getStorage(), u);
            await deleteObject(r).catch(() => {});
          } catch {}
        })
      );
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Recruitment Applications
          </h1>
          <p className="text-sm text-foreground/70">
            List of all job applications.
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
                <th className="p-3">Education</th>
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
                  <td className="p-3 font-medium">{r.fullName}</td>
                  <td className="p-3">{r.education || ""}</td>
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
                            `/admin/recruitment-applications/view?id=${r.id}`
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
                    colSpan={6}
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
