import { ArrowLeft, Check, Copy, Plus, Timer, TimerReset, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ExercisePicker } from '@/components/ExercisePicker'
import { SetTypeBadge } from '@/components/SetTypeBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useAddSessionExercise,
  useCreateSetLog,
  useDeleteSetLog,
  useFinishSession,
  useSession,
} from '@/hooks/useSessions'
import { SET_TYPE_LABELS } from '@/lib/constants'
import { formatDate, formatDuration, formatWeight } from '@/lib/utils'
import type { SessionExercise, SetType } from '@/services/types'

const REST_OPTIONS = [30, 60, 90, 120, 180, 300]

function useElapsed(startedAt: string | undefined, running: boolean) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startedAt || !running) return
    const tick = () =>
      setElapsed(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startedAt, running])

  return elapsed
}

function useRestTimer() {
  const [duration, setDuration] = useState(90)
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (endsAt == null) return
    const tick = () => {
      const secondsLeft = Math.ceil((endsAt - Date.now()) / 1000)
      if (secondsLeft <= 0) {
        setEndsAt(null)
        toast.success('Descanso concluído. Bora pra próxima série!')
        if ('vibrate' in navigator) navigator.vibrate?.(300)
      } else {
        setRemaining(secondsLeft)
      }
    }
    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [endsAt])

  const start = useCallback(() => setEndsAt(Date.now() + duration * 1000), [duration])
  const addThirty = useCallback(() => setEndsAt((prev) => (prev ? prev + 30_000 : prev)), [])
  const cancel = useCallback(() => setEndsAt(null), [])

  return { duration, setDuration, running: endsAt != null, remaining, start, addThirty, cancel }
}

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface SetFormProps {
  sessionId: number
  sessionExercise: SessionExercise
  onSetLogged: () => void
}

