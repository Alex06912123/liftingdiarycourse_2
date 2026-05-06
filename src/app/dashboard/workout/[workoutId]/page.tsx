import { notFound } from 'next/navigation'
import { getUserWorkoutWithExercises } from '@/data/user-workouts'
import EditWorkoutForm from './edit-workout-form'

type Props = {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params
  const workout = await getUserWorkoutWithExercises(workoutId)

  if (!workout) {
    notFound()
  }

  return (
    <EditWorkoutForm
      workoutId={workout.id}
      initialName={workout.name}
      initialStartedAt={workout.startedAt}
    />
  )
}
