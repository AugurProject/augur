import { BigNumber } from 'bignumber.js';
import { SearchResults } from 'flexsearch';
import { DB } from '../db/DB';
import { MarketFields } from '../db/SyncableFlexSearch';
import { Getter } from './Router';
import { Order, Orders, OutcomeParam, Trading, OrderState } from './Trading';
import {
  Address,
  DisputeDoc,
  MarketData,
  OrderEventType,
  OrderType,
  ParsedOrderEventLog
} from '../logs/types';
import { sortOptions } from './types';
import { MarketReportingState } from '../../constants';
import {
  Augur,
  numTicksToTickSize,
  QUINTILLION,
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
  marketTypeToName,
} from '../../index';
import { calculatePayoutNumeratorsValue, PayoutNumeratorValue } from '../../utils';
import { OrderBook } from '../../api/Liquidity';
import * as _ from 'lodash';
import * as t from 'io-ts';

export enum GetMarketsSortBy {
  marketOI = 'marketOI',
  liquidity = 'liquidity',
  volume = 'volume',
  timestamp = 'timestamp',
  endTime = 'endTime',
  lastTradedTimestamp = 'lastTradedTimestamp',
  disputeRound = 'disputeRound',
  totalRepStakedInMarket = 'totalRepStakedInMarket',
}

const MaxLiquiditySpreadValue  = {
  '100': null,
  '20': null,
  '15': null,
  '10': null,
  '0': null,
}

// Valid market liquidity spreads
export enum MaxLiquiditySpread {
  OneHundredPercent = '100', // all liquidity spreads
  TwentyPercent = '20',
  FifteenPercent = '15',
  TenPercent = '10',
  ZeroPercent = '0', // only markets with depleted liquidity
}

const getMarketsSortBy = t.keyof(GetMarketsSortBy);
export const GetMaxLiquiditySpread = t.keyof(MaxLiquiditySpreadValue);

const getMarketsParamsSpecific = t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    search: t.string,
    reportingStates: t.array(t.string),
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    maxLiquiditySpread: GetMaxLiquiditySpread,
    includeInvalidMarkets: t.boolean,
    categories: t.array(t.string),
    sortBy: getMarketsSortBy,
    userPortfolioAddress: t.string,
  }),
]);

export interface MarketListMetaCategories {
  [key: string]: {
    count: number;
    children: {
      [key: string]: {
        count: number;
        children: {
          [key: string]: {
            count: number;
          }
        }
      }
    }
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
}

export interface MarketInfo {
  id: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
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
  resolutionSource: string | null;
  backupSource: string | null;
  numTicks: string;
  tickSize: string;
  consensus: string[] | null;
  transactionHash: string;
  outcomes: MarketInfoOutcome[];
  marketCreatorFeeRate: string;
  settlementFee: string;
  reportingFeeRate: string;
  disputeInfo: DisputeInfo;
  categories: string[];
  noShowBondAmount: string;
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
  outcome: string|null;
  bondSizeCurrent: string; // current dispute round bond size
  stakeCurrent: string; // will be pre-filled stake if tentative winning is true
  stakeRemaining: string; // bondSizeCurrent - stakeCurrent
  isInvalidOutcome: boolean;
  isMalformedOutcome: boolean;
  tentativeWinning: boolean;
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
}

export interface LiquidityOrderBookInfo {
  lowestSpread: number | undefined;
  orderBook: OrderBook;
}

const outcomeIdType = t.union([OutcomeParam, t.number, t.null, t.undefined]);

export class Markets {
  static readonly MaxLiquiditySpread = MaxLiquiditySpread;

