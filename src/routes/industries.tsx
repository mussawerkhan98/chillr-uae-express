import { createFileRoute, Link } from "@tanstack/react-router";
import { INDUSTRIES } from "@/lib/site";
import { Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve | Chiller Van Transport UAE — IQRAR" },
      { name: "description", content: "IQRAR serves restaurants, hotels, hospitals, supermarkets, catering, food manufacturing, floral, ice-cream and pharmaceutical clients across the UAE." },
      { property: "og:title", content: "Industries — IQRAR Chiller Van Transport" },
      { property: "og:description", content: "Cold-chain logistics tailored to UAE hospitality, healthcare, retail and manufacturing." },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  return (
    <>
      <section className="container-page pt-16 pb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            Industries
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight">
            Trusted across the industries the UAE runs on.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Cold-chain expectations vary. So do our routes, vehicles and handling
            protocols — matched to your industry from day one.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-6 shadow-card hover-lift flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="font-display text-lg font-semibold text-navy">{i}</span>
              </div>
              <Link to="/contact" aria-label={`Get a quote for ${i}`} className="text-primary opacity-60 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
