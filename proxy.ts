import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { hasSupabase, isAdminPreview } from "./lib/supabase/env";

const intl = createIntlMiddleware(routing);

// Next.js 16: "middleware" is now called "proxy".
// Public pages → next-intl. /admin → Supabase session check on the server.
export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) return adminGate(request, path);
  return intl(request);
}

async function adminGate(request: NextRequest, path: string) {
  const isLogin = path === "/admin/login";
  const toLogin = () => NextResponse.redirect(new URL("/admin/login", request.url));

  // Local preview (npm run dev, not connected): open everything, nothing can be saved.
  if (isAdminPreview()) return NextResponse.next();
  // Not connected yet (e.g. on Vercel): only the login page (which explains it) is reachable.
  if (!hasSupabase()) return isLogin ? NextResponse.next() : toLogin();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) return toLogin();
  if (user && isLogin) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}

export const config = {
  // Every page URL, except API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