  static getMarketPriceCandlestickParams = t.type({
    marketId: t.string,
    outcome: outcomeIdType,
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  });
  static getMarketPriceHistoryParams = t.type({ marketId: t.string });
  static getMarketsParams = t.intersection([
    getMarketsParamsSpecific,
    sortOptions,
  ]);
  static getMarketsInfoParams = t.type({ marketIds: t.array(t.string) });
  static getMarketOrderBookParams = t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
    }),
  ]);

  static getCategoriesParams = t.type({ universe: t.string });

  @Getter('getMarketPriceCandlestickParams')
  static async getMarketPriceCandlesticks(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getMarketPriceCandlestickParams>
  ): Promise<MarketPriceCandlesticks> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({
      selector: { market: params.marketId },
    });
    if (marketCreatedLogs.length < 1) {
      throw new Error(
        `No marketId for getMarketPriceCandlesticks: ${params.marketId}`
      );
    }

    const orderFilledLogs = await db.findOrderFilledLogs({
      selector: { market: params.marketId, eventType: OrderEventType.Fill },
    });
    const filteredOrderFilledLogs = filterOrderFilledLogs(
      orderFilledLogs,
      params
    );
    const tradeRowsByOutcome = _.groupBy(
      filteredOrderFilledLogs,
      orderFilledLog => {
        return new BigNumber(orderFilledLog.outcome).toString(10);
      }
    );

    return _.mapValues(tradeRowsByOutcome, outcomeTradeRows => {
      const outcomeTradeRowsByPeriod = _.groupBy(outcomeTradeRows, tradeRow =>
        getPeriodStartTime(
          params.start || 0,
          new BigNumber(tradeRow.timestamp).toNumber(),
          params.period || 60
        )
      );
      return _.map(
        outcomeTradeRowsByPeriod,
        (
          trades: ParsedOrderEventLog[],
          startTimestamp
        ): MarketPriceCandlestick => {
          // TODO remove this partialCandlestick stuff and just return
          // a Candlestick after the temporary Candlestick.tokenVolume
          // is removed (see note on Candlestick.tokenVolume).

          const marketDoc = marketCreatedLogs[0];
          const minPrice = new BigNumber(marketDoc.prices[0]);
          const maxPrice = new BigNumber(marketDoc.prices[1]);
          const numTicks = new BigNumber(marketDoc.numTicks);
          const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
          const partialCandlestick = {
            startTimestamp: Number(startTimestamp),
            start: convertOnChainPriceToDisplayPrice(
              new BigNumber(
                _.minBy(trades, tradeLog => {
                  return new BigNumber(tradeLog.timestamp).toNumber();
                })!.price,
                16
              ),
              minPrice,
              tickSize
            ).toString(10),
            end: convertOnChainPriceToDisplayPrice(
              new BigNumber(
                _.maxBy(trades, tradeLog => {
                  return new BigNumber(tradeLog.timestamp).toNumber();
                })!.price,
                16
              ),
              minPrice,
              tickSize
            ).toString(10),
            min: convertOnChainPriceToDisplayPrice(
              new BigNumber(
                _.minBy(trades, tradeLog => {
                  return new BigNumber(tradeLog.price).toNumber();
                })!.price,
                16
              ),
              minPrice,
              tickSize
            ).toString(10),
            max: convertOnChainPriceToDisplayPrice(
              new BigNumber(
                _.maxBy(trades, tradeLog => {
                  return new BigNumber(tradeLog.price).toNumber();
                })!.price,
                16
              ),
              minPrice,
              tickSize
            ).toString(10),
            volume: _.reduce(
              trades,
              (totalVolume: BigNumber, tradeRow: ParsedOrderEventLog) => {
                const amount = convertOnChainAmountToDisplayAmount(
                  new BigNumber(tradeRow.amountFilled),
                  tickSize
                );

                const displayPrice = convertOnChainPriceToDisplayPrice(
                  new BigNumber(tradeRow.price),
                  minPrice,
                  tickSize
                );

                const price =
                  tradeRow.orderType === OrderType.Bid
                    ? maxPrice
                        .dividedBy(QUINTILLION)
                        .minus(displayPrice)
                    : displayPrice;

                return totalVolume.plus(amount.times(price));
              },
              new BigNumber(0)
            ).toString(10),
            shareVolume: convertOnChainAmountToDisplayAmount(
              _.reduce(
                trades,
                (totalShareVolume: BigNumber, tradeRow: ParsedOrderEventLog) =>
                  totalShareVolume.plus(tradeRow.amountFilled),
                new BigNumber(0)
              ),
              tickSize
            ).toString(10), // the business definition of shareVolume should be the same as used with markets/outcomes.shareVolume (which currently is just summation of trades.amount)
          };
          return {
            tokenVolume: partialCandlestick.shareVolume, // tokenVolume is temporary, see note on Candlestick.tokenVolume
            ...partialCandlestick,
          };
        }
      );
    });
  }

  @Getter('getMarketPriceHistoryParams')
  static async getMarketPriceHistory(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getMarketPriceHistoryParams>
  ): Promise<MarketPriceHistory> {
    const orderFilledLogs = await db.findOrderFilledLogs({
      selector: { market: params.marketId, eventType: OrderEventType.Fill },
    });
    orderFilledLogs.sort((a: ParsedOrderEventLog, b: ParsedOrderEventLog) => {
      return new BigNumber(a.timestamp).minus(b.timestamp).toNumber();
    });

    return orderFilledLogs.reduce(
      (
        previousValue: MarketPriceHistory,
        currentValue: ParsedOrderEventLog
      ): MarketPriceHistory => {
        const outcomeString = new BigNumber(currentValue.outcome).toString(10);
        if (!previousValue[outcomeString]) {
          previousValue[outcomeString] = [];
        }
        previousValue[outcomeString].push({
          price: new BigNumber(currentValue.price).toString(10),
          amount: new BigNumber(currentValue.amount).toString(10),
          timestamp: new BigNumber(currentValue.timestamp).toString(10),
        });
        return previousValue;
      },
      {}
    );
  }

  @Getter('getMarketsParams')
  static async getMarkets(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getMarketsParams>
  ): Promise<MarketList> {
    // Validate params & set defaults
    if (!(await augur.contracts.augur.isKnownUniverse_(params.universe))) {
      throw new Error('Unknown universe: ' + params.universe);
    }
    params.maxLiquiditySpread = typeof params.maxLiquiditySpread === 'undefined' ? MaxLiquiditySpread.OneHundredPercent : params.maxLiquiditySpread;
    params.includeInvalidMarkets = typeof params.includeInvalidMarkets === 'undefined' ? true : params.includeInvalidMarkets;
    params.search = typeof params.search === 'undefined' ? '' : params.search;
    params.categories = typeof params.categories === 'undefined' ? [] : params.categories;
    params.sortBy = typeof params.sortBy === 'undefined' ? GetMarketsSortBy.liquidity : params.sortBy;
    params.isSortDescending = typeof params.isSortDescending === 'undefined' ? true : params.isSortDescending;
    params.limit = typeof params.limit === 'undefined' ? 10 : params.limit;
    params.offset = typeof params.offset === 'undefined' ? 0 : params.offset;

    const universe = augur.getUniverse(params.universe);
    const reportingFeeDivisor = await universe.getOrCacheReportingFeeDivisor_();

    // Get Market docs for all markets with the specified filters
    const request = {
      selector: {
        universe: params.universe,
        marketCreator: params.creator,
        designatedReporter: params.designatedReporter,
      },
      sort: undefined,
      limit: undefined,
      offset: undefined
    };

    const marketsFTSResults = await getMarketsSearchResults(params.universe, params.search, params.categories);
    const numMarketDocs = marketsFTSResults.length;

    if (params.search || params.categories) {
      const marketIds = _.map(marketsFTSResults, "market");
      request.selector = Object.assign(request.selector, {
        market: { $in: marketIds },
      });
    }

    if (params.maxEndTime) {
      request.selector = Object.assign(request.selector, {
        endTime: { $lt: `0x${params.maxEndTime.toString(16)}` },
      });
    }

    // Filter out markets not related to the specified user
    if (params.userPortfolioAddress) {
      const profitLossLogs = await db.findProfitLossChangedLogs(params.userPortfolioAddress, { selector: { universe: params.universe }});
      const stakeLogs = await db.findDisputeCrowdsourcerContributionLogs({ selector: {
        universe: params.universe,
        reporter: params.userPortfolioAddress,
      }});
      const initialReportLogs = await db.findInitialReportSubmittedLogs({ selector: {
        universe: params.universe,
        reporter: params.userPortfolioAddress,
      }});
      const profitLossMarketIds = _.map(profitLossLogs, 'market');
      const stakeMarketIds = _.map(stakeLogs, 'market');
      const initialReportMarketIds = _.map(initialReportLogs, 'market');
      const userMarketIds = profitLossMarketIds.concat(stakeMarketIds, initialReportMarketIds);
      request.selector = Object.assign(request.selector, {
        $or: [
          { market: { $in: userMarketIds } },
          { marketCreator: params.userPortfolioAddress },
        ],
      });
    }

    if (params.reportingStates) {
      request.selector = Object.assign(request.selector, {
        reportingState: { $in: params.reportingStates },
      });
    }

    if (params.maxFee) {
      const reportingFee = new BigNumber(1).div(reportingFeeDivisor);
      const maxMarketCreatorFee = new BigNumber(params.maxFee).minus(reportingFee);
      const maxMarketCreatorFeeDivisor = new BigNumber(1).dividedBy(maxMarketCreatorFee);
      request.selector = Object.assign(request.selector, {
        feeDivisor: { $gte: maxMarketCreatorFeeDivisor.toNumber() },
      });
    }

    if (params.maxLiquiditySpread) {
      if (params.maxLiquiditySpread === MaxLiquiditySpread.ZeroPercent) {
        // TODO populate hasRecentlyDepletedLiquidity in the market derived DB. Currently will always produce false
        request.selector = Object.assign(request.selector, {
          hasRecentlyDepletedLiquidity: true,
        });
      } else if (params.maxLiquiditySpread !== MaxLiquiditySpread.OneHundredPercent) {
        request.selector = Object.assign(request.selector, {
          [`liquidity.${params.maxLiquiditySpread}`]: { $gt: "000000000000000000000000000000" },
        });
      }
    }

    if (params.includeInvalidMarkets !== true) {
      request.selector = Object.assign(request.selector, {
        invalidFilter: { $ne: true },
      });
    }

    if (params.sortBy) {
      // PouchDB requires that any sort param be specified in the selector and that the sort field be the first in the index field list
      let sortBy: string = params.sortBy;
      if (params.sortBy === "liquidity") {
        sortBy = `liquidity.${params.maxLiquiditySpread}`;
      }
      // liquidity 0 is actually a euphamism for no liquidity. No reason to sort in that case
      if (sortBy !== "liquidity.0") {
        if (request.selector[sortBy] === undefined) {
          request.selector = Object.assign(request.selector, {
            [sortBy]: { $gte: null },
          });
          request['use_index'] = sortBy;
        }
        request.sort = [{[sortBy]: params.isSortDescending ? "desc" : "asc"}];
      }
    }

    // Placed here intentionally so that we base the filter count off of the conditions above and then only the fee, liquidity, and invalid filters.
    let marketData = await db.findMarkets(request);
    const finalMarketIds = _.map(marketData, "market");
    let filteredMarketsFTSResults = _.filter(marketsFTSResults, (marketFields) => { return finalMarketIds[marketFields["market"]] });

    // TODO: We would normally add the pagination params to the request at this point because we want to get the full filtered row counts in the queries above. If we refactor those into another getter we can just initialize the request with these and apply them
    // request.limit = params.limit;
    // request.offset = params.offset;
    // NOTE: This data _could_ come in a standalone request which would let us do in query pagination. Should investigate if we need that as noted above in the TODO
    const filteredOutCount = numMarketDocs - marketData.length;
    const categories = getMarketsCategoriesMeta(filteredMarketsFTSResults);
    const meta = {
      filteredOutCount,
      categories,
      marketCount: marketData.length
    }

    marketData = marketData.slice(params.offset, params.offset + params.limit);

    // Get markets info to return
    const marketsInfo = await getMarketsInfo(db, marketData, reportingFeeDivisor);

    return {
      markets: marketsInfo,
      meta,
    };
  }

  @Getter('getMarketOrderBookParams')
  static async getMarketOrderBook(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getMarketOrderBookParams>
  ): Promise<MarketOrderBook> {
    const account = await augur.getAccount();
    const orders = await Trading.getOrders(augur, db, {
      ...params,
      orderState: OrderState.OPEN,
    });

    const processOrders = (
      unsortedOrders: {
        [orderId: string]: Order;
      },
      isbids = false
    ): MarketOrderBookOrder[] => {
      const sortedBuckets = bucketAndSortOrdersByPrice(unsortedOrders, isbids);
      const result: MarketOrderBookOrder[] = [];

      return Object.values(sortedBuckets).reduce((acc, bucket, index) => {
        const shares = bucket.reduce((v, order, index) => {
          return v.plus(order.amount);
        }, new BigNumber(0));

        const mySize = bucket
          .filter(order => order.owner === account)
          .reduce((v, order, index) => {
            return v.plus(order.amount);
          }, new BigNumber(0));

        const cumulativeShares =
          index > 0 ? shares.plus(acc[index - 1].cumulativeShares) : shares;

        acc.push({
          price: bucket[0].price,
          cumulativeShares: cumulativeShares.toString(),
          shares: shares.toString(),
          mySize: mySize.toString(),
        });
        return acc;
      }, result);
    };

    const processOutcome = (outcome: {
      [orderType: string]: { [orderId: string]: Order };
    }) => {
      const asks = processOrders(outcome[OrderType.Ask.toString()]);
      const bids = processOrders(outcome[OrderType.Bid.toString()], true);
      let spread = null;
      if (asks.length > 0 && bids.length > 0) {
        const bestAsk = asks.reduce(
          (p, a) => (new BigNumber(a.price).lt(p) ? new BigNumber(a.price) : p),
          new BigNumber(asks[0].price)
        );
        const bestBid = bids.reduce(
          (p, b) => (new BigNumber(b.price).gt(p) ? new BigNumber(b.price) : p),
          new BigNumber(bids[0].price)
        );
        spread = bestAsk.minus(bestBid).toString();
      }
      return {
        spread,
        asks,
        bids,
      };
    };

    const bucketAndSortOrdersByPrice = (unsortedOrders: {
      [orderId: string]: Order;
    },
    sortDescending = true
    ) => {
      if (!unsortedOrders) return [];
      const bucketsByPrice = _.groupBy<Order>(
        Object.values(unsortedOrders),
        order => order.price
      );
      const prickKeysSorted: string[] = sortDescending
        ? Object.keys(bucketsByPrice).sort((a, b) =>
            new BigNumber(b).minus(a).toNumber()
          )
        : Object.keys(bucketsByPrice).sort((a, b) =>
            new BigNumber(a).minus(b).toNumber()
          );

      return prickKeysSorted.map(k => bucketsByPrice[k]);
    };

    const processMarket = (orders: Orders) => {
      const outcomes = Object.values(orders)[0];
      if (!outcomes) {
        return {
          spread: null,
          asks: [],
          bids: [],
        };
      }
      return Object.keys(outcomes).reduce<MarketOrderBook['orderBook']>(
        (acc, outcome) => {
          acc[outcome] = processOutcome(outcomes[outcome]);
          return acc;
        },
        {}
      );
    };

    return {
      marketId: params.marketId,
      orderBook: processMarket(orders),
    };
  }

  @Getter('getMarketsInfoParams')
  static async getMarketsInfo(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getMarketsInfoParams>
  ): Promise<MarketInfo[]> {
    const markets = await db.findMarkets({ selector: { market: { $in: params.marketIds } }});
    const reportingFeeDivisor = await augur.contracts.universe.getOrCacheReportingFeeDivisor_();

    return await getMarketsInfo(db, markets, reportingFeeDivisor);
  }

  @Getter('getCategoriesParams')
  static async getCategories(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getCategoriesParams>
  ): Promise<string[]> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({
      selector: { universe: params.universe },
    });
    const allCategories: any = {};
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      if (marketCreatedLogs[i].extraInfo) {
        let categories: string[] = [];
        const extraInfo = JSON.parse(marketCreatedLogs[i].extraInfo);
        categories = extraInfo.categories ? extraInfo.categories : [];
        for (let j = 0; j < categories.length; j++) {
          if (!allCategories[categories[j]]) {
            allCategories[categories[j]] = null;
          }
        }
      }
    }
    return Object.keys(allCategories);
  }
}

