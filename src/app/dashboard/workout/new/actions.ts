'use server'

import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { insertWorkout } from '@/data/workouts'

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  startedAt: z.coerce.date(),
})

export async function createWorkoutAction(params: { name: string; startedAt: Date }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const { name, startedAt } = createWorkoutSchema.parse(params)
  await insertWorkout(userId, name, startedAt)

  redirect('/dashboard')
}
