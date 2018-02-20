import BigNumber from "bignumber.js";
import { Int256 } from "./../../types";

export function calculateNumberOfSharesTraded(numShares: Int256, numTokens: Int256, price: Int256): Int256 {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(price, 10))).toFixed();
}
