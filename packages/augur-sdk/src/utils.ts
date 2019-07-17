import { BigNumber } from 'bignumber.js';
import { MALFORMED_OUTCOME } from './constants';
import { MarketTypeName } from './state/logs/types';

export const QUINTILLION = new BigNumber(10).pow(18);

export function numTicksToTickSize(
  numTicks: BigNumber,
  minPrice: BigNumber,
  maxPrice: BigNumber
): BigNumber {
  return maxPrice
    .minus(minPrice)
    .div(numTicks)
    .dividedBy(QUINTILLION);
}

export function numTicksToTickSizeWithDisplayPrices(
  numTicks: BigNumber,
  minPrice: BigNumber,
  maxPrice: BigNumber
): BigNumber {
  return maxPrice.minus(minPrice).div(numTicks);
}

export function convertOnChainAmountToDisplayAmount(
  onChainAmount: BigNumber,
  tickSize: BigNumber
) {
  return onChainAmount.dividedBy(tickSize).dividedBy(QUINTILLION);
}

export function convertDisplayAmountToOnChainAmount(
  displayAmount: BigNumber,
  tickSize: BigNumber
) {
  return displayAmount.multipliedBy(tickSize).multipliedBy(QUINTILLION);
}

export function convertOnChainPriceToDisplayPrice(
  onChainPrice: BigNumber,
  minPrice: BigNumber,
  tickSize: BigNumber
) {
  return onChainPrice
    .multipliedBy(tickSize)
    .plus(minPrice.dividedBy(QUINTILLION));
}

export function convertDisplayPriceToOnChainPrice(
  displayPrice: BigNumber,
  minPrice: BigNumber,
  tickSize: BigNumber
) {
  return displayPrice.minus(minPrice).dividedBy(tickSize);
}

export function convertPayoutNumeratorsToStrings(
  payoutNumeratorsBN: BigNumber[]
): string[] {
  const payoutNumerators: string[] = [];
  for (let i = 0; i < payoutNumeratorsBN.length; i++) {
    payoutNumerators[i] = payoutNumeratorsBN[i].toString(10);
  }
  return payoutNumerators;
}

export function compareObjects(key: string, order: string) {
  return function(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
}

export function logError(err: Error | string | object | null, result?: any): void {
  if (err != null) {
    console.error(err);
    if (result != null) console.log(result);
  }
}

export const createBigNumber = (value, ...args): BigNumber => {
  let newBigNumber;
  try {
    let useValue = value;
    if (typeof value === 'object' && Object.keys(value).indexOf('_hex') > -1) {
      useValue = value._hex;
    }
    newBigNumber = new BigNumber(`${useValue}`, ...args);
  } catch (e) {
    logError("Error instantiating WrappedBigNumber", e);
  }

  return newBigNumber;
};

export function calculatePayoutNumeratorsValue(
  maxPrice: string,
  minPrice: string,
  numTicks: string,
  marketType: string,
  payout: string[]
): string | null {
  const isScalar = marketType === MarketTypeName.Scalar;

  if (!payout) return null;
  if (payout.length === 0) return null;

  if (isScalar) {
    const longPayout = createBigNumber(payout[1], 10);
    const priceRange = createBigNumber(maxPrice, 10).minus(
      createBigNumber(minPrice, 10)
    );
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    return longPayout
      .times(priceRange)
      .dividedBy(createBigNumber(numTicks, 10))
      .plus(createBigNumber(minPrice, 10))
      .toString();
  }
  // test if stake payout is malformed
  if (
    payout.reduce((p, ticks) => (parseInt(ticks, 10) > 0 ? p + 1 : p), 0) > 1
  ) {
    return MALFORMED_OUTCOME;
  }

  return payout.findIndex((item: string) => parseInt(item, 10) > 0).toString();
}
