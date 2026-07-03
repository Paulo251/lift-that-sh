import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useSessions } from '@/hooks/useSessions'
import { formatDate, formatDuration } from '@/lib/utils'

export function HistoryPage() {
  const { data: sessions, isLoading } = useSessions()

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Histórico</h1>

      {isLoading && <p className="py-8 text-center text-muted-foreground">Carregando...</p>}

      {sessions?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <p>Nenhuma sessão registrada ainda.</p>
            <p className="text-sm">Inicie um treino para começar seu histórico.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {sessions?.map((session) => (
          <Link key={session.id} to={`/sessions/${session.id}`} className="block">
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {session.workout_name ?? 'Sessão livre'}
                    </p>
                    {session.status === 'in_progress' && <Badge>Em andamento</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(session.performed_at)} · {session.exercises_count} exercícios ·{' '}
                    {session.total_sets} séries
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Volume: {session.total_volume.toFixed(0)} kg ·{' '}
                    {formatDuration(session.duration_seconds)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
