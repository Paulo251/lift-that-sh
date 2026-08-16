import yaml from 'js-yaml'
import { CatalogDataSchema, WorkoutDataSchema, assertUniqueExerciseIds, assertUniqueIds } from './schema'
import type { ExerciseCatalog, WorkoutDocument } from './models'

export class DocumentError extends Error { constructor(message:string, public readonly causeValue?:unknown){super(message);this.name='DocumentError'} }
function split(source:string){if(!source.startsWith('---\n')) throw new DocumentError('Frontmatter YAML ausente'); const end=source.indexOf('\n---\n',4); if(end<0) throw new DocumentError('Frontmatter YAML não foi fechado'); return {frontmatter:source.slice(4,end),body:source.slice(end+5)} }
function load(source:string){const {frontmatter,body}=split(source); try{return {data:yaml.load(frontmatter),body}}catch(error){throw new DocumentError('YAML inválido',error)} }
function dump(data:unknown,body:string){return `---\n${yaml.dump(data,{noRefs:true,lineWidth:-1,sortKeys:false})}---\n${body}`}
function parse<T>(source:string, schema:{parse:(x:unknown)=>T}){const {data,body}=load(source); try { const parsed=schema.parse(data); assertUniqueIds(parsed); return {...parsed,body} } catch(error){throw new DocumentError(error instanceof Error?error.message:'Documento inválido',error)} }
export const parseWorkout=(source:string):WorkoutDocument=>parse(source,WorkoutDataSchema)
export const serializeWorkout=({body,...data}:WorkoutDocument)=>dump(data,body)
export const parseCatalog=(source:string):ExerciseCatalog=>{const catalog=parse(source,CatalogDataSchema);assertUniqueExerciseIds(catalog);return catalog}
export const serializeCatalog=({body,...data}:ExerciseCatalog)=>dump(data,body)
