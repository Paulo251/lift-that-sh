import type { Exercise, WorkoutDocument, WorkoutSession } from './models'
export const uuid=()=>globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
export const now=()=>new Date().toISOString()
export function newWorkout(name:string):WorkoutDocument{const at=now();return {schema_version:1,id:uuid(),name,description:null,tags:[],created_at:at,updated_at:at,exercises:[],sessions:[],body:'\n'}}
export function startSession(w:WorkoutDocument):WorkoutSession{return {id:uuid(),workout_id:w.id,workout_name:w.name,started_at:now(),ended_at:null,duration_seconds:null,status:'in_progress',notes:null,exercises:w.exercises.map((x,i)=>({id:uuid(),exercise:structuredClone(x.exercise),position:i,sets:[],notes:x.notes}))}}
export function addSet(session:WorkoutSession,sessionExerciseId:string,input:{weight_kg:number;reps:number;set_type:any;rpe:number|null;rest_seconds?:number|null}){return {...session,exercises:session.exercises.map(e=>e.id!==sessionExerciseId?e:{...e,sets:[...e.sets,{id:uuid(),set_number:e.sets.length+1,...input,rest_seconds:input.rest_seconds??null,status:'completed' as const,completed_at:now()}]})}}
export function snapshotExercise(exercise:Exercise){return structuredClone(exercise)}