function filterOrderFilledLogs(
  orderFilledLogs: ParsedOrderEventLog[],
  params: t.TypeOf<typeof Markets.getMarketPriceCandlestickParams>
): ParsedOrderEventLog[] {
  let filteredOrderFilledLogs = orderFilledLogs;
  if (params.outcome || params.start || params.end) {
    filteredOrderFilledLogs = orderFilledLogs.reduce(
      (
        previousValue: ParsedOrderEventLog[],
        currentValue: ParsedOrderEventLog
      ): ParsedOrderEventLog[] => {
        if (
          (params.outcome &&
            new BigNumber(currentValue.outcome).toString(10) !==
              params.outcome.toString(10)) ||
          (params.start &&
            new BigNumber(currentValue.timestamp).toNumber() <= params.start) ||
          (params.end &&
            new BigNumber(currentValue.timestamp).toNumber() >= params.end)
        ) {
          return previousValue;
        }
        previousValue.push(currentValue);
        return previousValue;
      },
      []
    );
  }
  return filteredOrderFilledLogs;
}

// TODO use getOutcomeDescriptionFromOutcome for Markets.getMarketOutcomes
function getMarketOutcomes(
  db: DB,
  marketData: MarketData,
  scalarDenomination: string,
  tickSize: BigNumber,
  minPrice: BigNumber,
  parsedOrderEventLogs: ParsedOrderEventLog[]
): MarketInfoOutcome[] {
  const outcomes: MarketInfoOutcome[] = [];
  const denomination = scalarDenomination ? scalarDenomination : 'N/A';
  if (marketData.outcomes.length === 0) {
    const ordersFilled0 = parsedOrderEventLogs.filter((parsedOrderEventLog) => parsedOrderEventLog.outcome === '0x00');
    const ordersFilled1 = parsedOrderEventLogs.filter((parsedOrderEventLog) => parsedOrderEventLog.outcome === '0x01');
    const ordersFilled2 = parsedOrderEventLogs.filter((parsedOrderEventLog) => parsedOrderEventLog.outcome === '0x02');
    outcomes.push({
      id: 0,
      price:
        ordersFilled0.length > 0
          ? convertOnChainPriceToDisplayPrice(
          new BigNumber(ordersFilled0[0].price),
          minPrice,
          tickSize
          ).toString(10)
          : null,
      description: 'Invalid',
      volume: marketData.outcomeVolumes ? new BigNumber(marketData.outcomeVolumes[0]).toString(10) : '0',
    });
    outcomes.push({
      id: 1,
      price:
        ordersFilled1.length > 0
          ? convertOnChainPriceToDisplayPrice(
          new BigNumber(ordersFilled1[0].price),
          minPrice,
          tickSize
          ).toString(10)
          : null,
      description: marketData.marketType === 0 ? 'No' : denomination,
      volume: marketData.outcomeVolumes ? new BigNumber(marketData.outcomeVolumes[1]).toString(10) : '0',
    });
    outcomes.push({
      id: 2,
      price:
        ordersFilled2.length > 0
          ? convertOnChainPriceToDisplayPrice(
          new BigNumber(ordersFilled2[0].price),
          minPrice,
          tickSize
          ).toString(10)
          : null,
      description: marketData.marketType === 0 ? 'Yes' : denomination,
      volume: marketData.outcomeVolumes ? new BigNumber(marketData.outcomeVolumes[2]).toString(10) : '0',
    });
  } else {
    const ordersFilled = parsedOrderEventLogs.filter((parsedOrderEventLog) => parsedOrderEventLog.outcome === '0x00');
    outcomes.push({
      id: 0,
      price:
        ordersFilled.length > 0
          ? convertOnChainPriceToDisplayPrice(
          new BigNumber(ordersFilled[0].price),
          minPrice,
          tickSize
          ).toString(10)
          : null,
      description: 'Invalid',
      volume: marketData.outcomeVolumes ? new BigNumber(marketData.outcomeVolumes[0]).toString(10) : '0',
    });
    for (let i = 0; i < marketData.outcomes.length; i++) {
      const ordersFilled = parsedOrderEventLogs.filter((parsedOrderEventLog) => parsedOrderEventLog.outcome === '0x0' + (i + 1) );
      const outcomeDescription = marketData.outcomes[i].replace('0x', '');
      outcomes.push({
        id: i + 1,
        price:
          ordersFilled.length > 0
            ? convertOnChainPriceToDisplayPrice(
            new BigNumber(ordersFilled[0].price),
            minPrice,
            tickSize
            ).toString(10)
            : null,
        description: Buffer.from(outcomeDescription, 'hex').toString(),
        volume: marketData.outcomeVolumes ? new BigNumber(marketData.outcomeVolumes[i + 1]).toString(10) : '0',
      });
    }
  }
  return outcomes;
}

