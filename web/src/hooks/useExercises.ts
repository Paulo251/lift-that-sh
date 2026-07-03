import { useQuery } from '@tanstack/react-query'

import { fetchExerciseProgress, fetchExercises } from '@/services/exercises'
import type { ExerciseFilters } from '@/services/types'

export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => fetchExercises(filters),
  })
}

export function useExerciseProgress(exerciseId: number | null) {
  return useQuery({
    queryKey: ['exercise-progress', exerciseId],
    queryFn: () => fetchExerciseProgress(exerciseId!),
    enabled: exerciseId != null,
  })
}
