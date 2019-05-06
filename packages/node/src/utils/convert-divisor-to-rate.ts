import { BigNumber } from "../types";

import { ONE, ZERO } from "../constants";

export function convertDivisorToRate(divisor: string) {
  const d = new BigNumber(divisor);
  if (d.eq(ZERO)) return "0";
  return ONE.div(d).toString();
}
