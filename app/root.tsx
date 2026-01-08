import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, type MetaFunction } from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap',
  },
];

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'MAM DESIGNS' },
    { tagName: 'link', rel: 'canonical', href: 'https://mamvietnam.vn/chuyen-muc/thi-cong-thuc-te/' },

    // Favicon
    {
      tagName: 'link',
      rel: 'icon',
      type: 'image/png',
      href: 'https://files-cdn.chatway.app/U2Dm64ntDJwYb41agz8eQSEnQCngGjC7DRWaasnn391FQXKB.jpg',
    },
    // Hoặc dùng .ico
    // { tagName: "link", rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

    // Apple Touch Icon (cho iOS)
    {
      tagName: 'link',
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: 'https://files-cdn.chatway.app/U2Dm64ntDJwYb41agz8eQSEnQCngGjC7DRWaasnn391FQXKB.jpg',
    },

    // Thêm các meta tags SEO khác nếu cần
    { name: 'description', content: 'Xem các dự án thi công nội thất thực tế của MAM DESIGN' },
    { property: 'og:title', content: 'MAM DESIGN - Thi công thực tế' },
    { property: 'og:description', content: 'Xem các dự án thi công nội thất thực tế của MAM DESIGN' },
    { property: 'og:url', content: 'https://mamvietnam.vn/chuyen-muc/thi-cong-thuc-te/' },
    { property: 'og:image', content: 'https://mamvietnam.vn/wp-content/uploads/2025/07/mam-logo.webp' },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <TooltipProvider>
        <Toaster />
          <Sonner />
          <Outlet />
      </TooltipProvider>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
