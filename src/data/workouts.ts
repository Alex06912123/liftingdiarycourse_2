import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function insertWorkout(userId: string, name: string, startedAt: Date) {
  return await db.insert(workouts).values({ id: randomUUID(), userId, name, startedAt }).returning()
}

export async function updateWorkout(userId: string, workoutId: string, name: string, startedAt: Date) {
  return await db
    .update(workouts)
    .set({ name, startedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning()
}
