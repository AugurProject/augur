import { fix } from "speedomatic";
import { BigNumber } from "../types";
import { BigNumber as BigNumberJS } from "bignumber.js";


export function convertDisplayAmountToOnChainAmount(displayAmount:BigNumber, displayRange:BigNumber, numTicks:BigNumber) {
  const tickSize = displayRange.div(numTicks);
  const fixed = fix(new BigNumberJS(displayAmount.toString()));
  return fixed.times(tickSize);
}
