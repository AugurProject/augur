import { BigNumber } from 'bignumber.js';

export type BinarySearchTest = (v: BigNumber) => Promise<BigNumber>;
export async function binarySearch(target: BigNumber, min: BigNumber, max: BigNumber, depth: number, test: BinarySearchTest) {
  let mid = new BigNumber(min.plus(max).idiv(2));
  for (let i = 0; i < depth; i++) {
    const s = await test(mid);

    if (s.gt(target)) {
      max = s;
    } else if (s.lt(target)) {
      min = s;
    } else {
      break;
    }

    mid = min.plus(max).idiv(2);
  }

  return mid;
}
