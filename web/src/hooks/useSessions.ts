import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { apiErrorMessage } from '@/services/api'
import * as sessionsService from '@/services/sessions'
import type { SetLogInput } from '@/services/types'

export function useSessions() {
  return useQuery({ queryKey: ['sessions'], queryFn: sessionsService.fetchSessions })
}

export function useSession(id: number) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsService.fetchSession(id),
  })
}

export function useStartSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (workoutId?: number) => sessionsService.startSession(workoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Sessão iniciada. Bora treinar!')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao iniciar sessão')),
  })
}

export function useFinishSession(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (durationSeconds: number) =>
      sessionsService.updateSession(id, { status: 'completed', duration_seconds: durationSeconds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', id] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Sessão finalizada. Bom treino!')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao finalizar sessão')),
  })
}

export function useAddSessionExercise(sessionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (exerciseId: number) => sessionsService.addSessionExercise(sessionId, exerciseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session', sessionId] }),
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao adicionar exercício')),
  })
}

export function useCreateSetLog(sessionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SetLogInput) => sessionsService.createSetLog(sessionId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session', sessionId] }),
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao registrar série')),
  })
}

export function useDeleteSetLog(sessionId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sessionsService.deleteSetLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session', sessionId] }),
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao remover série')),
  })
}
