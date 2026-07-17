import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/blog.functions";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Snowflake } from "lucide-react";


const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async () => {
      const post = await getPublishedPostBySlug({ data: { slug } });
      if (!post) throw notFound();
      return post;
    },
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ loaderData }) => {
    const post = loaderData;
    if (!post) return { meta: [{ title: "Post not found" }] };
    const title = post.meta_title || `${post.title} | IQRAR`;
    const description = post.meta_description || post.excerpt || "";
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${post.slug}` },
    ];
    if (post.cover_image_url) {
      meta.push(
        { property: "og:image", content: post.cover_image_url },
        { name: "twitter:image", content: post.cover_image_url },
      );
    }
    return { meta, links: [{ rel: "canonical", href: `/blog/${post.slug}` }] };
  },
  component: BlogPost,
  errorComponent: ({ error }) => <div className="container-page py-16 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-navy">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
    </div>
  ),
});

const relatedQuery = () =>
  queryOptions({ queryKey: ["blog", "list"], queryFn: () => listPublishedPosts() });

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const { data: allPosts = [] } = useQuery(relatedQuery());
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="pb-20">
      <section className="bg-gradient-to-b from-accent/60 to-transparent">
        <div className="container-page pt-8 pb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </div>

        <header className="container-page pb-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest shadow-sm">
              <Snowflake className="h-3 w-3" /> Cold-chain insights
            </div>
            {post.published_at && (
              <time className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {format(new Date(post.published_at), "PPP")}
              </time>
            )}
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </header>
      </section>

      {post.cover_image_url && (
        <div className="container-page -mt-4">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        </div>
      )}

      <div className="container-page">
        <div
          className="
            mt-12 max-w-3xl mx-auto
            text-[17px] leading-8 text-foreground/90
            [&>*]:max-w-full
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
            [&_table]:w-full [&_table]:my-6 [&_table]:text-sm
            [&_th]:text-left [&_th]:font-semibold [&_th]:text-navy [&_th]:border-b [&_th]:border-border [&_th]:p-2
            [&_td]:border-b [&_td]:border-border [&_td]:p-2
          "
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        <div className="max-w-3xl mx-auto mt-16 rounded-3xl border border-border bg-card p-8 sm:p-10 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold text-navy">Need refrigerated transport in the UAE?</h2>
          <p className="mt-2 text-muted-foreground">
            Get an instant chiller van or freezer truck quote — 24/7 dispatch across all seven emirates.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-white px-8 py-3.5 text-sm font-semibold shadow-elegant hover-lift"
          >
            Get a Quote
          </Link>
        </div>

        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">More cold-chain insights</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover-lift flex flex-col"
                >
                  {p.cover_image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] gradient-brand" />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-base font-semibold text-navy group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
