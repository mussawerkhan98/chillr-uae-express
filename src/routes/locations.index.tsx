import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { locationsQuery } from "@/lib/locations.query";
import { canonicalUrl } from "@/lib/site";
import { UAEMap } from "@/components/UAEMap";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "UAE Coverage | Chiller Van Transport in All 7 Emirates — IQRAR" },
      { name: "description", content: "IQRAR chiller van and freezer truck transport across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah and Umm Al Quwain." },
      { property: "og:title", content: "UAE Coverage — IQRAR Chiller Van Transport" },
      { property: "og:description", content: "Refrigerated transport in all seven emirates. Local response teams and same-day cross-emirate delivery." },
      { property: "og:url", content: canonicalUrl("/locations") },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/locations") }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(locationsQuery()),
  component: LocationsPage,
});

function LocationsPage() {
  const { data: CITIES } = useSuspenseQuery(locationsQuery());

  return (
    <>
      <section className="container-page pt-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            Coverage
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight">
            Chiller van transport in every emirate.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Tap any emirate below to see local coverage, response times and popular routes.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <UAEMap cities={CITIES} />
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              to="/locations/$city"
              params={{ city: c.slug }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card hover-lift flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl gradient-brand text-white flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="text-xs text-muted-foreground font-medium" dir="rtl">{c.arabic}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-navy">{c.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{c.blurb}</p>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  <Clock className="h-3.5 w-3.5" /> {c.response_time}
                </span>
                <span className="inline-flex items-center gap-1 text-navy font-semibold group-hover:gap-2 transition-all">
                  View <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
