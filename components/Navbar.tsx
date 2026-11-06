"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Instagram, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/content";

type Props = {
  siteName: string;
  items: NavItem[];
  cta: { label: string; href: string };
  labels: { open: string; close: string };
};

export default function Navbar({ siteName, items, cta, labels }: Props) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Desktop: always visible. Mobile: hide when scrolling down past 150px.
    if (window.innerWidth >= 1024) {
      setHidden(false);
    } else if (latest > previous && latest > 150) {
      setHidden(true);
      setOpen(false);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300", scrolled ? "py-2" : "py-5")}
      >
        <div
          className={cn(
            "flex w-[95%] max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 lg:px-7",
            scrolled || open ? "border border-primary/10 bg-white/90 shadow-lg backdrop-blur-md" : "border border-transparent",
          )}
        >
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80">
            {siteName}
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-muted lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("group relative transition-colors hover:text-primary", isActive(item.href) && "text-primary")}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full",
                    isActive(item.href) ? "w-full" : "w-0",
                  )}
                />
              </Link>
            ))}
          </div>

          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-md lg:flex"
          >
            <Instagram size={16} />
            {cta.label}
          </a>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? labels.close : labels.open}
            aria-expanded={open}
            className="p-1 text-foreground lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col items-center gap-6 overflow-y-auto bg-background px-6 pb-10 pt-28 lg:hidden"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "font-serif text-2xl transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:bg-primary-dark"
            >
              <Instagram size={20} />
              {cta.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
