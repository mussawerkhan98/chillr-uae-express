import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getIndustryBySlug } from "@/lib/industries.functions";
import { canonicalUrl } from "@/lib/site";
import { ArrowLeft, Building2 } from "lucide-react";

const industryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["industry", slug],
    queryFn: async () => {
      const industry = await getIndustryBySlug({ data: { slug } });
      if (!industry) throw notFound();
      return industry;
    },
  });

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(industryQuery(params.slug)),
  head: ({ loaderData }) => {
    const industry = loaderData;
    if (!industry) return { meta: [{ title: "Industry not found" }] };
    const title = `${industry.name} | IQRAR Chiller Van Transport`;
    const description = industry.description || `Cold-chain transport for ${industry.name} across the UAE.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl(`/industries/${industry.slug}`) },
      ],
      links: [{ rel: "canonical", href: canonicalUrl(`/industries/${industry.slug}`) }],
    };
  },
  component: IndustryDetail,
  errorComponent: ({ error }) => <div className="container-page py-16 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-navy">Industry not found</h1>
      <Link to="/industries" className="mt-4 inline-block text-primary hover:underline">← Back to industries</Link>
    </div>
  ),
});

function IndustryDetail() {
  const { slug } = Route.useParams();
  const { data: industry } = useSuspenseQuery(industryQuery(slug));

  return (
    <article className="pb-20">
      <section className="bg-gradient-to-b from-accent/60 to-transparent">
        <div className="container-page pt-8 pb-4">
          <Link
            to="/industries"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to industries
          </Link>
        </div>

        <header className="container-page pb-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest shadow-sm">
              <Building2 className="h-3 w-3" /> Industry we serve
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight leading-tight">
              {industry.name}
            </h1>
            {industry.description && (
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {industry.description}
              </p>
            )}
          </div>
        </header>
      </section>

      {industry.image_url && (
        <div className="container-page -mt-4">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={industry.image_url}
              alt={industry.image_alt || industry.name}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        </div>
      )}

      <div className="container-page">
        {industry.content_html && (
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
            dangerouslySetInnerHTML={{ __html: industry.content_html }}
          />
        )}

        <div className="max-w-3xl mx-auto mt-16 rounded-3xl border border-border bg-card p-8 sm:p-10 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">
            Cold-chain transport for {industry.name.toLowerCase()}
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
