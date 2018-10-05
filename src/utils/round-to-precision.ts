import { BigNumber } from "bignumber.js";
import { PRECISION } from "../constants";

export function roundToPrecision(value: string|number|BigNumber, minimumValue: string|number|BigNumber, round?: string, roundingMode?: BigNumber.RoundingMode): string {
  const bnValue: BigNumber = new BigNumber(value, 10);
  const bnMinimumValue: BigNumber = new BigNumber(minimumValue, 10);
  const bnAbsValue: BigNumber = bnValue.abs();
  if (bnAbsValue.lt(bnMinimumValue)) return "0";
  if (bnAbsValue.lt(PRECISION.limit)) return bnValue.toPrecision(PRECISION.decimals, roundingMode || BigNumber.ROUND_DOWN);
  if (round === "ceil") {
    return bnValue.times(PRECISION.multiple).integerValue(BigNumber.ROUND_CEIL).dividedBy(PRECISION.multiple).toString();
  }
  return bnValue.times(PRECISION.multiple).integerValue(BigNumber.ROUND_FLOOR).dividedBy(PRECISION.multiple).toString();
}
