# Auth Coding Standards

## Authentication Provider: Clerk

**CRITICAL**: This application uses **Clerk** exclusively for authentication. Do NOT use any other auth library (NextAuth, Auth.js, custom JWT, etc.).

## Setup

### Root Layout
Wrap the entire app in `ClerkProvider` at the root layout level:

```typescript
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware
Use `clerkMiddleware` in `src/middleware.ts` to protect routes:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## Getting the Current User

### In Server Components and Data Functions

Use `auth()` from `@clerk/nextjs/server` to get the current user's ID:

```typescript
import { auth } from '@clerk/nextjs/server'

export async function getMyData() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }
  // use userId to scope database queries
}
```

**NEVER** use client-side Clerk hooks (`useUser`, `useAuth`) in server components or data helper functions.

### In Client Components

Use Clerk's React hooks when auth state is needed on the client:

```typescript
'use client'
import { useUser } from '@clerk/nextjs'

export function MyClientComponent() {
  const { user, isLoaded } = useUser()
  // ...
}
```

## UI Components

Use Clerk's pre-built components for sign-in/sign-up UI and the user button:

```typescript
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
```

- `<SignedIn>` — renders children only when the user is authenticated
- `<SignedOut>` — renders children only when the user is NOT authenticated
- `<UserButton />` — renders the Clerk user avatar/menu
- `<SignInButton>` / `<SignUpButton>` — trigger Clerk's sign-in/sign-up flows

## Authorization Requirements

**CRITICAL SECURITY REQUIREMENT**: Every data helper function MUST verify `userId` before executing any database query. A user can only access their own data.

```typescript
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserWorkouts() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId)) // always scope by userId
}
```

## Import Reference

| Use case | Import from |
|---|---|
| Middleware | `@clerk/nextjs/server` |
| Server-side auth (userId) | `@clerk/nextjs/server` |
| Client React components/hooks | `@clerk/nextjs` |
