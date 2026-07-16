import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Truck, Snowflake, Ruler, ThermometerSnowflake, ArrowRight } from "lucide-react";
import { listFleetPublic } from "@/lib/fleet.functions";
import { siteImagesQuery, pickImage } from "@/lib/site-images.query";
import fleetImg from "@/assets/fleet-lineup.jpg";

const fleetQuery = () =>
  queryOptions({ queryKey: ["fleet", "list"], queryFn: () => listFleetPublic() });

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet | Chiller Vans, Freezer Trucks & Pickups | IQRAR UAE" },
      {
        name: "description",
        content:
          "Explore IQRAR's UAE chiller and freezer fleet — Toyota Hiace, Nissan Urvan, 1 ton pickup chillers, 3 & 5 ton chiller trucks, and deep-freeze trucks from +8°C to −25°C.",
      },
      {
        property: "og:title",
        content: "IQRAR Refrigerated Fleet — Chiller Vans, Freezer Trucks & Pickups",
      },
      {
        property: "og:description",
        content:
          "Modern refrigerated fleet across the UAE. Chiller vans, freezer trucks and pickup chillers with continuous temperature monitoring.",
      },
      { property: "og:url", content: "/fleet" },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(fleetQuery()),
      context.queryClient.ensureQueryData(siteImagesQuery()),
    ]),
  component: FleetPage,
});

function FleetPage() {
  const { data: fleet } = useSuspenseQuery(fleetQuery());
  const { data: images } = useSuspenseQuery(siteImagesQuery());
  const hero = pickImage(images, "fleet_lineup", {
    src: fleetImg,
    alt: "IQRAR refrigerated fleet lineup",
  });

  return (
    <>
      <section className="container-page pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
            Our Fleet
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight">
            Matched to your cargo. Ready around the clock.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Compact chiller vans for city routes. Freezer trucks for deep-freeze cargo. Every
            vehicle temperature-mapped and continuously monitored.
          </p>
        </div>
        <img
          src={hero.src}
          alt={hero.alt}
          width={1600}
          height={900}
          loading="lazy"
          className="mt-10 rounded-3xl shadow-elegant w-full"
        />
      </section>

      <section className="container-page py-16">
        {fleet.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground">Fleet details coming soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fleet.map((v) => (
              <article
                key={v.id}
                className="group rounded-3xl bg-card border border-border shadow-card hover-lift overflow-hidden flex flex-col"
              >
                <div className="relative p-6 bg-gradient-to-br from-accent to-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {v.category}
                    </span>
                    <Truck className="h-6 w-6 text-primary/70" />
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold text-navy">{v.name}</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Snowflake className="h-3 w-3" /> Temp
                      </dt>
                      <dd className="mt-1 font-semibold text-primary">{v.temp_range}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <ThermometerSnowflake className="h-3 w-3" /> Payload
                      </dt>
                      <dd className="mt-1 font-semibold text-navy">{v.capacity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Ruler className="h-3 w-3" /> Volume
                      </dt>
                      <dd className="mt-1 font-semibold text-navy">{v.volume}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                        Ideal for
                      </dt>
                      <dd className="mt-1 text-navy text-xs leading-snug">{v.ideal}</dd>
                    </div>
                  </dl>
                  <Link
                    to="/contact"
                    className="mt-auto inline-flex items-center justify-between rounded-xl bg-navy text-white px-4 py-3 text-sm font-semibold hover:bg-primary transition-colors"
                  >
                    Request this vehicle <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
