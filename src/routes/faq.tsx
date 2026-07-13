import { createFileRoute } from "@tanstack/react-router";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Chiller Van Rental UAE | IQRAR Chiller Van Transport" },
      { name: "description", content: "Frequently asked questions about IQRAR's refrigerated van and chiller truck transport across the UAE — temperature ranges, coverage, dispatch, compliance and quotes." },
      { property: "og:title", content: "FAQ — IQRAR Chiller Van Transport UAE" },
      { property: "og:description", content: "Answers about our refrigerated transport across the UAE." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
          FAQ
        </div>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-navy tracking-tight">
          Questions, answered.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you might want to know about our refrigerated transport across the UAE.
        </p>
      </div>

      <div className="mt-10 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        {FAQS.map((f) => (
          <details key={f.q} className="group p-6">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-semibold text-navy list-none">
              {f.q}
              <span className="h-8 w-8 shrink-0 rounded-full bg-accent text-primary flex items-center justify-center transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
