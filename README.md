# STEADYWRK

> Where ambition compounds.

Jordan's AI-native career platform. US-incorporated, Jordan-operated. Building 15, King Hussein Business Park, Amman.

## What This Is

STEADYWRK trains ambitious Jordanian talent with real AI tools, ships real work to US clients, and builds careers that compound. Four verticals: AI Lab, Facility Management, Digital Marketing, AI BPO.

**Live:** [steadywrk.app](https://steadywrk.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion 12 |
| Components | 17 MagicUI primitives (shimmer, particles, number-ticker, blur-fade, etc.) |
| Fonts | Cabinet Grotesk (display) + Satoshi (body) via Fontshare |
| Icons | Lucide React |
| 3D/WebGL | Three.js + React Three Fiber |
| Analytics | Vercel Analytics + Speed Insights |
| Deploy | Vercel (web), Cloudflare Workers (MCPs) |
| Monorepo | Turborepo + npm workspaces |
| Linting | Biome (single quotes, semicolons, 2-space indent, 100 line width) |

## Project Structure

```
steadywrk/
├── CLAUDE.md                   # AI agent instructions
├── .reference/                 # Brand docs, assets, research PDFs
│   ├── docs/                   # Brand Guidelines v1/v2, Blueprint v4
│   └── brand-assets/           # 3D logo renders, mockups, icons
├── apps/
│   └── web/                    # steadywrk.app — Next.js
│       ├── src/app/            # Pages, API routes, SEO files
│       ├── src/components/ui/  # 17 MagicUI + custom components
│       ├── src/lib/            # Data, hooks, utils, schemas
│       └── public/brand/       # Optimized images for production
├── biome.json
├── turbo.json
└── package.json
```

## Brand

- **Name:** STEADYWRK (all caps in logo, "Steadywrk" in body text)
- **Tagline:** "Where ambition compounds."
- **Colors:** Signal Amber `#E58A0F` · Warm Off-White `#FAFAF8` · Graphite `#23211D`
- **Entity:** STEADYWRK LLC (US/JO)
- **Programs:** IGNITE (internship) · ORBIT (fellowship) · APEX (leadership)

## Development

```bash
npm install
npm run dev          # turbo dev → localhost:3000
npm run build        # turbo build
npm run lint         # turbo lint
npm run format       # biome format
```

## Reference Knowledge

See [`.reference/README.md`](.reference/README.md) for brand guidelines, research documents, and image assets used in development.

## GEO

- `public/llms.txt` — LLM-friendly company summary for Generative Engine Optimization
- `schema.org/Organization` structured data in layout
- `schema.org/JobPosting` planned for each role page
- Sitemap, robots.txt, OpenGraph images all configured

---

© 2026 STEADYWRK LLC · Building 15, KHBP, Amman, Jordan · [steadywrk.app](https://steadywrk.app)
