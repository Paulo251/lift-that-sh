import { z } from 'zod'
import { SET_TYPES } from './models'

const id = z.string().min(1)
const exercise = z.object({id,name:z.string().min(1),description:z.string().nullable(),primary_muscle_group:z.enum(['chest','back','legs','shoulders','biceps','triceps','core','glutes','calves','forearms']),secondary_muscle_groups:z.array(z.string()),equipment:z.enum(['barbell','dumbbell','machine','cable','bodyweight','kettlebell','band']),category:z.enum(['compound','isolation']),custom:z.boolean().optional()})
const setLog = z.object({id,set_number:z.number().int().positive(),weight_kg:z.number().nonnegative(),reps:z.number().int().nonnegative(),set_type:z.enum(SET_TYPES),rpe:z.number().min(1).max(10).multipleOf(.5).nullable(),status:z.enum(['planned','completed','skipped']),rest_seconds:z.number().int().nonnegative().nullable(),completed_at:z.string().nullable()})
const sessionExercise = z.object({id,exercise,position:z.number().int().nonnegative(),sets:z.array(setLog),notes:z.string().nullable()})
const session = z.object({id,workout_id:id,workout_name:z.string(),started_at:z.string(),ended_at:z.string().nullable(),duration_seconds:z.number().int().nonnegative().nullable(),status:z.enum(['in_progress','completed']),notes:z.string().nullable(),exercises:z.array(sessionExercise)})
const workoutExercise = z.object({id,exercise,position:z.number().int().nonnegative(),target_sets:z.number().int().positive().nullable(),target_reps:z.number().int().positive().nullable(),notes:z.string().nullable()})
export const WorkoutDataSchema = z.object({schema_version:z.literal(1),id,name:z.string().min(1),description:z.string().nullable(),tags:z.array(z.string()),created_at:z.string(),updated_at:z.string(),exercises:z.array(workoutExercise),sessions:z.array(session)})
export const CatalogDataSchema = z.object({schema_version:z.literal(1),default_catalog_version:z.number().int().positive().optional(),updated_at:z.string(),exercises:z.array(exercise)})

function duplicateIds(value:unknown): string[] { const seen=new Set<string>(), duplicates=new Set<string>(); const visit=(v:unknown)=>{if(Array.isArray(v))v.forEach(visit); else if(v&&typeof v==='object'){const x=v as Record<string,unknown>,isExercise=typeof x.name==='string'&&'primary_muscle_group'in x&&'equipment'in x;if(typeof x.id==='string'&&!isExercise){if(seen.has(x.id))duplicates.add(x.id); seen.add(x.id)}; Object.values(x).forEach(visit)}}; visit(value); return [...duplicates] }
export function assertUniqueIds(value:unknown){const ids=duplicateIds(value); if(ids.length) throw new Error(`IDs duplicados: ${ids.join(', ')}`)}
export function assertUniqueExerciseIds(value:{exercises:{id:string}[]}){const seen=new Set<string>(),duplicates=new Set<string>();for(const x of value.exercises){if(seen.has(x.id))duplicates.add(x.id);seen.add(x.id)}if(duplicates.size)throw new Error(`IDs duplicados: ${[...duplicates].join(', ')}`)}
