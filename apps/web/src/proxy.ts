import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/careers(.*)',
  '/programs(.*)',
  '/about',
  '/culture',
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
  '/api/waitlist',
  '/api/jobs',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/opengraph-image(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