function getPeriodStartTime(
  globalStarttime: number,
  periodStartime: number,
  period: number
): number {
  const secondsSinceGlobalStart = periodStartime - globalStarttime;
  return (
    secondsSinceGlobalStart -
    (secondsSinceGlobalStart % period) +
    globalStarttime
  );
}

async function getMarketsInfo(
  db: DB,
  markets: MarketData[],
  reportingFeeDivisor: BigNumber
): Promise<MarketInfo[]> {
  const marketIds = _.map(markets, "market");
  // TODO add marketIndex to this DB and specify here through use_index
  const orderFilledLogs = await db.findOrderFilledLogs({ selector: { market: { $in: marketIds } }});
  let disputeDocs = await db.findDisputeDocs({
    selector: { market: { $in: marketIds }},
    use_index: "marketIndex"
  });
  const disputeDocsByMarket = _.groupBy(disputeDocs, "market");
  const orderFilledLogsByMarket = _.groupBy(orderFilledLogs, "market");

  return _.map(markets, (marketData) => {
    const orderFilledLogs = orderFilledLogsByMarket[marketData.market] || [];

    const minPrice = new BigNumber(marketData.prices[0]);
    const maxPrice = new BigNumber(marketData.prices[1]);
    const numTicks = new BigNumber(marketData.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const displayMinPrice = minPrice.dividedBy(QUINTILLION);
    const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);
    const cumulativeScale = displayMaxPrice.minus(displayMinPrice);

    const reportingState = marketData.reportingState;
    const universeForking = false; // TODO get from initialization
    const needsMigration = reportingState !== MarketReportingState.Finalized && universeForking; // TODO: also check if the market is the forking market

    let consensus = null;
    let finalizationBlockNumber = null;
    let finalizationTime = null;
    if (marketData.winningPayoutNumerators) {
      consensus = [];
      for (let i = 0; i < marketData.winningPayoutNumerators.length; i++) {
        consensus[i] = new BigNumber(marketData.winningPayoutNumerators[i]).toString(10);
      }
      finalizationBlockNumber =  marketData.finalizationBlockNumber;
      finalizationTime = new BigNumber(marketData.finalizationTime).toString(10);
    }

    const marketType = marketTypeToName(marketData.marketType);

    let categories:string[] = [];
    let description = null;
    let details = null;
    let resolutionSource = null;
    let backupSource = null;
    let scalarDenomination = null;
    if (marketData.extraInfo) {
      const extraInfo = JSON.parse(marketData.extraInfo);
      categories = extraInfo.categories ? extraInfo.categories : [];
      description = extraInfo.description ? extraInfo.description : null;
      details = extraInfo.longDescription
        ? extraInfo.longDescription
        : null;
      resolutionSource = extraInfo.resolutionSource
        ? extraInfo.resolutionSource
        : null;
      backupSource = extraInfo.backupSource ? extraInfo.backupSource : null;
      scalarDenomination = extraInfo._scalarDenomination
        ? extraInfo._scalarDenomination
        : null;
    }
    const marketCreatorFeeRate = new BigNumber(
      marketData.feePerCashInAttoCash
    ).dividedBy(QUINTILLION);

    const reportingFeeRate = new BigNumber(
      reportingFeeDivisor
    ).dividedBy(QUINTILLION);
    const settlementFee = marketCreatorFeeRate.plus(reportingFeeRate);
    const noShowBondAmount = new BigNumber(marketData.noShowBond).toFixed();

    // TODO: Create a derived DB for market / outcome indexed data to get last price
    // Also use this DB to populate the "lastTradedTimestamp" field on the market derived DB to use for sorting
    const outcomes = getMarketOutcomes(
      db,
      marketData,
      scalarDenomination,
      tickSize,
      minPrice,
      orderFilledLogs
    );

    const totalRepStakedInMarket = new BigNumber(marketData.totalRepStakedInMarket || '0x0', 16);
    const disputeInfo =  {
      disputeWindow: {
        disputeRound: new BigNumber(marketData.disputeRound || '0x0', 16).toFixed(),
        startTime: marketData.nextWindowStartTime ? new BigNumber(marketData.nextWindowStartTime, 16).toNumber() : null,
        endTime: marketData.nextWindowEndTime ? new BigNumber(marketData.nextWindowEndTime, 16).toNumber() : null,
      },
      disputePacingOn: marketData.pacingOn ? marketData.pacingOn : false,
      stakeCompletedTotal: totalRepStakedInMarket.toFixed(),
      bondSizeOfNewStake: totalRepStakedInMarket.multipliedBy(2).toFixed(),
      stakes: formatStakeDetails(db, marketData, disputeDocsByMarket[marketData.market] || []),
    };

    return {
      id: marketData.market,
      universe: marketData.universe,
      marketType,
      numOutcomes:
      marketData.outcomes.length > 0
          ? marketData.outcomes.length + 1
          : 3,
      minPrice: displayMinPrice.toString(10),
      maxPrice: displayMaxPrice.toString(10),
      cumulativeScale: cumulativeScale.toString(10),
      author: marketData.marketCreator,
      designatedReporter: marketData.designatedReporter,
      creationBlock: marketData.blockNumber,
      creationTime: Number(marketData.timestamp),
      categories,
      volume: new BigNumber(marketData.volume || 0).dividedBy(QUINTILLION).toString(),
      openInterest: new BigNumber(marketData.marketOI || 0).dividedBy(QUINTILLION).toString(),
      reportingState,
      needsMigration,
      endTime: new BigNumber(marketData.endTime).toNumber(),
      finalizationBlockNumber,
      finalizationTime,
      description,
      scalarDenomination,
      marketCreatorFeeRate: marketCreatorFeeRate.toString(10),
      settlementFee: settlementFee.toString(10),
      reportingFeeRate: reportingFeeRate.toString(10),
      noShowBondAmount,
      details,
      resolutionSource,
      backupSource,
      numTicks: numTicks.toString(10),
      tickSize: tickSize.toString(10),
      consensus,
      transactionHash: marketData.transactionHash,
      outcomes,
      disputeInfo,
    };
  });
}

