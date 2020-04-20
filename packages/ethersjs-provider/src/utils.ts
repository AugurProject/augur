import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js';

export function isInstanceOfBigNumber(object: any): boolean {
    return isObject(object) && object instanceof BigNumber;
}

export function isInstanceOfEthersBigNumber(object: any): boolean {
    return isObject(object) && object instanceof ethers.utils.BigNumber;
}

export function isInstanceOfArray(object: any): boolean {
    return isObject(object) && object instanceof Array;
}

export function isObject(val: any) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

export class Counter extends Map {
  increment(key: string) {
    this.set(key, (this.get(key) || 0) + 1);
  }

  decrement(key: string) {
    this.set(key, (this.get(key) || 0) - 1);
  }

  // This will output in the form that drives `console.table`.
  toTabularData() {
    const output = [];
    for(const [method, count] of this) {
      output.push({
        method,
        count,
      });
    }

    return output;
  }
}
