import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingCTAs } from "@/components/FloatingCTAs";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Off the cold-chain route</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover-lift"
          >
            Go home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://iqrarchiller.ae/#business",
  name: SITE.name,
  image: "/favicon.ico",
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  areaServed: [
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
    "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00", closes: "23:59",
  },
  sameAs: [],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0057D9" },
      { title: "IQRAR Chiller Van Transport UAE | Refrigerated Truck Rental Dubai" },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.name },
      { name: "keywords", content: "chiller van Dubai, refrigerated transport UAE, freezer truck rental, cold chain logistics Dubai, chiller truck Abu Dhabi, frozen food transport" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "IQRAR Chiller Van Transport UAE | Refrigerated Truck Rental Dubai" },
      { property: "og:description", content: SITE.description },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IQRAR Chiller Van Transport UAE | Refrigerated Truck Rental Dubai" },
      { name: "twitter:description", content: SITE.description },
      { name: "description", content: "Premium refrigerated chiller van & freezer truck rental across the UAE. 24/7 temperature-controlled cold-chain logistics for food, pharma, seafood & flowers. Call +971 50 598 6571." },
      { property: "og:description", content: "Premium refrigerated chiller van & freezer truck rental across the UAE. 24/7 temperature-controlled cold-chain logistics for food, pharma, seafood & flowers. Call +971 50 598 6571." },
      { name: "twitter:description", content: "Premium refrigerated chiller van & freezer truck rental across the UAE. 24/7 temperature-controlled cold-chain logistics for food, pharma, seafood & flowers. Call +971 50 598 6571." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0a7e52ff-c10a-4465-a8c9-585d0f7681a0/id-preview-24517698--b7c60f46-e280-4f38-a2be-80685c88fce2.lovable.app-1783945935451.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0a7e52ff-c10a-4465-a8c9-585d0f7681a0/id-preview-24517698--b7c60f46-e280-4f38-a2be-80685c88fce2.lovable.app-1783945935451.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORG_JSONLD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChromeless = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      {isChromeless ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <FloatingCTAs />
        </div>
      )}
    </QueryClientProvider>
  );
}
