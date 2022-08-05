import { Option, Some, None } from "../model/patterns/option"

type BinarySearchOptions<T> = {
  startIndex?: number,
  endIndex?: number,
  compareFcn?: (a: T, b: T) => number
}
const defaultCompareFcn = function fcn<T>(a: T, b: T){ return a == b ? 0 : (a > b ? 1 : -1) }

interface SearchResult {
  foundIndex: number;
}

/**
 * 
 * @param arr 
 * @param target 
 * @param opts Options for customising binary search to adapt to custom data types. For compareFcn, it is
 * a custom function accepting these values as returning value for its default implementation (ascending):
 * 0 - equal, negative - less than, positive - greater than
 * @return -1 on target not found, else a positive index including 0 on target found
 */
export default function binarySearch<T>(
  arr: T[],
  target: T,
  opts?: BinarySearchOptions<T>
): Option<SearchResult> {
  const cmp = opts?.compareFcn || defaultCompareFcn
  let [startIndex, endIndex, mid] = [
    opts?.startIndex || 0,
    opts?.endIndex || arr.length - 1,
    0
  ];

  while(endIndex > startIndex){
    mid = startIndex + Math.floor((endIndex - startIndex) / 2)
    // found
    if(cmp(arr[mid], target) === 0)
      return Some({
        foundIndex: mid
      })

    // mid elem is smaller than target -> shift to the right
    if(cmp(arr[mid], target) < 0){
      startIndex = mid + 1
      continue
    }

    // guaranteed that mid elem is bigger than target, hence shift to the left
    endIndex = mid
  }
  return None
}