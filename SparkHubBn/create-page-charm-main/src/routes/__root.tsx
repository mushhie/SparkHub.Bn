import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-semibold text-clay">404</p>
        <h2 className="mt-4 font-display text-xl text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-ink-muted">
          That spark seems to have flickered out.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay/90"
          >
            Back to SparkHub
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F7F2E8" },
      { title: "SparkHub.bn — Connect · Work · Achieve" },
      {
        name: "description",
        content:
          "SparkHub connects Bruneian talents with local businesses. Find part-time gigs, hire trusted workers and grow your reputation.",
      },
      { property: "og:title", content: "SparkHub.bn — Connect · Work · Achieve" },
      {
        property: "og:description",
        content:
          "Find part-time gigs and trusted local talent across Tech, Creative Arts and Professional services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "SparkHub.bn — Connect · Work · Achieve" },
      { name: "description", content: "LightHub connects individuals with unique skills to businesses seeking them for project-based work." },
      { property: "og:description", content: "LightHub connects individuals with unique skills to businesses seeking them for project-based work." },
      { name: "twitter:description", content: "LightHub connects individuals with unique skills to businesses seeking them for project-based work." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb032fbb-85d3-4687-914b-b8d4e8223093/id-preview-e936e376--508a3829-397e-4c60-ad95-8cb6ba6dfe75.lovable.app-1779000672287.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb032fbb-85d3-4687-914b-b8d4e8223093/id-preview-e936e376--508a3829-397e-4c60-ad95-8cb6ba6dfe75.lovable.app-1779000672287.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;600;700&family=Fraunces:opsz,wght@9..144,400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return <Outlet />;
}
