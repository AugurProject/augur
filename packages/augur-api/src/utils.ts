import { BigNumber } from "bignumber.js";

const QUINTILLION = new BigNumber(10).pow(18);

export function numTicksToTickSize(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).div(numTicks).dividedBy(QUINTILLION);
}

export function convertOnChainAmountToDisplayAmount(onChainAmount: BigNumber, tickSize: BigNumber) {
  return onChainAmount.dividedBy(tickSize).dividedBy(QUINTILLION);
}

export function convertOnChainPriceToDisplayPrice(onChainPrice: BigNumber, minPrice: BigNumber, tickSize: BigNumber) {
  return onChainPrice.multipliedBy(tickSize).plus(minPrice);
}

export function convertDisplayAmountToOnChainAmount(displayAmount: BigNumber, tickSize: BigNumber) {
  return displayAmount.multipliedBy(tickSize).multipliedBy(QUINTILLION);
}
