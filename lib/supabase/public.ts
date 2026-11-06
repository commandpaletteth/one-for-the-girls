import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous client for the public site. No cookies, so pages stay static.
 * RLS only lets it read published rows.
 */
export function createPublicSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
