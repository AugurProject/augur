import { BigNumber } from 'bignumber.js';

export type Direction = -1 | 0 | 1;
export type BinarySearchTest = (v: BigNumber) => Promise<Direction>;
export async function binarySearch(min: BigNumber, max: BigNumber, depth: number, test: BinarySearchTest) {
  let mid = new BigNumber(min.plus(max).idiv(2));
  for (let i = 0; i < depth; i++) {
    const direction: Direction = await test(mid);
    switch(direction) {
      case -1:
        max = mid;
        break;
      case 1:
        min = mid;
        break;
      default:
        return mid;
    }

    mid = min.plus(max).idiv(2);
  }

  throw Error('Binary search failed.');
}

export function bnDirection(target: BigNumber, actual: BigNumber): Direction {
  const diff = target.minus(actual);
  if (diff.gt(0)) {
    return 1;
  } else if (diff.lt(0)) {
    return -1;
  } else {
    return 0;
  }
}
