import { BigNumber } from "bignumber.js";

export const QUINTILLION = new BigNumber(10).pow(18);

export function numTicksToTickSize(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).div(numTicks).dividedBy(QUINTILLION);
}

export function numTicksToTickSizeWithDisplayPrices(numTicks: BigNumber, minPrice: BigNumber, maxPrice: BigNumber): BigNumber {
  return maxPrice.minus(minPrice).div(numTicks);
}

export function convertOnChainAmountToDisplayAmount(onChainAmount: BigNumber, tickSize: BigNumber) {
  return onChainAmount.dividedBy(tickSize).dividedBy(QUINTILLION);
}

export function convertDisplayAmountToOnChainAmount(displayAmount: BigNumber, tickSize: BigNumber) {
  return displayAmount.multipliedBy(tickSize).multipliedBy(QUINTILLION);
}

export function convertOnChainPriceToDisplayPrice(onChainPrice: BigNumber, minPrice: BigNumber, tickSize: BigNumber) {
  return onChainPrice.multipliedBy(tickSize).plus(minPrice.dividedBy(QUINTILLION));
}

export function convertDisplayPriceToOnChainPrice(displayPrice: BigNumber, minPrice: BigNumber, tickSize: BigNumber) {
  return displayPrice.minus(minPrice).dividedBy(tickSize);
}

export function compareObjects(key: string, order: string) {
  return function(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  }
}
