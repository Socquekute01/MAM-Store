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
  const url = 'https://mamvietnam.vn/chuyen-muc/thi-cong-thuc-te/';

  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    // SEO chính
    { title: 'Thi công nội thất thực tế | MAM Design' },
    {
      name: 'description',
      content:
        'Khám phá các dự án thi công nội thất thực tế do MAM Design thực hiện, đa dạng phong cách, thi công chuẩn kỹ thuật và thẩm mỹ.',
    },

    // Index control
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow, max-snippet:-1' },

    // Canonical
    { tagName: 'link', rel: 'canonical', href: url },

    // Open Graph
    { property: 'og:title', content: 'Thi công nội thất thực tế | MAM Design' },
    {
      property: 'og:description',
      content: 'Các công trình thi công nội thất thực tế, hình ảnh thật, chất lượng chuẩn MAM Design.',
    },
    { property: 'og:url', content: url },
    {
      property: 'og:image',
      content: 'https://mamvietnam.vn/wp-content/uploads/2025/07/mam-logo.webp',
    },
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
