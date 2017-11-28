import BigNumber from "bignumber.js";

export function calculateNumberOfSharesTraded(numShares: string, numTokens: string, price: string): string {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(price, 10))).toFixed();
}
