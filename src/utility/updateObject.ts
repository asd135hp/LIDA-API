export default function updateObject(oldObject: any, replacement: any){
  for(const key in oldObject){
    if(!(key in replacement)) continue

    if(typeof(oldObject[key]) === 'object' && typeof(replacement[key]) === 'object'){
      updateObject(oldObject[key], replacement[key])
      continue
    }

    oldObject[key] = replacement[key]
  }
  return oldObject
}