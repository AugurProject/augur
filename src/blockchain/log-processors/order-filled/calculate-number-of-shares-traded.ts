import BigNumber from "bignumber.js";

export function calculateNumberOfSharesTraded(numShares: BigNumber, numTokens: BigNumber, price: BigNumber): BigNumber {
  return numShares.plus(numTokens.dividedBy(price));
}
