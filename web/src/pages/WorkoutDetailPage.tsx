import { ArrowDown, ArrowLeft, ArrowUp, Play, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ExercisePicker } from '@/components/ExercisePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useStartSession } from '@/hooks/useSessions'
import { useDeleteWorkout, useSyncWorkoutExercises, useWorkout } from '@/hooks/useWorkouts'
import { MUSCLE_GROUP_LABELS } from '@/lib/constants'
import type { Exercise, WorkoutExercise, WorkoutExerciseInput } from '@/services/types'

function toInputs(list: WorkoutExercise[]): WorkoutExerciseInput[] {
  return list.map((we) => ({
    exercise_id: we.exercise.id,
    target_sets: we.target_sets,
    target_reps: we.target_reps,
    notes: we.notes,
  }))
}

export function WorkoutDetailPage() {
  const { id } = useParams()
  const workoutId = Number(id)
  const navigate = useNavigate()

  const { data: workout, isLoading } = useWorkout(workoutId)
  const syncExercises = useSyncWorkoutExercises(workoutId)
  const deleteWorkout = useDeleteWorkout()
  const startSession = useStartSession()

  const exercises = workout?.workout_exercises ?? []

  function handleAdd(exercise: Exercise) {
    syncExercises.mutate([
      ...toInputs(exercises),
      { exercise_id: exercise.id, target_sets: 3, target_reps: 10 },
    ])
  }

  function handleRemove(index: number) {
    const next = toInputs(exercises)
    next.splice(index, 1)
    syncExercises.mutate(next)
  }

  function handleMove(index: number, direction: -1 | 1) {
    const next = toInputs(exercises)
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    syncExercises.mutate(next)
  }

  function handleTargetChange(index: number, field: 'target_sets' | 'target_reps', value: string) {
    const next = toInputs(exercises)
    next[index] = { ...next[index], [field]: value === '' ? null : Number(value) }
    syncExercises.mutate(next)
  }

  function handleDelete() {
    if (!window.confirm('Excluir este treino? As sessões já realizadas serão mantidas.')) return
    deleteWorkout.mutate(workoutId, { onSuccess: () => navigate('/workouts') })
  }

  if (isLoading) return <p className="py-8 text-center text-muted-foreground">Carregando...</p>
  if (!workout) return <p className="py-8 text-center text-muted-foreground">Treino não encontrado.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/workouts">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold uppercase tracking-wide">
            {workout.name}
          </h1>
          {workout.description && (
            <p className="truncate text-sm text-muted-foreground">{workout.description}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} title="Excluir treino">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <Button
        className="w-full"
        onClick={() =>
          startSession.mutate(workoutId, {
            onSuccess: (session) => navigate(`/sessions/${session.id}`),
          })
        }
        disabled={startSession.isPending || exercises.length === 0}
      >
        <Play className="h-4 w-4" /> Iniciar sessão deste treino
      </Button>

      {exercises.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum exercício ainda. Adicione o primeiro.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {exercises.map((we, index) => (
          <Card key={we.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">
                    <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                    {we.exercise.name}
                  </p>
                  <Badge variant="sky" className="mt-1">
                    {MUSCLE_GROUP_LABELS[we.exercise.primary_muscle_group]}
                  </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0 || syncExercises.isPending}
                    onClick={() => handleMove(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === exercises.length - 1 || syncExercises.isPending}
                    onClick={() => handleMove(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={syncExercises.isPending}
                    onClick={() => handleRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Séries</span>
                  <Input
                    type="number"
                    min={0}
                    className="h-8 w-16"
                    defaultValue={we.target_sets ?? ''}
                    onBlur={(e) => handleTargetChange(index, 'target_sets', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Reps</span>
                  <Input
                    type="number"
                    min={0}
                    className="h-8 w-16"
                    defaultValue={we.target_reps ?? ''}
                    onBlur={(e) => handleTargetChange(index, 'target_reps', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ExercisePicker
        onPick={handleAdd}
        trigger={
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4" /> Adicionar exercício
          </Button>
        }
      />
    </div>
  )
}
