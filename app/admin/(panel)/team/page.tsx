import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { card } from "@/lib/admin-ui";
import TeamRow, { type Member } from "./TeamRow";
import AddAdminForm from "./AddAdminForm";

export const metadata: Metadata = { title: "Team" };

const when = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }) : "Never";

export default async function TeamPage() {
  const session = await requireAdmin();
  let members: Member[] = [];
  let problem = "";

  if (session.preview) {
    members = [
      { id: "me", email: "preview@localhost", name: "You (preview)", lastSignIn: when(new Date().toISOString()), isMe: true },
      { id: "sample", email: "jessica@example.com", name: "Sample: Jessica", lastSignIn: "Never", isMe: false },
    ];
  } else if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    problem = "Add SUPABASE_SERVICE_ROLE_KEY to the environment variables to manage the team here.";
  } else {
    const { data, error } = await createServiceSupabase().auth.admin.listUsers({ perPage: 200 });
    if (error) problem = "Could not load the team.";
    else
      members = data.users
        .map((u) => ({
          id: u.id,
          email: u.email ?? "",
          name: (u.user_metadata?.name as string) ?? "",
          lastSignIn: when(u.last_sign_in_at),
          isMe: u.id === session.user.id,
        }))
        .sort((a, b) => Number(b.isMe) - Number(a.isMe) || a.email.localeCompare(b.email));
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Team</h1>
        <p className="mt-2 text-muted">
          Everyone here can log in to this admin and change everything, including the team. Only add people you trust.
        </p>
      </div>
      {problem ? (
        <p className="rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">{problem}</p>
      ) : (
        <ul className="divide-y divide-border/50 overflow-hidden rounded-3xl border border-border/50 bg-white">
          {members.map((m) => (
            <TeamRow key={m.id} m={m} preview={session.preview} onlyOne={members.length <= 1} />
          ))}
        </ul>
      )}
      <section className={card}>
        <h2 className="mb-5 font-serif text-2xl">Add an admin</h2>
        <AddAdminForm preview={session.preview} />
      </section>
    </div>
  );
}
