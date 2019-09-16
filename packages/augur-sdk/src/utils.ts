import { BigNumber } from 'bignumber.js';
import { MALFORMED_OUTCOME } from './constants';
import {
  MarketCreatedLog,
  MarketType,
  MarketTypeName,
  ScalarOutcomes,
  YesNoOutcomes
} from './state/logs/types';
import { toAscii } from './state/utils/utils';

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

export function tickSizeToNumTickWithDisplayPrices(
  tickSize: BigNumber,
  minPrice: BigNumber,
  maxPrice: BigNumber
): BigNumber {
  return maxPrice.minus(minPrice).dividedBy(tickSize);
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

export function convertDisplayValuetoAttoValue(
  displayValue: BigNumber
): BigNumber {
  return displayValue.multipliedBy(QUINTILLION);
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

export function logError(
  err: Error | string | object | null,
  result?: any
): void {
  if (err != null) {
    console.error(err);
    if (result != null) console.log(result);
  }
}

export function calculatePayoutNumeratorsValue(
  displayMaxPrice: string,
  displayMinPrice: string,
  numTicks: string,
  marketType: string,
  payout: string[]
): string | null {
  const isScalar = marketType === MarketTypeName.Scalar;

  if (!payout) return null;
  if (payout.length === 0) return null;


  if (isScalar) {
    if (!isWellFormedScalar(payout)) {
      return MALFORMED_OUTCOME;
    }

    const longPayout = new BigNumber(payout[1]);
    const priceRange = new BigNumber(displayMaxPrice, 10).minus(new BigNumber(displayMinPrice, 10));
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    return longPayout
      .times(priceRange)
      .dividedBy(new BigNumber(numTicks, 10))
      .plus(new BigNumber(displayMinPrice, 10))
      .toString();
  } else {
    if (!isWellFormedCategorical(payout)) { // or yes/no
      return MALFORMED_OUTCOME;
    }

    return payout.findIndex((item: string) => Number(item) > 0).toString();
  }
}

function isWellFormedCategorical(payout: string[]): boolean {
  // A categorical or Yes/No payout is well-formed if:
  // 1. Exactly one of its payouts is non-zero.
  return countNonZeroes(payout) === 1;
}

function isWellFormedScalar(payout: string[]): boolean {
  // A scalar payout is well-formed if:
  // 1. Its invalid payout is >0 and its short and long payouts are 0.
  // 2. Its invalid payout is 0 and at least one of its short or long payouts is non-0.
  if (Number(payout[0]) > 0) { // invalid payout
    return countNonZeroes(payout) === 0;
  } else { // some valid payout
    return countNonZeroes(payout.slice(1)) > 1;
  }
}

function countNonZeroes(numbers: string[]): number {
  let count = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (Number(numbers[i]) !== 0) {
      count++;
    }
  }
  return count;
}

export function calculatePayoutNumeratorsArray(
  displayMaxPrice: string,
  displayMinPrice: string,
  numTicks: string,
  numOutcomes: number,
  marketType: string,
  outcome: number,
  isInvalid: boolean = false,
): BigNumber[] {
  const payoutNumerators = Array(numOutcomes).fill(new BigNumber(0));
  const isScalar = marketType === MarketTypeName.Scalar;
  const numTicksBN = new BigNumber(numTicks);

  if (isInvalid) {
    payoutNumerators[0] = numTicksBN;
    return payoutNumerators;
  }

  if (isScalar) {
    const priceRange = new BigNumber(displayMaxPrice).minus(
      new BigNumber(displayMinPrice)
    );
    const reportNormalizedToZero = new BigNumber(outcome).minus(
      new BigNumber(displayMinPrice)
    );
    const longPayout = reportNormalizedToZero
      .times(numTicksBN)
      .dividedBy(priceRange);
    const shortPayout = numTicksBN.minus(longPayout);
    payoutNumerators[1] = shortPayout;
    payoutNumerators[2] = longPayout;
  } else {
    payoutNumerators[outcome] = numTicksBN;
  }
  return payoutNumerators;
}

export function getOutcomeDescriptionFromOutcome(
  outcome: number,
  market: MarketCreatedLog
): string {
  if (market.marketType === MarketType.YesNo) {
    if (outcome === 0) {
      return YesNoOutcomes.Invalid;
    } else if (outcome === 1) {
      return YesNoOutcomes.No;
    } else {
      return YesNoOutcomes.Yes;
    }
  } else if (market.marketType === MarketType.Scalar) {
    if (outcome === 0) {
      return ScalarOutcomes.Invalid;
    } else if (outcome === 1) {
      return new BigNumber(market.prices[0]).toString(10);
    } else {
      return new BigNumber(market.prices[1]).toString(10);
    }
  } else { // Categorical
    return toAscii(market.outcomes[new BigNumber(outcome).toNumber()]);
  }
}

export function marketTypeToName(marketType: MarketType): MarketTypeName {
  switch(marketType) {
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
