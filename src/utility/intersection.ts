// O(m*n) where m is array size of each array - variable and n is the number of arrays passed as an argument
export function intersectArrays(...arrays: any[][]){
  let hashMap1 = new Set<any>()
  let hashMap2 = new Set<any>()
  arrays[0].map(val => hashMap1.add(val))
  arrays.map((arr, index) => {
    if(index == 0 || !hashMap1.size) return
    arr.map(val => {
      if(hashMap1.has(val)) hashMap2.add(val)
    })
    hashMap1 = hashMap2
    hashMap2 = new Set<any>()
  })
  return Array.from(hashMap1)
}