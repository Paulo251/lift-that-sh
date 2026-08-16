export const SET_TYPES = ['warmup','normal','drop_set','super_set','failure','rest_pause','negative','pyramid'] as const
export type SetType = typeof SET_TYPES[number]
export type SessionStatus = 'in_progress' | 'completed'
export type MuscleGroup = 'chest'|'back'|'legs'|'shoulders'|'biceps'|'triceps'|'core'|'glutes'|'calves'|'forearms'
export type Equipment = 'barbell'|'dumbbell'|'machine'|'cable'|'bodyweight'|'kettlebell'|'band'
export type Category = 'compound'|'isolation'

export interface Exercise { id:string; name:string; description:string|null; primary_muscle_group:MuscleGroup; secondary_muscle_groups:string[]; equipment:Equipment; category:Category; custom?:boolean }
export interface SetLog { id:string; set_number:number; weight_kg:number; reps:number; set_type:SetType; rpe:number|null; status:'planned'|'completed'|'skipped'; rest_seconds:number|null; completed_at:string|null }
export interface SessionExercise { id:string; exercise:Exercise; position:number; sets:SetLog[]; notes:string|null }
export interface WorkoutSession { id:string; workout_id:string; workout_name:string; started_at:string; ended_at:string|null; duration_seconds:number|null; status:SessionStatus; notes:string|null; exercises:SessionExercise[] }
export interface WorkoutExercise { id:string; exercise:Exercise; position:number; target_sets:number|null; target_reps:number|null; notes:string|null }
export interface WorkoutDocument { schema_version:1; id:string; name:string; description:string|null; tags:string[]; created_at:string; updated_at:string; exercises:WorkoutExercise[]; sessions:WorkoutSession[]; body:string }
export interface ExerciseCatalog { schema_version:1; default_catalog_version?:number; updated_at:string; exercises:Exercise[]; body:string }
export interface InvalidDocument { uri:string; message:string }
export interface VaultIndex { workouts:WorkoutDocument[]; catalog:ExerciseCatalog; invalid:InvalidDocument[]; indexedAt:string }
