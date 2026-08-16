import type { Category, Equipment, Exercise, MuscleGroup } from './models'

export type ExerciseOrigin='default'|'custom'|'all'
export interface ExerciseFilters { query:string; muscle:MuscleGroup|null; equipment:Equipment|null; category:Category|null; origin:ExerciseOrigin }
export const normalizeSearch=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim()
export function filterExercises(exercises:Exercise[],filters:ExerciseFilters){const q=normalizeSearch(filters.query);return exercises.filter(x=>(!q||normalizeSearch(`${x.name} ${x.description??''}`).includes(q))&&(!filters.muscle||x.primary_muscle_group===filters.muscle||x.secondary_muscle_groups.includes(filters.muscle))&&(!filters.equipment||x.equipment===filters.equipment)&&(!filters.category||x.category===filters.category)&&(filters.origin==='all'||(filters.origin==='custom')===!!x.custom))}
