import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, Snowflake } from "lucide-react";
import { SITE, NAV_LINKS, CITIES } from "@/lib/site";
import logoAsset from "@/assets/iqrar-logo.png.asset.json";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-navy text-ice">
      <div className="container-page py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 max-w-md">
          <div className="flex items-center gap-3 mb-5">
            <img src={logoAsset.url} alt="" width={48} height={48} className="h-12 w-12 rounded-full bg-white/95 p-1" />
            <div>
              <div className="font-display font-bold text-lg">IQRAR</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ice/60">Chiller Van Transport</div>
            </div>
          </div>
          <p className="text-ice/70 text-sm leading-relaxed">
            Premium refrigerated van and chiller truck transport across the UAE.
            Temperature-controlled cold-chain logistics for food, pharmaceuticals,
            seafood, flowers and specialty cargo — with full traceability.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-2 text-xs font-medium">
            <Snowflake className="h-4 w-4" aria-hidden /> {SITE.tagline}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ice mb-4">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-ice/70 hover:text-secondary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ice mb-4">Emirates We Serve</h3>
          <ul className="space-y-2.5 text-sm">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/locations/$city"
                  params={{ city: c.slug }}
                  className="text-ice/70 hover:text-secondary transition-colors"
                >
                  Chiller Van in {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <a href={SITE.phoneHref} className="flex items-center gap-2 text-ice/80 hover:text-secondary">
            <Phone className="h-4 w-4 text-secondary" /> {SITE.phone}
          </a>
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ice/80 hover:text-secondary">
            <MessageCircle className="h-4 w-4 text-secondary" /> WhatsApp
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-ice/80 hover:text-secondary break-all">
            <Mail className="h-4 w-4 text-secondary shrink-0" /> {SITE.email}
          </a>
          <div className="flex items-center gap-2 text-ice/80">
            <MapPin className="h-4 w-4 text-secondary" /> {SITE.address}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ice/60">
          <p>© {year} {SITE.name} LLC. All rights reserved.</p>
          <p>{SITE.hours}</p>
        </div>
      </div>
    </footer>
  );
}
