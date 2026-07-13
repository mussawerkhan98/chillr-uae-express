import { createFileRoute, Link } from "@tanstack/react-router";
import { ThermometerSnowflake, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Refrigerated Transport Services UAE | Food, Pharma, Seafood — IQRAR" },
      { name: "description", content: "Cold-chain transport services in the UAE: fresh food, frozen goods, seafood, meat, pharmaceuticals, chocolate, flowers, hospitality supply and airport cargo." },
      { property: "og:title", content: "Cold-Chain Transport Services — IQRAR UAE" },
      { property: "og:description", content: "Nine specialised refrigerated transport services across the UAE — from pharma to seafood, catered to your cargo profile." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="container-page pt-16 pb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            Services
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight">
            Purpose-built cold-chain services for every UAE industry.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            From pharma-grade GDP routes to floral humidity control, our fleet and
            crew are trained around your cargo — not the other way around.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.title} className="group rounded-2xl bg-card border border-border p-6 shadow-card hover-lift">
              <div className="h-12 w-12 rounded-xl gradient-brand text-white flex items-center justify-center">
                <ThermometerSnowflake className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-navy">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
