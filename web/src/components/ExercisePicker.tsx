import { Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useExercises } from '@/hooks/useExercises'
import { EQUIPMENT_LABELS, MUSCLE_GROUP_LABELS } from '@/lib/constants'
import type { Exercise } from '@/services/types'

interface ExercisePickerProps {
  trigger: ReactNode
  onPick: (exercise: Exercise) => void
}

export function ExercisePicker({ trigger, onPick }: ExercisePickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data: exercises, isLoading } = useExercises(search ? { q: search } : {})

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="flex h-[85vh] flex-col rounded-t-lg">
        <SheetHeader>
          <SheetTitle className="font-display uppercase">Escolher exercício</SheetTitle>
        </SheetHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar exercício..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto pt-2">
          {isLoading && <p className="py-8 text-center text-sm text-muted-foreground">Carregando...</p>}
          {exercises?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhum exercício encontrado.</p>
          )}
          {exercises?.map((exercise) => (
            <button
              key={exercise.id}
              className="flex w-full items-center justify-between rounded-md border bg-secondary/40 px-3 py-2.5 text-left transition-colors hover:border-primary/50"
              onClick={() => {
                onPick(exercise)
                setOpen(false)
              }}
            >
              <div>
                <p className="text-sm font-medium">{exercise.name}</p>
                <p className="text-xs text-muted-foreground">
                  {EQUIPMENT_LABELS[exercise.equipment]}
                </p>
              </div>
              <Badge variant="sky">{MUSCLE_GROUP_LABELS[exercise.primary_muscle_group]}</Badge>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
