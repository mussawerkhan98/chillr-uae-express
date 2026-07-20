import { Link } from "@tanstack/react-router";
import type { listLocationsPublic } from "@/lib/locations.functions";

/**
 * Stylised interactive map of the UAE.
 * Not geographically exact — a corporate schematic where each pin links to
 * a city landing page. A dashed route connects the emirates in a rough
 * west-to-east coastal order, with an animated van driving along it to
 * suggest active coverage rather than a static list of dots.
 */

// Preferred visual driving order (roughly Abu Dhabi -> Dubai -> northern
// emirates -> Fujairah on the east coast). Any city not in this list (e.g.
// a location added later via admin) is simply appended at the end so the
// route never breaks.
const ROUTE_ORDER = [
  "abu-dhabi",
  "dubai",
  "sharjah",
  "ajman",
  "umm-al-quwain",
  "ras-al-khaimah",
  "fujairah",
];

type City = Awaited<ReturnType<typeof listLocationsPublic>>[number];

function orderCities(cities: City[]): City[] {
  const bySlug = new Map(cities.map((c) => [c.slug, c] as const));
  const ordered = ROUTE_ORDER.map((slug) => bySlug.get(slug)).filter(
    (c): c is City => Boolean(c),
  );
  const remaining = cities.filter((c) => !ROUTE_ORDER.includes(c.slug));
  return [...ordered, ...remaining];
}

function buildRoutePath(cities: City[]): string {
  if (cities.length < 2) return "";
  return cities
    .map((c, i) => {
      const x = (c.map_x / 100) * 800;
      const y = (c.map_y / 100) * 500;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function UAEMap({ cities }: { cities: City[] }) {
  const ordered = orderCities(cities);
  const routePath = buildRoutePath(ordered);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-accent to-white shadow-card">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-auto"
        role="img"
        aria-label="Map of the United Arab Emirates showing service coverage, with a route connecting the emirates we serve"
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

        {/* Road connecting the emirates we serve */}
        {routePath && (
          <>
            <path
              id="coverage-route"
              d={routePath}
              fill="none"
              stroke="#0B2545"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.12"
            />
            <path
              d={routePath}
              fill="none"
              stroke="#0057D9"
              strokeWidth="2.5"
              strokeDasharray="10 9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
          </>
        )}

        {ordered.map((c) => {
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

        {/* Van driving along the coverage route, looping continuously */}
        {routePath && (
          <g>
            <g transform="translate(-13,-9)">
              <rect x="0" y="0" width="26" height="16" rx="2" fill="#0B2545" opacity="0.18" transform="translate(1,3)" />
              <rect x="0" y="3" width="26" height="12" rx="3" fill="#FFFFFF" stroke="#0057D9" strokeWidth="1.5" />
              <rect x="16" y="0" width="9" height="8" rx="1.5" fill="#FFFFFF" stroke="#0057D9" strokeWidth="1.5" />
              <rect x="18.5" y="1.5" width="4.5" height="4" rx="0.5" fill="#BDE3F8" />
              <circle cx="6" cy="16" r="2.4" fill="#0B2545" />
              <circle cx="20" cy="16" r="2.4" fill="#0B2545" />
            </g>
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#coverage-route" />
            </animateMotion>
          </g>
        )}
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
