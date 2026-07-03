import { Play, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateWorkout, useWorkouts } from '@/hooks/useWorkouts'
import { useStartSession } from '@/hooks/useSessions'

export function WorkoutsPage() {
  const navigate = useNavigate()
  const { data: workouts, isLoading } = useWorkouts()
  const createWorkout = useCreateWorkout()
  const startSession = useStartSession()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    createWorkout.mutate(
      { name, description: description || undefined },
      {
        onSuccess: (workout) => {
          setDialogOpen(false)
          setName('')
          setDescription('')
          navigate(`/workouts/${workout.id}`)
        },
      },
    )
  }

  function handleStart(workoutId?: number) {
    startSession.mutate(workoutId, {
      onSuccess: (session) => navigate(`/sessions/${session.id}`),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Treinos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Novo treino
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display uppercase">Novo treino</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workout-name">Nome</Label>
                <Input
                  id="workout-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Treino A — Peito e Tríceps"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workout-description">Descrição (opcional)</Label>
                <Input
                  id="workout-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Foco, dia da semana..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={createWorkout.isPending}>
                {createWorkout.isPending ? 'Criando...' : 'Criar treino'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleStart()}
        disabled={startSession.isPending}
      >
        <Play className="h-4 w-4" /> Iniciar sessão livre (sem treino)
      </Button>

      {isLoading && <p className="py-8 text-center text-muted-foreground">Carregando...</p>}

      {workouts?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <p>Você ainda não tem treinos.</p>
            <p className="text-sm">Crie seu primeiro treino para começar.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {workouts?.map((workout) => (
          <Card key={workout.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <Link to={`/workouts/${workout.id}`} className="min-w-0">
                  <CardTitle className="truncate text-lg hover:text-primary">
                    {workout.name}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {workout.exercises_count}{' '}
                    {workout.exercises_count === 1 ? 'exercício' : 'exercícios'}
                    {workout.description ? ` · ${workout.description}` : ''}
                  </p>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleStart(workout.id)}
                  disabled={startSession.isPending}
                >
                  <Play className="h-4 w-4" /> Iniciar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4 pt-0" />
          </Card>
        ))}
      </div>
    </div>
  )
}
