import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedPostBySlug } from "@/lib/blog.functions";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

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

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));

  return (
    <article className="container-page py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <header className="max-w-3xl mx-auto text-center">
        {post.published_at && (
          <time className="text-xs uppercase tracking-widest text-primary font-semibold">
            {format(new Date(post.published_at), "PPP")}
          </time>
        )}
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-navy tracking-tight">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
      </header>

      {post.cover_image_url && (
        <div className="mt-10 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-elegant">
          <img src={post.cover_image_url} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      <div
        className="mt-12 max-w-3xl mx-auto prose prose-slate prose-lg prose-headings:font-display prose-headings:text-navy prose-a:text-primary prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />
    </article>
  );
}
