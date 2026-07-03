import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { apiErrorMessage } from '@/services/api'
import * as workoutsService from '@/services/workouts'
import type { WorkoutExerciseInput } from '@/services/types'

export function useWorkouts() {
  return useQuery({ queryKey: ['workouts'], queryFn: workoutsService.fetchWorkouts })
}

export function useWorkout(id: number) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => workoutsService.fetchWorkout(id),
  })
}

export function useCreateWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workoutsService.createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      toast.success('Treino criado')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao criar treino')),
  })
}

export function useUpdateWorkout(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<workoutsService.WorkoutInput>) =>
      workoutsService.updateWorkout(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['workout', id] })
      toast.success('Treino atualizado')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao atualizar treino')),
  })
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: workoutsService.deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      toast.success('Treino excluído')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao excluir treino')),
  })
}

export function useSyncWorkoutExercises(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (exercises: WorkoutExerciseInput[]) =>
      workoutsService.syncWorkoutExercises(id, exercises),
    onSuccess: (workout) => {
      queryClient.setQueryData(['workout', id], workout)
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao salvar exercícios')),
  })
}
