import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import { createContext,useCallback,useContext,useEffect,useMemo,useState,type PropsWithChildren } from 'react'
import type { ExerciseCatalog,VaultIndex,WorkoutDocument } from '../domain/models'
import { ExpoFileSystem,pickVaultUri } from '../vault/expoFs'
import { MarkdownVaultRepository } from '../vault/repository'

const KEY='@lift-that-sh/vault-uri',REST='@lift-that-sh/default-rest'
type State={index:VaultIndex|null;vaultUri:string|null;loading:boolean;error:string|null;rest:number;open:(uri?:string)=>Promise<void>;refresh:()=>Promise<void>;createWorkout:(workout:WorkoutDocument)=>Promise<void>;saveWorkout:(w:WorkoutDocument)=>Promise<void>;trashWorkout:(id:string)=>Promise<void>;saveCatalog:(c:ExerciseCatalog)=>Promise<void>;missingDefaults:()=>Promise<number>;importDefaults:()=>Promise<number>;setRest:(n:number)=>Promise<void>}
const C=createContext<State|null>(null)
export function VaultProvider({children}:PropsWithChildren){
 const repo=useMemo(()=>new MarkdownVaultRepository(new ExpoFileSystem()),[]),[index,setIndex]=useState<VaultIndex|null>(null),[vaultUri,setVaultUri]=useState<string|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null),[rest,setRestState]=useState(90)
 const run=useCallback(async<T,>(fn:()=>Promise<T>)=>{setError(null);try{return await fn()}catch(e){setError(e instanceof Error?e.message:String(e));throw e}},[])
 const sync=useCallback(async()=>setIndex(await repo.reindex()),[repo])
 const open=useCallback(async(uri?:string)=>{await run(async()=>{const target=uri??await pickVaultUri(),next=await repo.open(target);await AsyncStorage.setItem(KEY,target);setVaultUri(target);setIndex(next)})},[repo,run])
 const refresh=useCallback(async()=>setIndex(await run(()=>repo.reindex())),[repo,run])
 useEffect(()=>{Promise.all([AsyncStorage.getItem(KEY).then(uri=>uri?open(uri):undefined),AsyncStorage.getItem(REST).then(x=>x&&setRestState(Number(x)))]).catch(()=>{}).finally(()=>setLoading(false));const sub=AppState.addEventListener('change',x=>{if(x==='active'&&vaultUri)refresh().catch(()=>{})});return()=>sub.remove()},[open,refresh,vaultUri])
 const value:State={index,vaultUri,loading,error,rest,open,refresh,createWorkout:async w=>{await run(()=>repo.createWorkout(w));await sync()},saveWorkout:async w=>{await run(()=>repo.updateWorkout(w));await sync()},trashWorkout:async id=>{await run(()=>repo.trashWorkout(id));await sync()},saveCatalog:async c=>{await run(()=>repo.updateCatalog(c));await sync()},missingDefaults:()=>run(()=>repo.missingDefaultExercises()),importDefaults:async()=>{const n=await run(()=>repo.importMissingDefaultExercises());await sync();return n},setRest:async n=>{setRestState(n);await AsyncStorage.setItem(REST,String(n))}}
 return <C.Provider value={value}>{children}</C.Provider>
}
export function useVault(){const x=useContext(C);if(!x)throw new Error('VaultProvider ausente');return x}
