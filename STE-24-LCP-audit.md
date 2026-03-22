# Hero LCP Verification (STE-24)

**Status:** FAIL
**LCP Metric:** 7.6s
**Performance Score:** 58 / 100

## Analysis
The Largest Contentful Paint (LCP) is significantly above the target threshold of 2.5s. 

## Audit Recommendations
- The LCP element is likely a hero image or large text block.
- Consider preloading the hero image: `<link rel="preload" as="image" href="..." fetchpriority="high">`.
- Serve WebP or AVIF formats for the image.
- Ensure `fetchPriority="high"` and `priority="true"` on the Next.js `<Image />` component for the LCP element.
- Do not lazy load the LCP image.

*Data fetched against steadywrk.app via Lighthouse Headless.*