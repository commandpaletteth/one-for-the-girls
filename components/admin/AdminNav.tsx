"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarHeart,
  ExternalLink,
  HelpCircle,
  Images,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  MessageSquareText,
  NotebookPen,
  Handshake,
  KeyRound,
  Quote,
  Users,
  X,
} from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";

const ICONS = {
  overview: LayoutDashboard,
  events: CalendarHeart,
  gallery: Images,
  sitePhotos: ImageIcon,
  articles: NotebookPen,
  partners: Handshake,
  testimonials: Quote,
  stats: BarChart3,
  updates: Megaphone,
  faqs: HelpCircle,
  messages: MessageSquareText,
  subscribers: Mail,
  team: Users,
} as const;

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="px-6 py-6">
        <p className="font-serif text-xl text-primary">One For The Girls</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Admin</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto px-3">
        {ADMIN_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const cls = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  cls,
                  isActive(item.href) ? "bg-primary text-white" : "text-muted hover:bg-blush hover:text-primary",
                )}
              >
                <Icon size={18} /> {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-border/50 p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-blush hover:text-primary"
        >
          <ExternalLink size={18} /> View website
        </a>
        <Link
          href="/admin/account"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-blush hover:text-primary"
        >
          <KeyRound size={18} /> Account
        </Link>
        <p className="truncate px-3 pt-2 text-xs text-muted" title={email}>
          {email}
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-blush"
          >
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-white px-4 py-3 lg:hidden">
        <p className="font-serif text-lg text-primary">OFTG Admin</p>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-1">
          <Menu size={22} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute left-60 top-5 p-1">
              <X size={20} />
            </button>
            {nav}
          </aside>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/50 bg-white lg:block">{nav}</aside>
    </>
  );
}
