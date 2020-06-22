import {
  marketTypeToName,
  CommonOutcomes,
  MarketData,
  MarketType,
  MarketTypeName,
  YesNoOutcomes,
} from '@augurproject/sdk-lite';
export {
  marketTypeToName,
  marketNameToType,
  getTradeInterval
} from '@augurproject/sdk-lite';

import { convertAttoValueToDisplayValue } from "@augurproject/utils";
export {
  padHex,
  ZERO,
  ONE,
  QUINTILLION,
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

import { BigNumber } from 'bignumber.js';
import { OrderData, ZeroXOrders } from './state/db/ZeroXOrders';

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
  outcome: string | null;
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

export function getOutcomeValue(
  market: MarketData,
  payoutNumerators: string[]
): PayoutNumeratorValue {
  const maxPrice = new BigNumber(market['prices'][1]);
  const minPrice = new BigNumber(market['prices'][0]);
  const numTicks = new BigNumber(market['numTicks']);
  const marketType = marketTypeToName(market.marketType);
  return calculatePayoutNumeratorsValue(
    convertAttoValueToDisplayValue(maxPrice).toString(),
    convertAttoValueToDisplayValue(minPrice).toString(),
    numTicks.toString(),
    marketType,
    payoutNumerators
  );
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

export function calculatePayoutNumeratorsArray(
  displayMaxPrice: string,
  displayMinPrice: string,
  numTicks: string,
  numOutcomes: number,
  marketType: string,
  outcome: number,
  isInvalid = false
): BigNumber[] {
  // tslint:disable-next-line:ban
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

export function describeYesNoOutcome(outcome: number): string {
  switch (outcome) {
    case 0:
      return CommonOutcomes.Invalid;
    case 1:
      return YesNoOutcomes.No;
    case 2:
      return YesNoOutcomes.Yes;
    default:
      throw Error(`Invalid yes/no outcome "${outcome}"`);
  }
}

export function describeCategoricalOutcome(
  outcome: number,
  outcomes: string[]
): string {
  if (outcome === 0) return CommonOutcomes.Invalid;
  // Outcome 0 is invalid, so, subtract 1 to outcome to map to outcome description.
  return outcomes[outcome - 1];
}

export function describeScalarOutcome(
  outcome: number,
  prices: string[]
): string {
  if (outcome === 0) return CommonOutcomes.Invalid;
  const price = outcome === 1 ? prices[0] : prices[1];
  return String(new BigNumber(price));
}

export function describeUniverseOutcome(
  outcome: PayoutNumeratorValue,
  forkingMarket: MarketData
): string {
  if (outcome.malformed) {
    return CommonOutcomes.Malformed;
  } else if (outcome.invalid) {
    return CommonOutcomes.Invalid;
  }

  switch (forkingMarket.marketType) {
    case MarketType.YesNo:
      return describeYesNoOutcome(Number(outcome.outcome));
    case MarketType.Categorical:
      return describeCategoricalOutcome(
        Number(outcome.outcome),
        forkingMarket.outcomes
      );
    case MarketType.Scalar:
      return outcome.outcome;
    default:
      throw Error(`Invalid market type: ${forkingMarket.marketType}`);
  }
}

export function describeMarketOutcome(
  outcome: string | number,
  market: MarketData
): string {
  outcome = Number(outcome);

  if (outcome === 0) {
    return CommonOutcomes.Invalid;
  }

  switch (market.marketType) {
    case MarketType.YesNo:
      return describeYesNoOutcome(outcome);
    case MarketType.Categorical:
      return describeCategoricalOutcome(outcome, market.outcomes);
    case MarketType.Scalar:
      return describeScalarOutcome(outcome, market.prices);
    default:
      throw Error(`Invalid market type: ${market.marketType}`);
  }
}

export function parseZeroXMakerAssetData(makerAssetData: string): OrderData {
  const { orderData } = ZeroXOrders.parseAssetData(makerAssetData);
  return orderData;
}
