import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ChevronDown, MapPin } from "lucide-react";
import { parseContent, type ContentSection } from "@/lib/content-sections";
import { BRAND } from "@/lib/page-brand";
import { WaGlyph } from "@/components/WaGlyph";

/** Shared prose styling for free-text blocks inside the designed layout. */
export const PROSE =
  "text-[16px] leading-7 text-foreground/85 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:hidden " +
  "[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary " +
  "[&_strong]:text-navy [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 [&_h4]:font-semibold [&_h4]:text-navy [&_h4]:mt-5 [&_h4]:mb-2 " +
  "[&_img]:rounded-2xl [&_img]:my-6 [&_img]:w-full [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_table]:w-full [&_table]:my-4 [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:text-navy [&_th]:border-b [&_th]:border-border [&_th]:p-2 [&_td]:border-b [&_td]:border-border [&_td]:p-2";

function SectionTitle({ children, index }: { children: string; index: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-brand text-sm font-bold text-white shadow-elegant">
        {String(index).padStart(2, "0")}
      </span>
      <h2 className="font-display text-2xl sm:text-[28px] font-bold text-navy leading-tight">{children}</h2>
    </div>
  );
}

function Html({ html, className = "" }: { html: string; className?: string }) {
  if (!html) return null;
  return <div className={`${PROSE} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A card item: if it is just a link, render the whole card as a link with an arrow. */
function CardItem({ html }: { html: string }) {
  const onlyLink = html.trim().match(/^<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>$/i);
  if (onlyLink && onlyLink[1].startsWith("/")) {
    return (
      <a
        href={onlyLink[1]}
        className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
      >
        <span className="font-semibold text-navy group-hover:text-primary" dangerouslySetInnerHTML={{ __html: onlyLink[2] }} />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </a>
    );
  }
  // "<strong>Title</strong> text" -> title line + text below it.
  const titled = html.trim().match(/^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/i);
  if (titled && titled[2].replace(/<[^>]+>/g, "").trim()) {
    const title = titled[1].trim().replace(/:\s*$/, "");
    const text = titled[2].replace(/^[:\-–—]\s*/, "");
    return (
      <div className="flex h-full gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <div className="font-semibold leading-6 text-navy" dangerouslySetInnerHTML={{ __html: title }} />
          <div className={`${PROSE} mt-1 !text-[14.5px] !leading-6 !text-muted-foreground`} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className={`${PROSE} !text-[15px] !leading-6 text-navy/90`} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function SectionBlock({ section, index }: { section: ContentSection; index: number }) {
  switch (section.kind) {
    case "cards":
      return (
        <div>
          <SectionTitle index={index}>{section.title}</SectionTitle>
          {section.lead && <Html html={section.lead} className="mt-4" />}
          <div className={`mt-6 grid gap-4 sm:grid-cols-2 ${section.items.length > 4 ? "xl:grid-cols-3" : ""}`}>
            {section.items.map((it, i) => (
              <CardItem key={i} html={it} />
            ))}
          </div>
          {section.after && <Html html={section.after} className="mt-6" />}
        </div>
      );
    case "steps":
      return (
        <div>
          <SectionTitle index={index}>{section.title}</SectionTitle>
          {section.lead && <Html html={section.lead} className="mt-4" />}
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.items.map((it, i) => (
              <li key={i} className="relative rounded-2xl border border-border bg-card p-5 pl-16 shadow-card">
                <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className={`${PROSE} !text-[15px] !leading-6`} dangerouslySetInnerHTML={{ __html: it }} />
              </li>
            ))}
          </ol>
          {section.after && <Html html={section.after} className="mt-6" />}
        </div>
      );
    case "faq":
      return (
        <div>
          <SectionTitle index={index}>{section.title}</SectionTitle>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {section.items.map((f, i) => (
              <details key={i} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-navy hover:bg-accent/50 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <Html html={f.a} className="px-5 pb-5 !text-[15px]" />
              </details>
            ))}
          </div>
        </div>
      );
    case "areas":
      return (
        <div className="rounded-3xl bg-navy p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <MapPin className="h-5 w-5 text-secondary" />
            </span>
            <h2 className="font-display text-2xl font-bold">{section.title}</h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {section.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition-colors hover:bg-primary hover:ring-primary"
              >
                <MapPin className="h-3.5 w-3.5" /> {l.label}
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/70">{BRAND.areasNote}</p>
        </div>
      );
    default:
      return (
        <div>
          {section.title && <SectionTitle index={index}>{section.title}</SectionTitle>}
          <div className="mt-5 rounded-2xl border border-border bg-card p-6 shadow-card">
            <Html html={section.html} />
          </div>
        </div>
      );
  }
}

/** Renders admin rich-text content as designed sections (cards, steps, FAQ accordion, areas). */
export function DesignedContent({ html, pageTitle }: { html: string | null | undefined; pageTitle?: string }) {
  const { heading, tagline, intro, sections } = parseContent(html);
  const showHeading = heading && heading.toLowerCase() !== (pageTitle ?? "").trim().toLowerCase();
  let n = 0;
  return (
    <div className="space-y-14">
      {(tagline || intro || showHeading) && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white to-accent p-6 sm:p-8 shadow-card">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" aria-hidden />
          {tagline && (
            <div className="relative inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              {tagline}
            </div>
          )}
          {showHeading && (
            <h2 className="relative mt-4 font-display text-2xl sm:text-[28px] font-bold leading-tight text-navy">{heading}</h2>
          )}
          <Html html={intro} className={`relative ${tagline || showHeading ? "mt-4" : ""} !text-[17px] !leading-8`} />
        </div>
      )}
      {sections.map((s, i) => (
        <SectionBlock key={i} section={s} index={s.kind === "areas" ? 0 : ++n} />
      ))}
    </div>
  );
}

/** Sticky sidebar: quick contact + related links. */
export function QuoteSidebar({
  phone,
  whatsappHref,
  title,
  links,
  linksTitle,
}: {
  phone: string;
  whatsappHref: string;
  title: string;
  links: { href: string; label: string; active?: boolean }[];
  linksTitle: string;
}) {
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-3xl bg-navy text-white shadow-elegant">
        <div className="gradient-brand px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-widest text-white/80">Free quote</div>
          <div className="mt-1 font-display text-xl font-bold leading-snug">{title}</div>
        </div>
        <div className="space-y-3 p-6">
          <a href={phoneHref} className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-navy hover:bg-accent">
            Call {phone}
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:brightness-110"
          >
            <WaGlyph className="h-5 w-5" /> WhatsApp us
          </a>
          <Link to="/contact" className="flex items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold hover:bg-white/10">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
          <ul className="pt-2 space-y-1.5 text-xs text-white/70">
            {BRAND.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> {h}</li>
            ))}
          </ul>
        </div>
      </div>
      {links.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="px-1 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{linksTitle}</div>
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    l.active ? "bg-primary text-white" : "text-navy hover:bg-accent hover:text-primary"
                  }`}
                >
                  <span className="line-clamp-1">{l.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
