import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-primary", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-12", center && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{title}</h2>
      {intro && <p className="mt-4 font-light leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

/** Top of every inner page (leaves room for the fixed navbar). */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="px-4 pb-12 pt-36 md:pb-16 md:pt-44">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-6xl">{title}</h1>
        {intro && <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-muted">{intro}</p>}
      </div>
    </section>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-6xl px-5 md:px-6", className)}>{children}</div>;
}
