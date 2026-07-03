import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { apiErrorMessage } from '@/services/api'
import * as adminService from '@/services/admin'
import type { AdminExerciseInput, AdminUserInput } from '@/services/admin'

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin-users'], queryFn: adminService.fetchAdminUsers })
}

export function useSaveAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number | null; input: AdminUserInput }) =>
      id ? adminService.updateAdminUser(id, input) : adminService.createAdminUser(input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success(id ? 'Usuário atualizado' : 'Usuário criado')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao salvar usuário')),
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminService.deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Usuário excluído')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao excluir usuário')),
  })
}

export function useAdminExercises() {
  return useQuery({ queryKey: ['admin-exercises'], queryFn: adminService.fetchAdminExercises })
}

function invalidateExerciseData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
  queryClient.invalidateQueries({ queryKey: ['exercises'] })
  queryClient.invalidateQueries({ queryKey: ['workouts'] })
  queryClient.invalidateQueries({ queryKey: ['workout'] })
}

export function useSaveAdminExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number | null; input: AdminExerciseInput }) =>
      id ? adminService.updateAdminExercise(id, input) : adminService.createAdminExercise(input),
    onSuccess: (_, { id }) => {
      invalidateExerciseData(queryClient)
      toast.success(id ? 'Exercício atualizado' : 'Exercício criado')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao salvar exercício')),
  })
}

export function useDeleteAdminExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminService.deleteAdminExercise,
    onSuccess: () => {
      invalidateExerciseData(queryClient)
      toast.success('Exercício excluído do catálogo')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Erro ao excluir exercício')),
  })
}
