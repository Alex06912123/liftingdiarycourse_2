'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateWorkoutAction } from './actions'

type Props = {
  workoutId: string
  initialName: string
  initialStartedAt: Date
}

export default function EditWorkoutForm({ workoutId, initialName, initialStartedAt }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [date, setDate] = useState(format(initialStartedAt, 'yyyy-MM-dd'))
  const [time, setTime] = useState(format(initialStartedAt, 'HH:mm'))
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const startedAt = new Date(`${date}T${time}`)
      await updateWorkoutAction({ workoutId, name, startedAt })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                placeholder="e.g. Push Day"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