function SetForm({ sessionId, sessionExercise, onSetLogged }: SetFormProps) {
  const createSetLog = useCreateSetLog(sessionId)
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [setType, setSetType] = useState<SetType>('normal')

  const lastSet = sessionExercise.set_logs[sessionExercise.set_logs.length - 1]

  function submit(e: FormEvent) {
    e.preventDefault()
    createSetLog.mutate(
      {
        session_exercise_id: sessionExercise.id,
        weight: Number(weight) || 0,
        reps: Number(reps) || 0,
        set_type: setType,
      },
      {
        onSuccess: () => {
          setWeight('')
          setReps('')
          onSetLogged()
        },
      },
    )
  }

  function duplicateLast() {
    if (!lastSet) return
    createSetLog.mutate(
      {
        session_exercise_id: sessionExercise.id,
        weight: lastSet.weight,
        reps: lastSet.reps,
        set_type: lastSet.set_type,
      },
      { onSuccess: onSetLogged },
    )
  }

  return (
    <div className="space-y-2">
      <form onSubmit={submit} className="flex items-end gap-2">
        <div className="w-20">
          <label className="text-[11px] text-muted-foreground">Peso (kg)</label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.5"
            min={0}
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="w-16">
          <label className="text-[11px] text-muted-foreground">Reps</label>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            required
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-[11px] text-muted-foreground">Tipo</label>
          <Select value={setType} onValueChange={(v) => setSetType(v as SetType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SET_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={createSetLog.isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {lastSet && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={duplicateLast}
          disabled={createSetLog.isPending}
        >
          <Copy className="h-3.5 w-3.5" /> Duplicar última série ({formatWeight(lastSet.weight)} ×{' '}
          {lastSet.reps})
        </Button>
      )}
    </div>
  )
}

export function SessionPage() {
  const { id } = useParams()
  const sessionId = Number(id)

  const { data: session, isLoading } = useSession(sessionId)
  const finishSession = useFinishSession(sessionId)
  const addExercise = useAddSessionExercise(sessionId)
  const deleteSetLog = useDeleteSetLog(sessionId)

  const inProgress = session?.status === 'in_progress'
  const elapsed = useElapsed(session?.performed_at, Boolean(inProgress))
  const rest = useRestTimer()

  if (isLoading) return <p className="py-8 text-center text-muted-foreground">Carregando...</p>
  if (!session) return <p className="py-8 text-center text-muted-foreground">Sessão não encontrada.</p>

  const exercises = session.session_exercises ?? []

  return (
    <div className={inProgress ? 'space-y-4 pb-14' : 'space-y-4'}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/history">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold uppercase tracking-wide">
            {session.workout_name ?? 'Sessão livre'}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(session.performed_at)}</p>
        </div>
        {inProgress ? (
          <Badge className="shrink-0">Em andamento</Badge>
        ) : (
          <Badge variant="secondary" className="shrink-0">
            Concluída
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-primary" />
            <span className="font-mono text-lg font-semibold">
              {inProgress ? formatDuration(elapsed) : formatDuration(session.duration_seconds)}
            </span>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>
              Volume: <span className="font-semibold text-foreground">{session.total_volume.toFixed(0)} kg</span>
            </p>
            <p>{session.total_sets} séries</p>
          </div>
        </CardContent>
      </Card>

      {exercises.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum exercício nesta sessão ainda.
          </CardContent>
        </Card>
      )}

      {exercises.map((se) => (
        <Card key={se.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{se.exercise.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {se.set_logs.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 px-2">#</TableHead>
                    <TableHead className="h-8 px-2">Peso</TableHead>
                    <TableHead className="h-8 px-2">Reps</TableHead>
                    <TableHead className="h-8 px-2">Tipo</TableHead>
                    {inProgress && <TableHead className="h-8 px-2" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {se.set_logs.map((set) => (
                    <TableRow key={set.id}>
                      <TableCell className="p-2 text-muted-foreground">{set.set_number}</TableCell>
                      <TableCell className="p-2 font-medium">{formatWeight(set.weight)}</TableCell>
                      <TableCell className="p-2">{set.reps}</TableCell>
                      <TableCell className="p-2">
                        <SetTypeBadge setType={set.set_type} />
                      </TableCell>
                      {inProgress && (
                        <TableCell className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => deleteSetLog.mutate(set.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {inProgress && (
              <SetForm sessionId={sessionId} sessionExercise={se} onSetLogged={rest.start} />
            )}
          </CardContent>
        </Card>
      ))}

      {inProgress && (
        <>
          <ExercisePicker
            onPick={(exercise) => addExercise.mutate(exercise.id)}
            trigger={
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4" /> Adicionar exercício
              </Button>
            }
          />
          <Button
            className="w-full"
            size="lg"
            onClick={() => finishSession.mutate(elapsed)}
            disabled={finishSession.isPending}
          >
            <Check className="h-4 w-4" />
            {finishSession.isPending ? 'Finalizando...' : 'Finalizar sessão'}
          </Button>

          <div className="fixed inset-x-0 bottom-[3.35rem] z-30 border-t bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-12 max-w-3xl items-center gap-2 px-4">
              {rest.running ? (
                <>
                  <TimerReset className="h-4 w-4 animate-pulse text-primary" />
                  <span className="font-mono text-lg font-bold text-primary">
                    {formatCountdown(rest.remaining)}
                  </span>
                  <span className="flex-1 text-xs text-muted-foreground">descansando...</span>
                  <Button variant="secondary" size="sm" className="h-8" onClick={rest.addThirty}>
                    +30s
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8" onClick={rest.cancel}>
                    <X className="h-3.5 w-3.5" /> Pular
                  </Button>
                </>
              ) : (
                <>
                  <TimerReset className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Descanso</span>
                  <Select
                    value={String(rest.duration)}
                    onValueChange={(v) => rest.setDuration(Number(v))}
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REST_OPTIONS.map((seconds) => (
                        <SelectItem key={seconds} value={String(seconds)}>
                          {formatCountdown(seconds)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="h-8" onClick={rest.start}>
                    Iniciar
                  </Button>
                  <span className="flex-1 text-right text-[11px] text-muted-foreground">
                    auto-inicia ao registrar série
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
