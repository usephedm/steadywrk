import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/careers(.*)',
  '/programs(.*)',
  '/about',
  '/culture',
  '/salaries(.*)',
  '/apply(.*)',
  '/blog(.*)',
  '/privacy',
  '/terms',
  '/ar(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/contact',
  '/api/health',
  '/api/apply',
  '/api/contact',
  '/api/jobs',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/opengraph-image(.*)',
]);

const authMiddleware = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

const shouldBypassAuth =
  process.env.PLAYWRIGHT_BYPASS_AUTH === '1' && process.env.GITHUB_ACTIONS === 'true';

export default shouldBypassAuth ? () => NextResponse.next() : authMiddleware;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
