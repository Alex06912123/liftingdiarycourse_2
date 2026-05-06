# Routing Coding Standards

## Core Principle: All Routes Under /dashboard

**CRITICAL**: All application routes MUST be nested under `/dashboard`. There are no top-level feature routes outside of this path.

### ✅ Correct Route Structure
```
/dashboard                        → main dashboard page
/dashboard/workout/[workoutId]    → workout detail page
/dashboard/[feature]/[...]        → any future feature pages
```

### ❌ Prohibited
- Feature pages at the root level (e.g. `/workout`, `/profile`)
- Authenticated pages outside of `/dashboard`

## Route Protection

**CRITICAL**: All `/dashboard` routes are protected and must only be accessible by authenticated users.

- Route protection is enforced **exclusively via Next.js middleware**
- Do NOT add auth guards inside page components or layouts
- Middleware is the single enforcement point for all protected routes

## Middleware Implementation

Use `clerkMiddleware` with `createRouteMatcher` in `src/middleware.ts`:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- `auth.protect()` automatically redirects unauthenticated users to the Clerk sign-in page
- The `/dashboard(.*)` matcher covers the dashboard root and all sub-routes

## Adding New Routes

When adding a new feature page:

1. Create it under `src/app/dashboard/[feature]/page.tsx`
2. No middleware changes are needed — `/dashboard(.*)` already covers all sub-routes
3. Never create authenticated feature pages outside of `/dashboard`