function formatStakeDetails(db: DB, market: MarketData, stakeDetails: DisputeDoc[]): StakeDetails[] {
  const formattedStakeDetails: StakeDetails[] = [];

  for (let i = 0; i < stakeDetails.length; i++) {
    const outcomeDetails = stakeDetails[i];
    const outcomeValue = getOutcomeValue(market, outcomeDetails.payoutNumerators);
    const bondSizeCurrent = new BigNumber(market.totalRepStakedInMarket, 16)
    .multipliedBy(2)
    .minus(new BigNumber(outcomeDetails.totalRepStakedInPayout || '0').multipliedBy(3)).toFixed();
if (outcomeDetails.disputeRound < market.disputeRound) {
      formattedStakeDetails[i] = {
        outcome: outcomeValue.outcome,
        isInvalidOutcome: outcomeValue.invalid || false,
        isMalformedOutcome: outcomeValue.malformed || false,
        bondSizeCurrent,
        stakeCurrent: '0',
        stakeRemaining: bondSizeCurrent,
        tentativeWinning: false,
      };
    } else {
      formattedStakeDetails[i] = {
        outcome: outcomeValue.outcome,
        isInvalidOutcome: outcomeValue.invalid || false,
        isMalformedOutcome: outcomeValue.malformed || false,
        bondSizeCurrent: new BigNumber(bondSizeCurrent).toFixed(),
        stakeCurrent: new BigNumber(outcomeDetails.stakeCurrent || '0x0', 16).toFixed(),
        stakeRemaining: new BigNumber(outcomeDetails.stakeRemaining || '0x0', 16).toFixed(),
        tentativeWinning: String(outcomeDetails.payoutNumerators) === String(market.tentativeWinningPayoutNumerators),
      };
    }
  }
  return formattedStakeDetails;
}

