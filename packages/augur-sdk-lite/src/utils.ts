import { BigNumber } from 'bignumber.js';
import { MarketTypeName, MarketType } from './constants';
export {
  padHex,
  numTicksToTickSize,
  numTicksToTickSizeWithDisplayPrices,
  tickSizeToNumTickWithDisplayPrices,
  convertOnChainAmountToDisplayAmount,
  convertDisplayAmountToOnChainAmount,
  convertOnChainPriceToDisplayPrice,
  convertDisplayPriceToOnChainPrice,
  convertPayoutNumeratorsToStrings,
  convertDisplayValuetoAttoValue,
  convertAttoValueToDisplayValue
} from "@augurproject/utils";

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

export function logError(
  err: Error | string | object | null,
  result?: any
): void {
  if (err != null) {
    console.error(err);
    if (result != null) console.log(result);
  }
}

export interface PayoutNumeratorValue {
  malformed?: boolean;
  invalid?: boolean;
  outcome: string|null;
}

export function calculatePayoutNumeratorsValue(
  displayMaxPrice: string,
  displayMinPrice: string,
  numTicks: string,
  marketType: string,
  payout: string[]
): PayoutNumeratorValue {
  if (marketType === MarketTypeName.Scalar) {
    if (!isWellFormedScalar(payout)) {
      return { outcome: null, malformed: true };
    }

    if (Number(payout[0]) > 0) {
      return { outcome: '0', invalid: true };
    }

    const longPayout = new BigNumber(payout[2]);
    const priceRange = new BigNumber(displayMaxPrice, 10).minus(
      new BigNumber(displayMinPrice, 10)
    );
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    const displayPrice = longPayout
      .times(priceRange)
      .dividedBy(new BigNumber(numTicks, 10))
      .plus(new BigNumber(displayMinPrice, 10));

    return { outcome: displayPrice.toString(10) };
  } else {
    switch (marketType) {
      case MarketTypeName.Categorical:
        if (!isWellFormedCategorical(payout)) {
          return { outcome: null, malformed: true };
        }
        break;
      case MarketTypeName.YesNo:
        if (!isWellFormedYesNo(payout)) {
          return { outcome: null, malformed: true };
        }
        break;
      default:
        return { outcome: null, malformed: true }; // bad market type
    }

    const outcome = payout.findIndex((item: string) => Number(item) > 0);
    if (outcome === 0) {
      return { outcome: '0', invalid: true };
    } else {
      return { outcome: String(outcome) };
    }
  }
}

export function isWellFormedYesNo(payout: string[]): boolean {
  // A Yes/No payout is well-formed if:
  // 1. There are exactly 3 payout values.
  // 2. Exactly one of its payouts is non-zero.

  if (payout.length !== 3) return false;
  return countNonZeroes(payout) === 1;
}

export function isWellFormedCategorical(payout: string[]): boolean {
  // A categorical is well-formed if:
  // 1. There are between 3 and 8 payout values (2-7 plus invalid)
  // 2. Exactly one of its payouts is non-zero.

  if (payout.length < 3 || payout.length > 8) return false;
  return countNonZeroes(payout) === 1;
}

export function isWellFormedScalar(payout: string[]): boolean {
  // A scalar payout is well-formed if:
  // 1. There are exactly 3 payout values.
  // 2. Its invalid payout is >0 and its short and long payouts are 0.
  // 3. Its invalid payout is 0 and at least one of its short or long payouts is non-0.

  if (payout.length !== 3) return false;

  const invalidPayout = Number(payout[0]);
  const validPayouts = payout.slice(1);
  if (invalidPayout > 0) {
    // invalid payout
    return countNonZeroes(validPayouts) === 0;
  } else {
    // some valid payout
    return countNonZeroes(validPayouts) >= 1;
  }
}

export function countNonZeroes(numbers: string[]): number {
  let count = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (Number(numbers[i]) !== 0) {
      count++;
    }
  }
  return count;
}

export function marketTypeToName(marketType: MarketType): MarketTypeName {
    switch (marketType) {
      case MarketType.YesNo:
        return MarketTypeName.YesNo;
      case MarketType.Categorical:
        return MarketTypeName.Categorical;
      case MarketType.Scalar:
        return MarketTypeName.Scalar;
      default:
        throw Error(`Invalid market type "${marketType}"`);
    }
}

export function marketNameToType(marketTypeName: MarketTypeName): MarketType {
  switch (marketTypeName) {
    case MarketTypeName.YesNo:
      return MarketType.YesNo;
    case MarketTypeName.Categorical:
      return MarketType.Categorical;
    case MarketTypeName.Scalar:
      return MarketType.Scalar;
    default:
      throw Error(`Invalid market type "${marketTypeName}"`);
  }
}

const TRADE_INTERVAL_VALUE = new BigNumber(10 ** 19);
const MIN_TRADE_INTERVAL = new BigNumber(10 ** 14);

export function getTradeInterval(
  minPrice: BigNumber,
  maxPrice: BigNumber,
  numTicks: BigNumber
): BigNumber {
  const displayRange = new BigNumber(maxPrice).minus(minPrice);
  let displayAmount = TRADE_INTERVAL_VALUE.multipliedBy(10 ** 18).div(
    displayRange
  );
  let displayInterval = MIN_TRADE_INTERVAL;
  while (displayInterval.lt(displayAmount)) {
    displayInterval = displayInterval.multipliedBy(10);
  }
  displayAmount = displayInterval;
  return displayInterval
    .multipliedBy(displayRange)
    .div(numTicks)
    .div(10 ** 18);
}

