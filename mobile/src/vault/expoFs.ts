import { Directory, File, Paths } from 'expo-file-system'
import type { VaultFileSystem } from './types'

/**
 * Expo's SAF implementation deliberately rejects Directory.create() for
 * content:// URIs. Keep the picked directory as an object and walk its
 * children with createDirectory/createFile instead of manufacturing URIs.
 */
export class ExpoFileSystem implements VaultFileSystem {
 private rootUri:string|null=null
 setRoot(uri:string){this.rootUri=uri.replace(/\/+$/,'')}
 private parts(path:string){
  if(!this.rootUri)throw new Error('Raiz do vault não definida')
  if(path===this.rootUri)return []
  if(!path.startsWith(`${this.rootUri}/`))throw new Error('Caminho fora do vault')
  return path.slice(this.rootUri.length+1).split('/').filter(Boolean).map(decodeURIComponent)
 }
 private root(){if(!this.rootUri)throw new Error('Raiz do vault não definida');return new Directory(this.rootUri)}
 private child(dir:Directory,name:string){return dir.list().find(x=>x.name===name)}
 private directory(path:string,create=false){
  let current=this.root()
  for(const name of this.parts(path)){
   const found=this.child(current,name)
   if(found instanceof Directory)current=found
   else if(found)throw new Error(`Esperava uma pasta em ${name}`)
   else if(create)current=current.createDirectory(name)
   else throw new Error(`Pasta ausente: ${name}`)
  }
  return current
 }
 private file(path:string){
  const parts=this.parts(path),name=parts.pop()
  if(!name)throw new Error('Caminho de arquivo inválido')
  const dir=this.directory(`${this.rootUri}${parts.length?`/${parts.join('/')}`:''}`)
  const found=this.child(dir,name)
  if(found instanceof File)return found
  if(found)throw new Error(`Esperava um arquivo em ${name}`)
  return null
 }
 async read(path:string){const file=this.file(path);if(!file)throw new Error(`Arquivo ausente: ${path}`);return file.text()}
 async write(path:string,content:string){
  const parts=this.parts(path),name=parts.pop()
  if(!name)throw new Error('Caminho de arquivo inválido')
  const dir=this.directory(`${this.rootUri}${parts.length?`/${parts.join('/')}`:''}`,true)
  const found=this.child(dir,name)
  const file=found instanceof File?found:found?null:dir.createFile(name,'text/markdown')
  if(!file)throw new Error(`Não foi possível criar o arquivo ${name}`)
  file.write(content)
 }
 async list(path:string){return this.directory(path).list().map(x=>x.name)}
 async mkdir(path:string){this.directory(path,true)}
 async move(from:string,to:string){
  // Copy + delete works consistently for SAF, including a renamed destination.
  const source=this.file(from)
  if(!source)throw new Error(`Arquivo ausente: ${from}`)
  await this.write(to,await source.text())
  source.delete()
 }
 async stat(path:string){
  try{
   const parts=this.parts(path)
   if(!parts.length)return {exists:this.root().exists}
   const name=parts.pop()!,dir=this.directory(`${this.rootUri}${parts.length?`/${parts.join('/')}`:''}`)
   const found=this.child(dir,name)
   if(found instanceof File)return {exists:true,size:found.size,modifiedAt:found.modificationTime??undefined}
   return {exists:found instanceof Directory}
  }catch{return {exists:false}}
 }
}
export const fallbackVaultUri=()=>new Directory(Paths.document,'LiftThatSh').uri
export const pickVaultUri=async()=>{const directory=await Directory.pickDirectoryAsync();return directory.uri}
