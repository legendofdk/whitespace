# SEO Audit Report

## Audit Summary

- Scope: `codebase-local single-site audit`
- Overall rating: `Good baseline, key technical gaps fixed`
- Top issues before fixes:
  - Missing page-level metadata on several high-intent listing/contact routes
  - Missing JSON-LD structured data for articles, business entity, contact page, and property detail pages
  - `sitemap.xml` used a generic `now` timestamp for article URLs instead of source dates
- Top opportunities remaining:
  - Validate live rich results and rendered tags on production
  - Measure real CWV/PageSpeed on public URLs
  - Strengthen editorial E-E-A-T on article templates and author transparency

## Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| On-page metadata | Warning | Confirmed | `/dat-nen`, `/cho-thue`, `/tin-tuc`, `/lien-he` lacked dedicated metadata exports | No `metadata` export existed in those routes before patch | Added route metadata via `buildMetadata()` |
| Structured data | Warning | Confirmed | Site and content pages had no JSON-LD | No `application/ld+json` blocks existed in `app`, `components`, or `lib` before patch | Added reusable JSON-LD renderer and schema builders for `WebSite`, `Organization`, `LocalBusiness`, `ContactPage`, `BreadcrumbList`, `Article`, and page-level real estate schemas |
| Sitemap freshness | Warning | Confirmed | News URLs in `app/sitemap.ts` used `lastModified: now` | Static code path assigned current time to every post URL | Switched article `lastModified` to `publishedAtIso` when available |
| Article schema readiness | Warning | Confirmed | Post model did not retain ISO publish dates | `Post` type only exposed locale-formatted `publishedAt` | Added `publishedAtIso` to mapped post data for schema/sitemap use |
| Validation | Pass | Confirmed | Current SEO changes compile in production mode | `npm run build` completed successfully on May 7, 2026 | Keep build validation in CI |
| Core Web Vitals | Info | Hypothesis | No live performance evidence collected in this environment | Local repo audit only; no public fetch/PageSpeed run executed | Test production URLs with PageSpeed and CrUX |

## Unknowns and Follow-ups

- Rich Results eligibility on the live domain is still unverified.
- `robots.txt`, `sitemap.xml`, and canonicals should be checked against the deployed base URL.
- No crawl-depth or broken-link scan was run against the production site.
