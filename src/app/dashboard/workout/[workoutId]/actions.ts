'use server'

import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { updateWorkout } from '@/data/workouts'

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, 'Workout name is required'),
  startedAt: z.coerce.date(),
})

export async function updateWorkoutAction(params: { workoutId: string; name: string; startedAt: Date }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const { workoutId, name, startedAt } = updateWorkoutSchema.parse(params)
  await updateWorkout(userId, workoutId, name, startedAt)

  redirect('/dashboard')
}
