import { Link } from "@tanstack/react-router";
import type { listLocationsPublic } from "@/lib/locations.functions";

/**
 * Stylised interactive map of the UAE.
 * Not geographically exact — a corporate schematic where each pin links to
 * a city landing page.
 */
export function UAEMap({
  cities,
}: {
  cities: Awaited<ReturnType<typeof listLocationsPublic>>;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-accent to-white shadow-card">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-auto"
        role="img"
        aria-label="Map of the United Arab Emirates showing service coverage"
      >
        <defs>
          <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EAF8FF" />
            <stop offset="100%" stopColor="#D8ECFB" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BDE3F8" />
            <stop offset="100%" stopColor="#9CCDEF" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#waterGrad)" opacity="0.35" />
        {/* Stylised UAE landmass silhouette */}
        <path
          d="M110,320 Q140,250 210,235 Q260,225 305,240 Q350,200 420,180 Q510,155 590,140 Q650,132 710,160 Q745,180 740,220 Q735,260 700,285 Q660,310 620,315 Q560,325 500,340 Q430,360 360,380 Q290,395 230,395 Q160,395 130,370 Q100,350 110,320 Z"
          fill="url(#landGrad)"
          stroke="#0057D9"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        {cities.map((c) => {
          const cx = (c.map_x / 100) * 800;
          const cy = (c.map_y / 100) * 500;
          return (
            <g key={c.slug}>
              <circle cx={cx} cy={cy} r="22" fill="#0057D9" opacity="0.15">
                <animate attributeName="r" values="18;30;18" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="9" fill="#0057D9" stroke="#fff" strokeWidth="3" />
            </g>
          );
        })}
      </svg>

      {/* City hotspots overlaid using absolute % positioning */}
      <div className="absolute inset-0">
        {cities.map((c) => (
          <Link
            key={c.slug}
            to="/locations/$city"
            params={{ city: c.slug }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.map_x}%`, top: `${c.map_y}%` }}
            aria-label={`View chiller van service in ${c.name}`}
          >
            <span className="block h-6 w-6 rounded-full" aria-hidden />
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy text-white text-[11px] font-semibold px-3 py-1.5 shadow-elegant opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none">
              {c.name} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
