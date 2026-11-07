import { Fragment } from "react";
import { parseRichText, type Inline } from "@/lib/rich-text";

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.t === "b") return <strong key={i} className="font-semibold">{p.v}</strong>;
        if (p.t === "i") return <em key={i}>{p.v}</em>;
        if (p.t === "a") {
          const external = p.href.startsWith("http");
          return (
            <a
              key={i}
              href={p.href}
              className="text-primary underline underline-offset-2 hover:text-primary-dark"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {p.v}
            </a>
          );
        }
        return <Fragment key={i}>{p.v}</Fragment>;
      })}
    </>
  );
}

export default function RichText({ body }: { body: string }) {
  return (
    <div className="space-y-6 text-lg font-light leading-relaxed text-foreground/90">
      {parseRichText(body).map((b, i) => {
        if (b.t === "h2") return <h2 key={i} className="pt-4 font-serif text-3xl font-normal text-foreground"><Inlines parts={b.v} /></h2>;
        if (b.t === "h3") return <h3 key={i} className="pt-2 font-serif text-2xl font-normal text-foreground"><Inlines parts={b.v} /></h3>;
        if (b.t === "ul")
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-primary">
              {b.items.map((it, j) => (
                <li key={j}><Inlines parts={it} /></li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            {b.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inlines parts={l} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