function getOutcomeValue(market: MarketData, payoutNumerators: string[]): PayoutNumeratorValue {
  const maxPrice = new BigNumber(market['prices'][1]);
  const minPrice = new BigNumber(market['prices'][0]);
  const numTicks = new BigNumber(market['numTicks']);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  const marketType = marketTypeToName(market.marketType);
  return calculatePayoutNumeratorsValue(
    convertOnChainPriceToDisplayPrice(maxPrice, minPrice, tickSize).toString(),
    convertOnChainPriceToDisplayPrice(minPrice, minPrice, tickSize).toString(),
    numTicks.toString(),
    marketType,
    payoutNumerators
  );
}

function getMarketsCategoriesMeta(
  marketsResults: any[],
): MarketListMetaCategories {
  const categories = {};
  for (let i = 0; i < marketsResults.length; i++) {
    const marketsResult = marketsResults[i];
    if (categories[marketsResult.category1]) {
      categories[marketsResult.category1]['count']++;
    } else {
      categories[marketsResult.category1] = {
        'count': 1,
        'children': {},
      };
    }
    if (categories[marketsResult.category1].children[marketsResult.category2]) {
      categories[marketsResult.category1].children[marketsResult.category2]['count']++;
    } else {
      categories[marketsResult.category1].children[marketsResult.category2] = {
        count: 1,
        children: {},
      };
    }
    if (categories[marketsResult.category1].children[marketsResult.category2].children[marketsResult.category3]) {
      categories[marketsResult.category1].children[marketsResult.category2].children[marketsResult.category3]['count']++;
    } else {
      categories[marketsResult.category1].children[marketsResult.category2].children[marketsResult.category3] = {
        count: 1,
      };
    }
  }
  return categories;
}

