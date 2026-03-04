"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref as storageRef } from "firebase/storage";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  createdAt?: any;
};

export default function ObserverApplicationViewPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<ObserverDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToastShim();

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      const snap = await getDoc(
        doc(collection(db, "ElectionObserverForm"), id)
      );
      if (!mounted) return;
      if (!snap.exists()) {
        toast({ title: "Not found" });
        router.push("/admin/observer-applications");
        return;
      }
      setData({ id: snap.id, ...(snap.data() as any) });
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!data) return;
    if (!confirm("Delete this application?")) return;
    try {
      await deleteDoc(doc(collection(db, "ElectionObserverForm"), data.id));
      const urls = [
        data.files?.photoURL,
        data.files?.certURL,
        data.files?.nidURL,
        data.files?.sigURL,
      ].filter(Boolean) as string[];
      await Promise.all(
        urls.map(async (u) => {
          try {
            const r = storageRef(getStorage(), u);
            await deleteObject(r).catch(() => {});
          } catch {}
        })
      );
      toast({ title: "Deleted" });
      router.push("/admin/observer-applications");
    } catch (e: any) {
      toast({ title: e?.message || "Delete failed" });
    }
  }

  if (loading)
    return <div className="p-6 text-sm text-foreground/70">Loading...</div>;
  if (!id)
    return (
      <div className="p-6 text-sm text-foreground/70">Invalid request</div>
    );
  if (!data)
    return <div className="p-6 text-sm text-foreground/70">Not found</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Application Detail
          </h1>
          <p className="text-sm text-foreground/70">
            View all submitted data and files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/observer-applications" className="underline">
            Back to list
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4">
          <h2 className="text-base font-semibold">Applicant</h2>
        </div>
        <Separator />
        <div className="p-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs text-foreground/60">Name</div>
            <div className="font-medium">{data.name}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/60">Mobile</div>
            <div className="font-medium">{data.mobile}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/60">NID Number</div>
            <div className="font-medium">{data.nidNumber}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/60">Address</div>
            <div className="font-medium">{data.address}</div>
          </div>
          {data.dob && (
            <div>
              <div className="text-xs text-foreground/60">Date of Birth</div>
              <div className="font-medium">{data.dob}</div>
            </div>
          )}
          {data.education && (
            <div>
              <div className="text-xs text-foreground/60">Education</div>
              <div className="font-medium">{data.education}</div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4">
          <h2 className="text-base font-semibold">References</h2>
        </div>
        <Separator />
        <div className="p-4">
          {(data.ref1Text || data.ref1) && (
            <div>
              <div className="font-semibold mb-2">Reference</div>
              {data.ref1Text ? (
                <div className="text-sm whitespace-pre-line">
                  {data.ref1Text}
                </div>
              ) : (
                data.ref1 && (
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span className="text-foreground/60">Name:</span>{" "}
                      {data.ref1.name}
                    </div>
                    <div>
                      <span className="text-foreground/60">Mobile:</span>{" "}
                      {data.ref1.mobile}
                    </div>
                    <div>
                      <span className="text-foreground/60">NID:</span>{" "}
                      {data.ref1.nid}
                    </div>
                    <div>
                      <span className="text-foreground/60">Address:</span>{" "}
                      {data.ref1.address}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4">
          <h2 className="text-base font-semibold">Files</h2>
        </div>
        <Separator />
        <div className="p-4 grid gap-6 sm:grid-cols-2">
          {data.files?.photoURL && (
            <div>
              <div className="mb-2 text-sm text-foreground/70">Photo</div>
              <a href={data.files.photoURL} target="_blank" className="block">
                <img
                  src={data.files.photoURL}
                  alt="Photo"
                  className="max-h-64 rounded-lg object-contain border border-black/10 dark:border-white/10"
                />
              </a>
            </div>
          )}
          {data.files?.sigURL && (
            <div>
              <div className="mb-2 text-sm text-foreground/70">Signature</div>
              <a href={data.files.sigURL} target="_blank" className="block">
                <img
                  src={data.files.sigURL}
                  alt="Signature"
                  className="max-h-64 rounded-lg object-contain border border-black/10 dark:border-white/10"
                />
              </a>
            </div>
          )}
          {data.files?.nidURL && (
            <div>
              <div className="mb-2 text-sm text-foreground/70">
                NID / Document
              </div>
              <a href={data.files.nidURL} target="_blank" className="underline">
                Open file
              </a>
            </div>
          )}
          {data.files?.certURL && (
            <div>
              <div className="mb-2 text-sm text-foreground/70">Certificate</div>
              <a
                href={data.files.certURL}
                target="_blank"
                className="underline"
              >
                Open file
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
