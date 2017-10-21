import BigNumber from "bignumber.js";

export function convertDivisorToRate(divisor: string, base?: number) {
  return new BigNumber(1, 10).dividedBy(new BigNumber(divisor, base || 10)).toFixed();
}
