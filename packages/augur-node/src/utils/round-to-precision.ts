import { BigNumber } from "../types";
import { BigNumber as BigNumberJS } from "bignumber.js";

import { PRECISION } from "../constants";

export function roundToPrecision(value: string|number|BigNumber, minimumValue: string|number|BigNumber, round?: string, roundingMode?: BigNumber.RoundingMode): string {
  const bnValue = new BigNumberJS(value.toString());
  const bnMinimumValue = new BigNumberJS(minimumValue.toString());
  const bnAbsValue = bnValue.abs();
  if (bnAbsValue.lt(bnMinimumValue)) return "0";
  if (bnAbsValue.lt(PRECISION.limit)) return bnValue.toPrecision(PRECISION.decimals, roundingMode || BigNumberJS.ROUND_DOWN);
  if (round === "ceil") {
    return bnValue.multipliedBy(PRECISION.multiple).integerValue(BigNumberJS.ROUND_CEIL).div(PRECISION.multiple).toString();
  }
  return bnValue.multipliedBy(PRECISION.multiple).integerValue(BigNumberJS.ROUND_FLOOR).div(PRECISION.multiple).toString();
}
