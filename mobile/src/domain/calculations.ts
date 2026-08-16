import type { WorkoutDocument, WorkoutSession } from './models'
export const setVolume=(s:{weight_kg:number;reps:number;set_type:string;status:string})=>s.status==='completed'&&s.set_type!=='warmup'?s.weight_kg*s.reps:0
export const sessionVolume=(s:WorkoutSession)=>s.exercises.flatMap(e=>e.sets).reduce((n,x)=>n+setVolume(x),0)
export const sessionSets=(s:WorkoutSession)=>s.exercises.flatMap(e=>e.sets).filter(x=>x.status==='completed').length
export function allSessions(workouts:WorkoutDocument[]){return workouts.flatMap(w=>w.sessions).sort((a,b)=>b.started_at.localeCompare(a.started_at))}
export function activeSession(workouts:WorkoutDocument[]){return allSessions(workouts).find(s=>s.status==='in_progress')}
export function progress(workouts:WorkoutDocument[],exerciseId:string){return allSessions(workouts).filter(s=>s.status==='completed').map(s=>{const sets=s.exercises.filter(e=>e.exercise.id===exerciseId).flatMap(e=>e.sets).filter(x=>x.status==='completed'&&x.set_type!=='warmup'); return {session_id:s.id,date:s.started_at,max_weight:sets.reduce((m,x)=>Math.max(m,x.weight_kg),0),volume:sets.reduce((n,x)=>n+setVolume(x),0)}}).filter(x=>x.max_weight>0||x.volume>0).sort((a,b)=>a.date.localeCompare(b.date))}
