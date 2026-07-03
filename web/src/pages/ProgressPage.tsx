import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExerciseProgress, useExercises } from '@/hooks/useExercises'
import { formatDate } from '@/lib/utils'

export function ProgressPage() {
  const { data: exercises } = useExercises()
  const [exerciseId, setExerciseId] = useState<number | null>(null)
  const { data: progress, isLoading } = useExerciseProgress(exerciseId)

  const points = progress?.points ?? []
  const maxWeight = points.length ? Math.max(...points.map((p) => p.max_weight)) : null

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Progresso</h1>

      <Select
        value={exerciseId?.toString() ?? ''}
        onValueChange={(v) => setExerciseId(Number(v))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um exercício" />
        </SelectTrigger>
        <SelectContent>
          {exercises?.map((exercise) => (
            <SelectItem key={exercise.id} value={exercise.id.toString()}>
              {exercise.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {exerciseId == null && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Escolha um exercício para ver a evolução de carga.
          </CardContent>
        </Card>
      )}

      {exerciseId != null && isLoading && (
        <p className="py-8 text-center text-muted-foreground">Carregando...</p>
      )}

      {exerciseId != null && !isLoading && points.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhum registro para este exercício ainda.
          </CardContent>
        </Card>
      )}

      {points.length > 0 && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Recorde (PR):{' '}
                <span className="font-display text-xl text-primary">{maxWeight} kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 40% 24%)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d: string) => formatDate(d)}
                      tick={{ fill: 'hsl(215 25% 68%)', fontSize: 11 }}
                    />
                    <YAxis
                      unit=" kg"
                      tick={{ fill: 'hsl(215 25% 68%)', fontSize: 11 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(216 60% 14%)',
                        border: '1px solid hsl(216 40% 24%)',
                        borderRadius: 8,
                        color: 'hsl(210 50% 93%)',
                      }}
                      labelFormatter={(d) => formatDate(String(d))}
                      formatter={(value: number) => [`${value} kg`, 'Carga máxima']}
                    />
                    <Line
                      type="monotone"
                      dataKey="max_weight"
                      stroke="#FACC15"
                      strokeWidth={2}
                      dot={{ fill: '#FACC15', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Carga máxima por sessão (séries de aquecimento não contam)
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
