import type { ExtraInfoTemplate } from './templates/types';
import { OrderBookType } from './liquidity';
import { Address, NumOutcomes } from './logs';
import { PayoutNumeratorValue } from './utils';

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
