import BigNumber from "bignumber.js";
import { ZERO, ONE } from "../constants";

export function convertDivisorToRate(divisor: string, base?: number) {
  const d = new BigNumber(divisor, base || 10);
  if (d.isEqualTo(ZERO)) return "0";
  return ONE.dividedBy(d).toString();
}
