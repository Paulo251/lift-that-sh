import AsyncStorage from '@react-native-async-storage/async-storage'
const safe=(uri:string)=>encodeURIComponent(uri)
const keys=(uri:string)=>({favorites:`@lift-that-sh/catalog/${safe(uri)}/favorites`,recent:`@lift-that-sh/catalog/${safe(uri)}/recent`})
async function read(key:string){try{return JSON.parse(await AsyncStorage.getItem(key)??'[]') as string[]}catch{return []}}
export async function loadCatalogPreferences(uri:string){const k=keys(uri);return {favorites:await read(k.favorites),recent:await read(k.recent)}}
export async function toggleFavorite(uri:string,id:string){const k=keys(uri),xs=await read(k.favorites),next=xs.includes(id)?xs.filter(x=>x!==id):[...xs,id];await AsyncStorage.setItem(k.favorites,JSON.stringify(next));return next}
export async function rememberRecent(uri:string,id:string){const k=keys(uri),xs=await read(k.recent),next=[id,...xs.filter(x=>x!==id)].slice(0,12);await AsyncStorage.setItem(k.recent,JSON.stringify(next));return next}
