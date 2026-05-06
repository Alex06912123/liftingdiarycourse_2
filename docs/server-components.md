# Server Components Coding Standards

## Core Principle

All page components in this Next.js 15 application are Server Components by default. Follow these standards when implementing them.

## Params and SearchParams MUST Be Awaited

**CRITICAL**: In Next.js 15, `params` and `searchParams` are **Promises** and MUST be awaited before accessing their values.

### ✅ Correct

```typescript
// app/dashboard/workout/[workoutId]/page.tsx
type Props = {
  params: Promise<{ workoutId: string }>
}

export default async function WorkoutPage({ params }: Props) {
  const { workoutId } = await params

  // Now use workoutId safely
}
```

### ❌ Incorrect — will cause a runtime error

```typescript
// DO NOT do this
type Props = {
  params: { workoutId: string }
}

export default async function WorkoutPage({ params }: Props) {
  const { workoutId } = params // ❌ params is a Promise, not a plain object
}
```

### SearchParams

The same rule applies to `searchParams`:

```typescript
type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams
}
```

## Page Component Requirements

- Page components MUST be `async` functions
- Always type `params` and `searchParams` as `Promise<...>`
- Await params at the top of the component body before any other logic
- Never pass un-awaited params directly to child components or data helpers

## General Server Component Standards

- Server Components MUST NOT use React hooks (`useState`, `useEffect`, etc.)
- Server Components MUST NOT use browser-only APIs
- Mark a component as a Client Component with `"use client"` only when interactivity or hooks are required
- Data fetching belongs in Server Components — see `/docs/data-fetching.md`
