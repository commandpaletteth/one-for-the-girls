import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client: BYPASSES RLS. Server-only.
 * Use ONLY for: saving validated contact messages / sign-ups, and the keepalive cron.
 */
export function createServiceSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
