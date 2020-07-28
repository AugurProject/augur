import { convertAttoValueToDisplayValue } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import {
  CommonOutcomes,
  MarketType,
  MarketTypeName,
  YesNoOutcomes,
} from './constants';
import { OrderBookType } from './liquidity';
import { Address, MarketData, NumOutcomes } from './logs';
import { ExtraInfoTemplate } from './templates/types';
import { countNonZeroes } from './utils';

export interface MarketListMetaCategories {
  [key: string]: {
    count: number;
    children: {
      [key: string]: {
        count: number;
        children: {
          [key: string]: {
            count: number;
          };
        };
      };
    };
  };
}

export interface MarketListMeta {
  categories: MarketListMetaCategories;
  filteredOutCount: number;
  marketCount: number;
}

export interface MarketList {
  markets: MarketInfo[];
  meta: MarketListMeta;
}

export interface MarketInfoOutcome {
  id: number;
  price: string | null;
  description: string;
  volume: string;
  isInvalid: boolean;
}

export interface SportsBookInfo {
  groupId: string;
  groupType: string;
  marketLine: string;
  estTimestamp?: string;
  header: string;
  title?: string;
  liquidityPool: string;
  placeholderOutcomes?: string[]
}

export interface MarketInfo {
  id: Address;
  universe: Address;
  marketType: string;
  numOutcomes: NumOutcomes;
  minPrice: string;
  maxPrice: string;
  cumulativeScale: string;
  author: string;
  designatedReporter: string;
  creationBlock: number;
  creationTime: number;
  volume: string;
  openInterest: string;
  reportingState: string;
  needsMigration: boolean;
  endTime: number;
  finalizationBlockNumber: number | null;
  finalizationTime: number | null;
  description: string;
  scalarDenomination: string | null;
  details: string | null;
  numTicks: string;
  tickSize: string;
  consensus: PayoutNumeratorValue;
  transactionHash: string;
  outcomes: MarketInfoOutcome[];
  marketCreatorFeeRate: string;
  settlementFee: string;
  reportingFeeRate: string;
  disputeInfo: DisputeInfo;
  categories: string[];
  noShowBondAmount: string;
  disavowed: boolean;
  template: ExtraInfoTemplate;
  isTemplate: boolean;
  mostLikelyInvalid: boolean;
  isWarpSync: boolean;
  passDefaultLiquiditySpread: boolean;
  sportsBook: SportsBookInfo;
}

export interface DisputeInfo {
  disputeWindow: {
    disputeRound: string;
    startTime: number | null;
    endTime: number | null;
  };
  disputePacingOn: boolean; // false for fast disputing, true for weekly dispute cadance
  stakeCompletedTotal: string; // total stake on market
  bondSizeOfNewStake: string; // is size of bond if outcome hasn't been staked on
  stakes: StakeDetails[];
}

export interface StakeDetails {
  outcome: string | null;
  bondSizeCurrent: string; // current dispute round bond size
  stakeCurrent: string; // will be pre-filled stake if tentative winning is true
  stakeRemaining: string; // bondSizeCurrent - stakeCurrent
  isInvalidOutcome: boolean;
  isMalformedOutcome: boolean;
  tentativeWinning: boolean;
  warpSyncHash: string;
}

export interface MarketPriceCandlestick {
  startTimestamp: number;
  start: string;
  end: string;
  min: string;
  max: string;
  volume: string; // volume in Dai for this Candlestick's time window, has same business definition as markets/outcomes.volume
  shareVolume: string; // shareVolume in number of shares for this Candlestick's time window, has same business definition as markets/outcomes.shareVolume
  tokenVolume: string; // TEMPORARY - this is a copy of Candlestick.shareVolume for the purposes of a backwards-compatible renaming of tokenVolume->shareVolume. The UI should change all references of Candlestick.tokenVolume to shareVolume and then this field can be removed.
}

export interface MarketPriceCandlesticks {
  [outcome: number]: MarketPriceCandlestick[];
}

export interface TimestampedPriceAmount {
  price: string;
  amount: string;
  timestamp: string;
}

export interface MarketPriceHistory {
  [outcome: string]: TimestampedPriceAmount[];
}

export interface MarketOrderBookOrder {
  price: string;
  shares: string;
  cumulativeShares: string;
  mySize: string;
}

export interface OutcomeOrderBook {
  [outcome: number]: {
    spread: string | null;
    bids: MarketOrderBookOrder[];
    asks: MarketOrderBookOrder[];
  };
  spread?: null; // set to null if order book is empty
}

export interface MarketOrderBook {
  marketId: string;
  orderBook: OutcomeOrderBook;
  expirationTime?: number; // expirationTimeSeconds of soonest order to expire in whole orderbook
}

export interface LiquidityOrderBookInfo {
  lowestSpread: number | undefined;
  orderBook: OrderBookType;
}

export interface CategoryStat {
  category: string;
  numberOfMarkets: number;
  volume: string;
  openInterest: string;
  categories: CategoryStats;
}

export interface CategoryStats {
  [category: string]: CategoryStat;
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

