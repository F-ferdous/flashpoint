"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import districtsData from "@/lib/districts.json";
import { db, app, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  where,
  setDoc,
  runTransaction,
  getDocs,
  limit,
  deleteDoc,
  getDoc,
  orderBy,
  startAfter,
  startAt,
} from "firebase/firestore";
import { getApps, initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { Search } from "lucide-react";

type Customer = {
  id: string;
  customerId?: string | null;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  phone?: string | null;
  age?: number | null;
  nid?: string | null;
  address?: string | null;
  district?: string | null;
  bank?: string | null;
  nidPhotoUrl?: string | null;
  password?: string | null;
  status?: "Active" | "Blocked" | "Frozen";
  statusReason?: string | null;
  referrerId?: string | null;
  createdAt?: number | null;
};

const DISTRICTS: string[] = ((districtsData as any).districts || []).map(
  (d: { name: string }) => d.name
);

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const PAGE_SIZE = 20;
  const [loading, setLoading] = useState(false);
  const [pageStarts, setPageStarts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "customerId">(
    "name"
  );
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Customer | null>(null);
  const [savingView, setSavingView] = useState(false);
  const [showViewPassword, setShowViewPassword] = useState(false);
  const { toast } = useToast();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [pointsMap, setPointsMap] = useState<Record<string, number>>({});
  const [allApprovedCache, setAllApprovedCache] = useState<Customer[] | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState(false);

  // Export customers to a real .xlsx file using SheetJS (dynamic import with CDN fallback)
  async function exportCustomers() {
    try {
      // Fetch ALL approved customers across all pages
      const ALL_BATCH = 500;
      let allCustomers: Customer[] = [];
      let cursor: any | null = null;
      while (true) {
        const base = [
          collection(db, "Customers"),
          orderBy("createdAt", sortOrder),
        ];
        const q = cursor
          ? query(
              base[0] as any,
              base[1] as any,
              startAfter(cursor),
              limit(ALL_BATCH)
            )
          : query(base[0] as any, base[1] as any, limit(ALL_BATCH));
        const snap = await getDocs(q);
        const docs = snap.docs;
        if (docs.length === 0) break;
        for (let i = 0; i < docs.length; i++) {
          const d = docs[i];
          const x = d.data() as any;
          if (x?.Approved === true) {
            allCustomers.push({
              id: d.id,
              customerId: x.CustomerID ?? null,
              name: x.fullName ?? x.name ?? null,
              email: x.email ?? null,
              username: x.username ?? x.email ?? null,
              phone: x.phone || x.phoneNumber || null,
              age: x.age ?? null,
              nid: x.nidNumber ?? x.nid ?? null,
              address: x.address ?? null,
              district: x.district ?? null,
              bank: x.bank ?? null,
              nidPhotoUrl: x.nidPhotoUrl ?? null,
              password: x.password ?? null,
              status: (x.status as Customer["status"]) ?? "Active",
              statusReason: x.statusReason ?? null,
              referrerId: x.ReferrerID ?? null,
              createdAt: x.createdAt ?? null,
            } as Customer);
          }
        }
        cursor = docs[docs.length - 1] || null;
        if (!cursor) break;
        if (docs.length < ALL_BATCH) break;
      }

      const headers = [
        "Name",
        "Customer ID",
        "Referrer Name",
        "Email",
        "Username",
        "Phone",
        "Age",
        "NID",
        "Address",
        "Bank",
        "Joining date",
        "Total Points",
        "Status",
        "Status Reason",
      ];

      const escapeXml = (v: any) =>
        String(v ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

      // Build referrer name map from ReferrerID -> name (Agents or Customers collection)
      const uniqueRefIds = Array.from(
        new Set(
          allCustomers
            .map((c) => (c.referrerId || "").trim())
            .filter((id) => id && id !== "null")
        )
      );

      const refNameMap = new Map<string, string>();
      await Promise.all(
        uniqueRefIds.map(async (rid) => {
          try {
            const ag = await getDoc(doc(collection(db, "Agents"), rid));
            if (ag.exists()) {
              const ax = ag.data() as any;
              refNameMap.set(
                rid,
                String(ax.fullName || ax.name || ax.email || rid)
              );
              return;
            }
            const cu = await getDoc(doc(collection(db, "Customers"), rid));
            if (cu.exists()) {
              const cx = cu.data() as any;
              refNameMap.set(
                rid,
                String(cx.fullName || cx.name || cx.email || rid)
              );
              return;
            }
            refNameMap.set(rid, rid);
          } catch {
            refNameMap.set(rid, rid);
          }
        })
      );

      // Build total points per customerId across collections
      const uniqueCids = Array.from(
        new Set(
          allCustomers.map((c) => (c.customerId || "").trim()).filter(Boolean)
        )
      );
      const totalsMap = new Map<string, number>();
      await Promise.all(
        uniqueCids.map(async (cid) => {
          try {
            const [agentSnap, onlineSnap, adminSnap] = await Promise.all([
              getDocs(
                query(
                  collection(db, "AgentToCustomerTransfer"),
                  where("customerId", "==", cid)
                )
              ),
              getDocs(
                query(
                  collection(db, "CustomerEarningsFromOnline"),
                  where("customerId", "==", cid)
                )
              ),
              getDocs(
                query(
                  collection(db, "AdminToCustomerTransfer"),
                  where("customerId", "==", cid)
                )
              ),
            ]);
            const agentTotal = agentSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.amount || 0);
            }, 0);
            const onlineTotal = onlineSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.pointsEarned || 0);
            }, 0);
            const adminTotal = adminSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.amount || 0);
            }, 0);
            totalsMap.set(cid, agentTotal + onlineTotal + adminTotal);
          } catch {
            totalsMap.set(cid, 0);
          }
        })
      );

      // Prepare row objects for XLSX
      const rows = allCustomers.map((c) => {
        const refName = c.referrerId ? refNameMap.get(c.referrerId) || "" : "";
        const cid = (c.customerId || "").trim();
        const totalPoints = cid ? totalsMap.get(cid) ?? "" : "";
        return {
          Name: c.name || "",
          "Customer ID": c.customerId || "",
          "Referrer Name": refName,
          Email: c.email || "",
          Username: c.username || "",
          Phone: c.phone || "",
          Age: c.age ?? "",
          NID: c.nid || "",
          Address: c.address || "",
          Bank: c.bank || "",
          "Joining date": formatDate(c.createdAt),
          "Total Points": totalPoints,
          Status: c.status || "",
          "Status Reason": c.statusReason || "",
        } as const;
      });

      // Dynamic import SheetJS; fall back to CDN if local dep not installed
      let XLSX: any;
      try {
        const dynImport: any = new Function("u", "return import(u)");
        const mod: any = await dynImport("xlsx");
        XLSX = mod && mod.default ? mod.default : mod;
      } catch {
        const dynImport: any = new Function("u", "return import(u)");
        const mod: any = await dynImport(
          "https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs"
        );
        XLSX = mod && mod.default ? mod.default : mod;
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
      XLSX.utils.book_append_sheet(wb, ws, "Customers");
      const wbout: ArrayBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `CustomerList_${date}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({
        title: err?.message || "Failed to export customers",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    (async () => {
      // reset cursors on sort change
      setPageStarts([]);
      setLastDoc(null);
      await loadPage();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  async function loadPage(startFrom?: any | null) {
    setLoading(true);
    try {
      const BATCH = 120; // fetch more than we need to assemble 20 approved
      const base = [
        collection(db, "Customers"),
        orderBy("createdAt", sortOrder),
      ];
      const q = startFrom
        ? query(
            base[0] as any,
            base[1] as any,
            startAfter(startFrom),
            limit(BATCH)
          )
        : query(base[0] as any, base[1] as any, limit(BATCH));
      const snap = await getDocs(q);
      const docs = snap.docs;
      let approved: Customer[] = [];
      let stopIndex = -1;
      for (let i = 0; i < docs.length; i++) {
        const d = docs[i];
        const x = d.data() as any;
        if (x?.Approved === true) {
          approved.push({
            id: d.id,
            customerId: x.CustomerID ?? null,
            name: x.fullName ?? x.name ?? null,
            email: x.email ?? null,
            username: x.username ?? x.email ?? null,
            phone: x.phone || x.phoneNumber || null,
            age: x.age ?? null,
            nid: x.nidNumber ?? x.nid ?? null,
            address: x.address ?? null,
            district: x.district ?? null,
            bank: x.bank ?? null,
            nidPhotoUrl: x.nidPhotoUrl ?? null,
            password: x.password ?? null,
            status: (x.status as Customer["status"]) ?? "Active",
            statusReason: x.statusReason ?? null,
            referrerId: x.ReferrerID ?? null,
            createdAt: x.createdAt ?? null,
          } as Customer);
        }
        if (approved.length === PAGE_SIZE) {
          stopIndex = i;
          break;
        }
      }

      setCustomers(approved);
      // Determine cursors and hasMore
      if (approved.length < PAGE_SIZE) {
        setHasMore(docs.length === BATCH); // if batch full, there might be more
      } else {
        setHasMore(true);
      }
      const firstRaw = docs[0] || null;
      const lastRaw =
        stopIndex >= 0 ? docs[stopIndex] : docs[docs.length - 1] || null;
      setLastDoc(lastRaw);
      setPageStarts((prev) =>
        startFrom ? [...prev, firstRaw] : firstRaw ? [firstRaw] : []
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadNextPage() {
    if (!lastDoc || !hasMore) return;
    await loadPage(lastDoc);
  }

  async function loadPrevPage() {
    if (pageStarts.length <= 1) return; // already at first page
    const prevStart = pageStarts[pageStarts.length - 2] || null;
    // Reset to previous start and rebuild pagination stack accordingly
    setPageStarts((prev) => prev.slice(0, prev.length - 1));
    await loadPage(prevStart);
  }

  // Reset password visibility whenever switching the viewed customer or closing the modal
  useEffect(() => {
    setShowViewPassword(false);
  }, [view]);

  const filteredCustomers = useMemo(() => {
    const q = searchText.trim();
    const base = q ? allApprovedCache || customers : customers;
    if (!q) return base;
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D+/g, "");
    return base.filter((c) => {
      if (searchBy === "name") {
        return (c.name || "").toLowerCase().includes(qLower);
      }
      if (searchBy === "customerId") {
        return (c.customerId || "").toUpperCase().includes(q.toUpperCase());
      }
      const phone = (c.phone || "").replace(/\D+/g, "");
      return qDigits.length > 0 && phone.includes(qDigits);
    });
  }, [customers, allApprovedCache, searchText, searchBy]);

  // When searching, load all approved customers into cache once
  useEffect(() => {
    const q = searchText.trim();
    if (!q) return; // only build cache when user is searching
    if (allApprovedCache && allApprovedCache.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        setSearchLoading(true);
        const ALL_BATCH = 500;
        let acc: Customer[] = [];
        let cursor: any | null = null;
        while (true) {
          const base = [
            collection(db, "Customers"),
            orderBy("createdAt", sortOrder),
          ];
          const qRef = cursor
            ? query(
                base[0] as any,
                base[1] as any,
                startAfter(cursor),
                limit(ALL_BATCH)
              )
            : query(base[0] as any, base[1] as any, limit(ALL_BATCH));
          const snap = await getDocs(qRef);
          const docs = snap.docs;
          if (docs.length === 0) break;
          for (let i = 0; i < docs.length; i++) {
            const d = docs[i];
            const x = d.data() as any;
            if (x?.Approved === true) {
              acc.push({
                id: d.id,
                customerId: x.CustomerID ?? null,
                name: x.fullName ?? x.name ?? null,
                email: x.email ?? null,
                username: x.username ?? x.email ?? null,
                phone: x.phone || x.phoneNumber || null,
                age: x.age ?? null,
                nid: x.nidNumber ?? x.nid ?? null,
                address: x.address ?? null,
                district: x.district ?? null,
                bank: x.bank ?? null,
                nidPhotoUrl: x.nidPhotoUrl ?? null,
                password: x.password ?? null,
                status: (x.status as Customer["status"]) ?? "Active",
                statusReason: x.statusReason ?? null,
                referrerId: x.ReferrerID ?? null,
                createdAt: x.createdAt ?? null,
              } as Customer);
            }
          }
          cursor = docs[docs.length - 1] || null;
          if (!cursor) break;
          if (docs.length < ALL_BATCH) break;
        }
        if (!cancelled) setAllApprovedCache(acc);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchText, sortOrder, allApprovedCache]);

  const formatDate = (ms?: number | null) => {
    if (!ms) return "—";
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Load Total Points for customers in the current page
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const entries = await Promise.all(
          customers.map(async (c) => {
            const cid = (c.customerId || "").trim();
            if (!cid) return [cid, 0] as const;
            const [agentSnap, onlineSnap, adminSnap] = await Promise.all([
              getDocs(
                query(
                  collection(db, "AgentToCustomerTransfer"),
                  where("customerId", "==", cid)
                )
              ),
              getDocs(
                query(
                  collection(db, "CustomerEarningsFromOnline"),
                  where("customerId", "==", cid)
                )
              ),
              getDocs(
                query(
                  collection(db, "AdminToCustomerTransfer"),
                  where("customerId", "==", cid)
                )
              ),
            ]);
            const agentTotal = agentSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.amount || 0);
            }, 0);
            const onlineTotal = onlineSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.pointsEarned || 0);
            }, 0);
            const adminTotal = adminSnap.docs.reduce((sum, d) => {
              const x: any = d.data() || {};
              return sum + Number(x.amount || 0);
            }, 0);
            return [cid, agentTotal + onlineTotal + adminTotal] as const;
          })
        );
        if (cancelled) return;
        setPointsMap((prev) => {
          const next = { ...prev };
          for (const [cid, total] of entries) {
            if (cid) next[cid] = total;
          }
          return next;
        });
      } catch (e) {
        // ignore errors in totals; leaves placeholders
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [customers]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();
    const referrerId = String(form.get("referrerId") || "").trim();
    const age = form.get("age") ? Number(form.get("age")) : undefined;
    const nid = String(form.get("nid") || "").trim();
    const address = String(form.get("address") || "").trim();
    const district = String(form.get("district") || "").trim();
    const bank = String(form.get("bank") || "").trim();
    const phone = String(form.get("phone") || "").trim();

    try {
      if (!name || !email || !password || !district || !phone || !referrerId) {
        throw new Error(
          "Name, email, phone, password, district and Referrer ID are required"
        );
      }

      const [cEmailSnap, cPhoneSnap, pEmailSnap, pPhoneSnap] =
        await Promise.all([
          getDocs(
            query(
              collection(db, "Customers"),
              where("email", "==", email),
              limit(1)
            )
          ),
          getDocs(
            query(
              collection(db, "Customers"),
              where("phone", "==", phone),
              limit(1)
            )
          ),
          getDocs(
            query(
              collection(db, "PendingUsers"),
              where("email", "==", email),
              limit(1)
            )
          ),
          getDocs(
            query(
              collection(db, "PendingUsers"),
              where("phone", "==", phone),
              limit(1)
            )
          ),
        ]);
      const emailDuplicate = !cEmailSnap.empty || !pEmailSnap.empty;
      const phoneDuplicate = !cPhoneSnap.empty || !pPhoneSnap.empty;
      if (emailDuplicate || phoneDuplicate) {
        if (emailDuplicate && phoneDuplicate) {
          throw new Error("This email and phone number are already in use.");
        } else if (emailDuplicate) {
          throw new Error("This email is already in use.");
        } else {
          throw new Error("This phone number is already in use.");
        }
      }

      // 1) Create Auth user with secondary app to keep admin session
      const secondary =
        getApps().find((a) => a.name === "secondary") ||
        initializeApp(app.options as any, "secondary");
      const secAuth = getAuth(secondary);
      const cred = await createUserWithEmailAndPassword(
        secAuth,
        email,
        password
      );
      const uid = cred.user.uid;

      // 2) Generate CustomerID using global counter: C + 6 digits (C000001, C000002, ...)
      const counterRef = doc(collection(db, "counters"), "customer_serial");
      const CustomerID = await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        const current = (snap.exists() ? (snap.data() as any)?.seq : 0) || 0;
        const next = current + 1;
        tx.set(
          counterRef,
          { seq: next, type: "customer", updatedAt: Date.now() },
          { merge: true }
        );
        return `C${String(next).padStart(6, "0")}`;
      });

      // 3) Persist in Customers with Role and ReferralID auto-generated
      const adminEmail = auth.currentUser?.email || "Admin";
      const customerDocRef = doc(collection(db, "Customers"), uid);
      const data = {
        uid,
        fullName: name,
        email,
        phone: phone || null,
        age: age ?? null,
        nidNumber: nid || null,
        address: address || null,
        district: district || null,
        bank: bank || null,
        password: password || null,
        Role: "Customer",
        Approved: true,
        CustomerID,
        ReferrerID: referrerId,
        adminEmail,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as const;
      await setDoc(customerDocRef, data, { merge: true });

      // 4) Cleanup secondary auth
      await signOut(secAuth).catch(() => {});
      if (secondary.name === "secondary") {
        deleteApp(secondary as any).catch(() => {});
      }

      setOpen(false);
      toast({ title: "Customer created", variant: "success" });
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      toast({
        title: err?.message || "Failed to create customer",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Customer
          </h1>
          <p className="text-sm text-foreground/70">
            Lookup and manage customer accounts.
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
              <option value="phone">Mobile</option>
              <option value="customerId">Customer ID</option>
            </select>
            <div className="relative">
              <Search
                className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/60"
                aria-hidden
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Search by ${
                  searchBy === "phone" ? "mobile" : searchBy
                }`}
                className="w-[320px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <Button size="sm" variant="secondary" onClick={exportCustomers}>
            Export
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            Add Customer
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Customers</h2>
          <div className="flex gap-2 items-center">
            <div className="sm:hidden flex items-center gap-2">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as any)}
                className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-xs"
              >
                <option value="name">Name</option>
                <option value="phone">Mobile</option>
                <option value="customerId">Customer ID</option>
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
            <Badge variant="outline">
              {filteredCustomers.length}/
              {searchText.trim()
                ? allApprovedCache?.length ?? customers.length
                : customers.length}
            </Badge>
            <div className="flex items-center gap-2 ml-2">
              <label htmlFor="order" className="text-xs text-foreground/70">
                Order
              </label>
              <select
                id="order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-1.5 text-xs"
              >
                <option value="desc">Descending (Newest first)</option>
                <option value="asc">Ascending (Oldest first)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadPrevPage}
                disabled={loading || pageStarts.length <= 1}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={loadNextPage}
                disabled={loading || !hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Joining date</th>
                <th className="p-3">Total Points</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium">{c.name || "—"}</td>
                  <td className="p-3">{c.customerId || "—"}</td>
                  <td className="p-3">{c.email || "—"}</td>
                  <td className="p-3">{formatDate(c.createdAt)}</td>
                  <td className="p-3">
                    {c.customerId ? pointsMap[c.customerId] ?? "—" : "—"}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setView(c)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* View/Edit Customer Modal */}
      {view && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-customer-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setView(null)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="view-customer-title"
                  className="text-xl font-bold tracking-tight"
                >
                  Edit Customer
                </h3>
                <p className="text-sm text-foreground/70">
                  Update customer details and credentials.
                </p>
              </div>
              <button
                onClick={() => setView(null)}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Separator />
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!view) return;
                setSavingView(true);
                try {
                  const form = new FormData(e.currentTarget as HTMLFormElement);
                  const updates: any = {
                    name: String(form.get("name") || view.name || ""),
                    email: String(form.get("email") || view.email || ""),
                    username: String(
                      form.get("username") || view.username || ""
                    ),
                    phone: String(form.get("phone") || view.phone || ""),
                    age: form.get("age")
                      ? Number(form.get("age"))
                      : view.age ?? null,
                    nid: String(form.get("nid") || "") || null,
                    address: String(form.get("address") || "") || null,
                    district: String(form.get("district") || "") || null,
                    bank: String(form.get("bank") || "") || null,
                    referrerId: String(
                      form.get("referrerId") || view.referrerId || ""
                    ),
                    status: String(
                      form.get("status") || view.status || "Active"
                    ),
                    statusReason:
                      String(form.get("statusReason") || "") || null,
                  };
                  const pwd = String(form.get("password") || "").trim();
                  if (pwd) updates.password = pwd;

                  // UI-only: ignore file upload

                  // Require reason if status is Blocked/Frozen
                  const st = String(updates.status || "Active");
                  const rs = String(updates.statusReason || "").trim();
                  if ((st === "Blocked" || st === "Frozen") && !rs) {
                    toast({
                      title:
                        "Reason is required when blocking or freezing a customer.",
                      variant: "destructive",
                    });
                    setSavingView(false);
                    return;
                  }

                  // Persist updates to Firestore and update local state
                  await setDoc(
                    doc(collection(db, "Customers"), view.id),
                    {
                      ...updates,
                      ReferrerID: updates.referrerId,
                      updatedAt: Date.now(),
                    },
                    { merge: true }
                  );
                  setCustomers((prev) =>
                    prev.map((c) =>
                      c.id === view.id ? { ...c, ...updates } : c
                    )
                  );
                  setView((v) => (v ? { ...v, ...updates } : v));
                  toast({ title: "Customer updated", variant: "success" });
                } catch (err: any) {
                  toast({
                    title: err?.message || "Failed to update customer",
                    variant: "destructive",
                  });
                } finally {
                  setSavingView(false);
                }
              }}
              className="p-4 md:p-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <input
                    id="customerId"
                    name="customerId"
                    value={view.customerId ?? ""}
                    readOnly
                    disabled
                    className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="referrerId">Referrer ID (who referred)</Label>
                  <input
                    id="referrerId"
                    name="referrerId"
                    defaultValue={view.referrerId ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    name="name"
                    defaultValue={view.name ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={view.email ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Mobile</Label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={view.phone ?? ""}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <input
                    id="username"
                    name="username"
                    defaultValue={view.username ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={18}
                    max={100}
                    defaultValue={view.age ?? undefined}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="password">
                    Password (leave blank to keep unchanged)
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="password"
                      name="password"
                      type={showViewPassword ? "text" : "password"}
                      defaultValue={view.password ?? ""}
                      placeholder="New password"
                      className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowViewPassword((v) => !v)}
                    >
                      {showViewPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number</Label>
                  <input
                    id="nid"
                    name="nid"
                    defaultValue={view.nid ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input
                    id="address"
                    name="address"
                    defaultValue={view.address ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    name="district"
                    defaultValue={view.district ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={view.status ?? "Active"}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option>Active</option>
                    <option>Blocked</option>
                    <option>Frozen</option>
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="statusReason">
                    Reason (for Block/Frozen)
                  </Label>
                  <textarea
                    id="statusReason"
                    name="statusReason"
                    rows={2}
                    defaultValue={view.statusReason ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea
                    id="bank"
                    name="bank"
                    rows={3}
                    defaultValue={view.bank ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Upload NID (optional)</Label>
                  <input
                    id="nidPhoto"
                    name="nidPhoto"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  {view.nidPhotoUrl && (
                    <a
                      href={view.nidPhotoUrl}
                      target="_blank"
                      className="text-xs underline text-foreground/70"
                    >
                      View current
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setView(null)}
                >
                  Close
                </Button>
                <Button type="submit" disabled={savingView}>
                  {savingView ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-customer-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="add-customer-title"
                  className="text-xl font-bold tracking-tight"
                >
                  Add Customer
                </h3>
                <p className="text-sm text-foreground/70">
                  Provide customer details to create a new account.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Separator />
            <form onSubmit={onSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Full name"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="referrerId">Referrer ID</Label>
                  <input
                    id="referrerId"
                    name="referrerId"
                    required
                    placeholder="Referrer ID"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age (optional)</Label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={18}
                    max={100}
                    placeholder="e.g. 28"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number (optional)</Label>
                  <input
                    id="nid"
                    name="nid"
                    placeholder="National ID number"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input
                    id="address"
                    name="address"
                    required
                    placeholder="Street, area"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    name="district"
                    required
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="" disabled>
                      Select district
                    </option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details (optional)</Label>
                  <textarea
                    id="bank"
                    name="bank"
                    rows={3}
                    placeholder="Account name, number, bank, branch"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5 md:col-span-1">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Temporary password"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
