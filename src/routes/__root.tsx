import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { InteractiveLayer } from "../components/site/InteractiveLayer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-cyan-400">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mt-2 text-sm text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root Route Error:", error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070d1e] px-4 text-white">
      <div className="max-w-md text-center bg-[#0b132b] p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {error?.message || "An unexpected error occurred. Please try refreshing."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[#27e2c4] px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-[#1fd6b9]"
          >
            Refresh Page
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-[#131f37] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arshio — One Dedicated Studio for All Your Tech & Marketing Needs" },
      { name: "description", content: "Transforming ideas into high-performing web platforms, intuitive user interfaces, and scalable marketing funnels. Fast sprints, senior execution, guaranteed momentum." },
      { name: "keywords", content: "digital agency, custom software development, ERP development, UI/UX design, web app development, mobile app development, motion graphics, video editing, branding agency, Arshio" },
      { name: "author", content: "Arshio Digital Agency" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Arshio Digital Agency" },
      { property: "og:title", content: "Arshio — One Dedicated Studio for All Your Tech & Marketing Needs" },
      { property: "og:description", content: "Transforming ideas into high-performing web platforms, intuitive user interfaces, and scalable marketing funnels. Fast sprints, senior execution, guaranteed momentum." },
      { property: "og:url", content: "https://arshio.vercel.app/" },
      { property: "og:image", content: "https://arshio.vercel.app/og-image.png?v=3" },
      { property: "og:image:secure_url", content: "https://arshio.vercel.app/og-image.png?v=3" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Arshio — One Dedicated Studio for All Your Tech & Marketing Needs" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@arshioagency" },
      { name: "twitter:creator", content: "@arshioagency" },
      { name: "twitter:title", content: "Arshio — One Dedicated Studio for All Your Tech & Marketing Needs" },
      { name: "twitter:description", content: "Transforming ideas into high-performing web platforms, intuitive user interfaces, and scalable marketing funnels. Fast sprints, senior execution, guaranteed momentum." },
      { name: "twitter:image", content: "https://arshio.vercel.app/og-image.png?v=3" },
      { name: "twitter:image:alt", content: "Arshio — One Dedicated Studio for All Your Tech & Marketing Needs" },
      { name: "theme-color", content: "#050A18" },
    ],
    links: [
      { rel: "canonical", href: "https://arshio.vercel.app/" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=3" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=3" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png?v=3" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=3" },
      { rel: "shortcut icon", href: "/favicon.ico?v=3" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

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

  return (
    <QueryClientProvider client={queryClient}>
      <InteractiveLayer />
      <Outlet />
    </QueryClientProvider>
  );
}
