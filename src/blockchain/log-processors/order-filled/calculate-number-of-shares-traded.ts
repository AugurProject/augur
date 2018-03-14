import BigNumber from "bignumber.js";
import { Int256 } from "../../../types";

export function calculateNumberOfSharesTraded(numShares: BigNumber, numTokens: BigNumber, price: BigNumber): BigNumber {
  return numShares.plus(numTokens).dividedBy(price);
}
