import { db } from '@/db'
import { workouts } from '@/db/schema'
import { randomUUID } from 'crypto'

export async function insertWorkout(userId: string, name: string, startedAt: Date) {
  return await db.insert(workouts).values({ id: randomUUID(), userId, name, startedAt }).returning()
}
