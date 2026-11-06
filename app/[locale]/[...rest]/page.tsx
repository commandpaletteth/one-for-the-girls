import { notFound } from "next/navigation";

// Any unknown URL renders app/[locale]/not-found.tsx (inside the site layout).
export default function CatchAll() {
  notFound();
}
