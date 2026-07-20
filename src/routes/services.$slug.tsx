import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getServiceBySlug } from "@/lib/services.functions";
import { canonicalUrl } from "@/lib/site";
import { ArrowLeft, ThermometerSnowflake } from "lucide-react";

const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async () => {
      const service = await getServiceBySlug({ data: { slug } });
      if (!service) throw notFound();
      return service;
    },
  });

export const Route = createFileRoute("/services/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(serviceQuery(params.slug)),
  head: ({ loaderData }) => {
    const service = loaderData;
    if (!service) return { meta: [{ title: "Service not found" }] };
    const title = service.meta_title?.trim() || `${service.title} | IQRAR Chiller Van Transport`;
    const description = service.meta_description?.trim() || service.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl(`/services/${service.slug}`) },
      ],
      links: [{ rel: "canonical", href: canonicalUrl(`/services/${service.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            url: `https://iqrarchillervanrental.ae/services/${service.slug}`,
            ...(service.image_url ? { image: service.image_url } : {}),
            provider: {
              "@type": "LocalBusiness",
              name: "IQRAR Chiller Van Transport",
              telephone: "+971505986571",
              areaServed: [
                "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
                "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
              ],
            },
            areaServed: {
              "@type": "Country",
              name: "United Arab Emirates",
            },
          }),
        },
      ],
    };
  },
  component: ServiceDetail,
  errorComponent: ({ error }) => <div className="container-page py-16 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-navy">Service not found</h1>
      <Link to="/services" className="mt-4 inline-block text-primary hover:underline">← Back to services</Link>
    </div>
  ),
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(slug));

  return (
    <article className="pb-20">
      <section className="bg-gradient-to-b from-accent/60 to-transparent">
        <div className="container-page pt-8 pb-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to services
          </Link>
        </div>

        <header className="container-page pb-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest shadow-sm">
              <ThermometerSnowflake className="h-3 w-3" /> Cold-chain service
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight leading-tight">
              {service.h1_override?.trim() || service.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>
        </header>
      </section>

      {service.image_url && (
        <div className="container-page -mt-4">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={service.image_url}
              alt={service.image_alt || service.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        </div>
      )}

      <div className="container-page">
        {service.content_html && (
          <div
            className="
              mt-12 max-w-3xl mx-auto
              text-[17px] leading-8 text-foreground/90
              [&_h2]:font-display [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:first:mt-0 [&_h2]:leading-snug
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3
              [&_h4]:font-semibold [&_h4]:text-navy [&_h4]:mt-6 [&_h4]:mb-2
              [&_p]:mb-5 [&_p]:text-foreground/85
              [&_p:empty]:hidden
              [&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/40 [&_a]:hover:decoration-primary
              [&_strong]:text-navy [&_strong]:font-semibold
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:leading-7
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6
              [&_img]:rounded-2xl [&_img]:shadow-card [&_img]:my-8 [&_img]:w-full [&_img]:h-auto
              [&_hr]:my-10 [&_hr]:border-border
            "
            dangerouslySetInnerHTML={{ __html: service.content_html }}
          />
        )}

        <div className="max-w-3xl mx-auto mt-16 rounded-3xl border border-border bg-card p-8 sm:p-10 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">
            Need {service.title.toLowerCase()}?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get an instant quote — 24/7 dispatch across all seven emirates.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-white px-8 py-3.5 text-sm font-semibold shadow-elegant hover-lift"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
