import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "../globals.css";

// Separate root layout: the admin has no public navbar/footer and is never indexed.
export const metadata: Metadata = {
  title: { default: "Admin | One For The Girls", template: "%s | OFTG Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
