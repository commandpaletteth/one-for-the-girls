import type { Metadata } from "next";
import { Download, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { sampleRows } from "@/lib/admin-samples";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { btnGhost } from "@/lib/admin-ui";
import { deleteSubscriber } from "../actions";

export const metadata: Metadata = { title: "Mailing Club" };

type Sub = { id: string; email: string; source: string; created_at: string };

export default async function SubscribersPage() {
  const session = await requireAdmin();
  let subs: Sub[];
  if (session.preview) subs = sampleRows("subscribers") as unknown as Sub[];
  else {
    const { data, error } = await session.supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    subs = data as Sub[];
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Mailing Club</h1>
          <p className="mt-2 text-muted">
            {subs.length} {subs.length === 1 ? "person has" : "people have"} signed up on the website. Download the list to
            import it into your email tool.
          </p>
        </div>
        {/* A file download, not a page: a plain link is right here. */}
        <a href="/admin/subscribers/export" download className={btnGhost}>
          <Download size={16} /> Download CSV
        </a>
      </div>
      {subs.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted">No sign-ups yet.</p>
      ) : (
        <ul className="divide-y divide-border/50 overflow-hidden rounded-3xl border border-border/50 bg-white">
          {subs.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <span className="min-w-0 truncate">{s.email}</span>
              <span className="flex items-center gap-3 text-xs text-muted">
                {new Date(s.created_at).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "Asia/Bangkok" })}
                <ConfirmButton action={deleteSubscriber.bind(null, s.id)} disabled={session.preview} confirmText="Remove">
                  <Trash2 size={14} />
                </ConfirmButton>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