async function getMarketsSearchResults(
  universe: string,
  query: string,
  categories: string[]
): Promise<Array<SearchResults<MarketFields>>> {
  const whereObj = { universe };
  for (let i = 0; i < categories.length; i++) {
    whereObj['category' + (i + 1)] = categories[i];
  }
  if (query) {
    return Augur.syncableFlexSearch.search(query, { where: whereObj });
  }
  return Augur.syncableFlexSearch.where(whereObj);
}

/**
 * Sets the `hasRecentlyDepletedLiquidity` property for all markets in `marketsResults`.
 *
 * @param {DB} db Database object to use for setting `hasRecentlyDepletedLiquidity`
 * @param {Augur} augur Augur object to use for setting `hasRecentlyDepletedLiquidity`
 * @param {Array<Object>} marketsResults Array of market objects to add `hasRecentlyDepletedLiquidity` to
 */
async function setHasRecentlyDepletedLiquidity(db: DB, augur: Augur, marketsResults: any[]): Promise<Array<{}>>  {
  // Create market ID => marketsResults index mapping
  const keyedMarkets = {};
  for (let i = 0; i < marketsResults.length; i++) {
    keyedMarkets[marketsResults[i].market] = i;
  }
  const marketIds = Object.keys(keyedMarkets);

  const currentTimestamp = (await augur.getTimestamp()).toNumber();
  const lastUpdatedTimestamp = await db.findLiquidityLastUpdatedTimestamp();

  // Save liquidity info for each market to an object
  const marketsLiquidityDocs = await db.findRecentMarketsLiquidityDocs(currentTimestamp, marketIds);
  const marketsLiquidityInfo = {};
  for (let i = 0; i < marketsLiquidityDocs.length; i++) {
    const marketLiquidityDoc = marketsLiquidityDocs[i];
    if (!marketsLiquidityInfo[marketLiquidityDoc.market]) {
      marketsLiquidityInfo[marketLiquidityDoc.market] = {
        hasLiquidityInLastHour: false,
        hasLiquidityUnderFifteenPercentSpread: false,
      };
    }

    if (marketLiquidityDoc.timestamp === lastUpdatedTimestamp) {
      marketsLiquidityInfo[marketLiquidityDoc.market].hasLiquidityInLastHour = true;
    }
    if (marketLiquidityDoc.spread.toString() === MaxLiquiditySpread.FifteenPercent) {
      marketsLiquidityInfo[marketLiquidityDoc.market].hasLiquidityUnderFifteenPercentSpread = true;
    }

    if (!marketsLiquidityInfo[marketLiquidityDoc.market][marketLiquidityDoc.spread]) {
      marketsLiquidityInfo[marketLiquidityDoc.market][marketLiquidityDoc.spread] = {
        hourlyLiquiditySum: new BigNumber(marketLiquidityDoc.liquidity),
        hoursWithLiquidity: 1,
      };
    } else {
      marketsLiquidityInfo[marketLiquidityDoc.market][marketLiquidityDoc.spread].hourlyLiquiditySum.plus(marketLiquidityDoc.liquidity);
      marketsLiquidityInfo[marketLiquidityDoc.market][marketLiquidityDoc.spread].hoursWithLiquidity++;
    }
  }

  const liquidityDB = await db.getLiquidityDatabase();
  const marketsLiquidityParams = await liquidityDB.getMarketsLiquidityParams(db, augur);

  // Set `hasRecentlyDepletedLiquidity` property for each market
  for (let i = 0; i < marketsResults.length; i++) {
    const marketResult = marketsResults[i];

    // A market's liquidity is considered recently depleted if it had liquidity under
    // a 15% spread in the last 24 hours, but doesn't currently have liquidity
    if (
      marketsLiquidityInfo[marketResult.market] &&
      marketsLiquidityInfo[marketResult.market].hasLiquidityUnderFifteenPercentSpread &&
      !marketsLiquidityInfo[marketResult.market].hasLiquidityInLastHour &&
      !marketsLiquidityParams[marketResult.market]
    ) {
      marketResult.hasRecentlyDepletedLiquidity = true;
    } else {
      marketResult.hasRecentlyDepletedLiquidity = false;
    }
  }

  return marketsResults;
}

