# Data Mutations Guidelines

## Core Principles

**CRITICAL**: ALL data mutations within this application MUST be done via Server Actions. This is a fundamental architectural requirement.

### ✅ Allowed Mutation Methods
- **Server Actions** - The ONLY approved method for data mutations

### ❌ Prohibited Mutation Methods
- Route handlers (API routes)
- Client-side fetch/axios calls
- Direct database calls from components
- Any other method not explicitly listed as allowed

## Database Mutation Requirements

### Helper Functions in /data Directory
All database mutations MUST be implemented as helper functions within the `src/data` directory.

### Drizzle ORM Required
- **MUST** use Drizzle ORM for all database mutations
- **NEVER** use raw SQL queries
- Follow Drizzle's type-safe mutation patterns

## Server Actions Requirements

### Colocation
Server Actions MUST be defined in a file named `actions.ts` colocated with the route or feature they belong to.

```
src/app/workouts/
  page.tsx
  actions.ts   ← server actions live here
```

### Typed Parameters — No FormData
- All server action parameters **MUST** be explicitly typed using TypeScript types or interfaces
- **NEVER** use `FormData` as a parameter type
- Pass plain typed objects instead

### Zod Validation — Required
Every server action **MUST** validate its arguments with Zod before performing any mutation.

## Implementation Pattern

```typescript
// src/data/workouts.ts
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function insertWorkout(userId: string, name: string, date: Date) {
  return await db.insert(workouts).values({ userId, name, date }).returning()
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
}
```

```typescript
// src/app/workouts/actions.ts
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { insertWorkout, deleteWorkout } from '@/data/workouts'

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
})

const deleteWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
})

export async function createWorkoutAction(params: { name: string; date: Date }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const { name, date } = createWorkoutSchema.parse(params)
  return await insertWorkout(session.user.id, name, date)
}

export async function deleteWorkoutAction(params: { workoutId: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const { workoutId } = deleteWorkoutSchema.parse(params)
  return await deleteWorkout(session.user.id, workoutId)
}
```

## Data Access Security

**CRITICAL SECURITY REQUIREMENT**:

A logged-in user can ONLY mutate their own data. They MUST NOT be able to mutate any other user's data.

- Always scope mutations to the current user's ID
- Validate user ownership inside the `src/data` helper before executing the mutation
- Never trust a `userId` passed from the client — always derive it from the server-side session

## Why This Approach?

1. **Security**: Server-side execution with session-derived identity — no client spoofing
2. **Validation**: Zod ensures invalid data never reaches the database
3. **Type Safety**: Typed params + Drizzle ORM provide end-to-end TypeScript coverage
4. **Consistency**: Single pattern for all data mutations across the app
5. **Separation of Concerns**: `src/data` helpers are reusable; actions handle auth + validation
