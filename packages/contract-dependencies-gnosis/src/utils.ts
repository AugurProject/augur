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