/**
 * Gets a MarketOrderBook for a market and converts it to an OrderBook object.
 *
 * @param {Augur} augur Augur object to use for getting MarketOrderBook
 * @param {DB} db DB to use for getting MarketOrderBook
 * @param {string} marketId Market address for which to get order book info
 */
export async function getLiquidityOrderBook(augur: Augur, db: DB, marketId: string): Promise<OrderBook> {
  // TODO Remove any below by making Markets.getMarketOrderBook return a consistent type when the order book is empty
  const marketOrderBook: MarketOrderBook = await Markets.getMarketOrderBook(augur, db, { marketId });
  const orderBook: OrderBook = {};

  // `marketOrderBook.orderBook.spread` will be set to null if order book is empty
  if (typeof marketOrderBook.orderBook.spread === 'undefined') {
    for (const outcome in marketOrderBook.orderBook) {
      if (marketOrderBook.orderBook[outcome]) {
        orderBook[outcome] = {
          bids: [],
          asks: [],
        };
        if (marketOrderBook.orderBook[outcome].bids) {
          for (let i = 0; i < marketOrderBook.orderBook[outcome].bids.length; i++) {
            orderBook[outcome].bids[i] = {
              amount: marketOrderBook.orderBook[outcome].bids[i].shares,
              price: marketOrderBook.orderBook[outcome].bids[i].price,
            };
          }
        }
        if (marketOrderBook.orderBook[outcome].asks) {
          for (let i = 0; i < marketOrderBook.orderBook[outcome].asks.length; i++) {
            orderBook[outcome].asks[i] = {
              amount: marketOrderBook.orderBook[outcome].asks[i].shares,
              price: marketOrderBook.orderBook[outcome].asks[i].price,
            };
          }
        }
      }
    }
  }

  return orderBook;
}
