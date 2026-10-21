import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock, MapPin, Phone, ShieldCheck, type LucideIcon } from "lucide-react";
import { BRAND } from "@/lib/page-brand";
import { settingsQuery, getSetting } from "@/lib/settings.query";
import { listServicesPublic } from "@/lib/services.functions";
import { DesignedContent, QuoteSidebar } from "@/components/DesignedContent";
import { WaGlyph as WhatsAppIcon } from "@/components/WaGlyph";

/**
 * Shared designed layout for service and industry detail pages.
 * Everything shown here comes from the admin panel: title, short description,
 * photo, and the rich-text content (rendered as cards/steps/FAQ by DesignedContent).
 */
export function DetailLayout({
  backTo,
  backLabel,
  badgeIcon: BadgeIcon,
  badge,
  title,
  description,
  imageUrl,
  imageAlt,
  contentHtml,
  quoteTitle,
  currentPath,
}: {
  backTo: "/services" | "/industries";
  backLabel: string;
  badgeIcon: LucideIcon;
  badge: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  contentHtml?: string | null;
  quoteTitle: string;
  currentPath: string;
}) {
  const { data: settings = {} } = useQuery(settingsQuery());
  const { data: services = [] } = useQuery({ queryKey: ["services", "list"], queryFn: () => listServicesPublic() });
  const phone = getSetting(settings, "site_phone", BRAND.phone);
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const whatsapp = getSetting(settings, "site_whatsapp", BRAND.whatsapp).replace(/[^\d]/g, "");
  const whatsappHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(BRAND.whatsappText)}`;

  const links = services
    .filter((s) => s.slug)
    .map((s) => ({ href: `/services/${s.slug}`, label: s.title.replace(/ in Dubai and Across the UAE$/i, ""), active: `/services/${s.slug}` === currentPath }));

  return (
    <article className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} aria-hidden />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="container-page relative grid gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-16">
          <div>
            <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white ring-1 ring-white/15">
              <BadgeIcon className="h-3.5 w-3.5 text-secondary" /> {badge}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">{title}</h1>
            {description && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{description}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold shadow-elegant hover-lift">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3.5 text-sm font-semibold ring-1 ring-white/25 hover:bg-white/20">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
              <a href={phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-navy hover:bg-accent">
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-xs sm:text-sm">
              {[
                Clock,
                MapPin,
                ShieldCheck,
              ].map((icon, i) => ({ icon, label: BRAND.highlights[i] }))
              .map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4 shrink-0 text-secondary" /> {label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/40 to-transparent blur-xl" aria-hidden />
            <img
              src={imageUrl || BRAND.fallbackImage}
              alt={imageAlt || title}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* Content + sidebar */}
      <div className="container-page mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <DesignedContent html={contentHtml} pageTitle={title} />
        <QuoteSidebar
          phone={phone}
          whatsappHref={whatsappHref}
          title={quoteTitle}
          links={links}
          linksTitle="Our services"
        />
      </div>

      {/* Bottom CTA */}
      <div className="container-page mt-16">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-elegant sm:p-12">
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{quoteTitle}</h2>
              <p className="mt-2 text-white/85">{BRAND.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary hover:bg-accent">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={phoneHref} className="inline-flex items-center gap-2 rounded-full bg-navy/40 px-6 py-3.5 text-sm font-semibold ring-1 ring-white/30 hover:bg-navy/60">
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
