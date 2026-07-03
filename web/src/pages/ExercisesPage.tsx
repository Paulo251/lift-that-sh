import { Search } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExercises } from '@/hooks/useExercises'
import {
  CATEGORY_LABELS,
  EQUIPMENT_LABELS,
  MUSCLE_GROUP_LABELS,
} from '@/lib/constants'

const ALL = 'all'

export function ExercisesPage() {
  const [q, setQ] = useState('')
  const [muscleGroup, setMuscleGroup] = useState(ALL)
  const [equipment, setEquipment] = useState(ALL)
  const [category, setCategory] = useState(ALL)

  const { data: exercises, isLoading } = useExercises({
    q: q || undefined,
    muscle_group: muscleGroup === ALL ? undefined : muscleGroup,
    equipment: equipment === ALL ? undefined : equipment,
    category: category === ALL ? undefined : category,
  })

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Exercícios</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar exercício..."
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Select value={muscleGroup} onValueChange={setMuscleGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Músculo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {Object.entries(MUSCLE_GROUP_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={equipment} onValueChange={setEquipment}>
          <SelectTrigger>
            <SelectValue placeholder="Equipamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {Object.entries(EQUIPMENT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="py-8 text-center text-muted-foreground">Carregando...</p>}
      {exercises?.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">Nenhum exercício encontrado.</p>
      )}

      <div className="space-y-2">
        {exercises?.map((exercise) => (
          <Card key={exercise.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  {exercise.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{exercise.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="sky">{MUSCLE_GROUP_LABELS[exercise.primary_muscle_group]}</Badge>
                <Badge variant="secondary">{EQUIPMENT_LABELS[exercise.equipment]}</Badge>
                <Badge variant="outline">{CATEGORY_LABELS[exercise.category]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
