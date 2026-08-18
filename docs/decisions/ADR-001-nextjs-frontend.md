# ADR-001: Use Next.js for the frontend

## Status

Accepted

## Context

The portfolio platform needs a modern, production-oriented frontend capable of handling the public portfolio site and, later, a private admin dashboard. The team's stack direction favors a React-based ecosystem with strong TypeScript support.

## Decision

Use **Next.js** with the **App Router** and TypeScript.

## Consequences

### Positive

- Server-side rendering and static generation for fast, SEO-friendly public pages.
- App Router provides a modern file-based routing and layout model.
- TypeScript by default; the frontend stays fully typed.
- Large ecosystem, excellent tooling (Tailwind CSS, ESLint), and straightforward future containerization/deployment (Node, Vercel, or container images).

### Negative / Trade-offs

- Next.js brings a specific opinionated structure (App Router) that team members must learn.
- Version churn is faster than with a more conservative framework.

## Alternatives Considered

- **Remix**: viable, but Next.js is more widely adopted and better aligned with the ecosystem.
- **Vite + React SPA**: simpler, but excludes SSR/SEO benefits and adds deployment complexity for SEO later.
- **Plain static site**: insufficient for an interactive portfolio with AI assistant features.
