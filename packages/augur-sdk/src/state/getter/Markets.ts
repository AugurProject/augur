import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { MarketFields } from '../db/MarketDB';
import { Getter } from './Router';
import { Order, Orders, OutcomeParam, Trading, OrderState } from './Trading';
import {
  Address,
  MarketCreatedLog,
  MarketData,
  MarketFinalizedLog,
  MarketType,
  MarketTypeName,
  MarketVolumeChangedLog,
  OrderEventType,
  OrderType,
  ParsedOrderEventLog,
  Timestamp,
} from '../logs/types';
import { NULL_ADDRESS,  sortOptions } from './types';

import {
  Augur,
  numTicksToTickSize,
  QUINTILLION,
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
} from '../../index';
import { calculatePayoutNumeratorsValue } from '../../utils';

import * as _ from 'lodash';
import * as t from 'io-ts';
import { ExtendedSearchOptions } from "flexsearch";

export enum MarketReportingState {
  PreReporting = 'PreReporting',
  DesignatedReporting = 'DesignatedReporting',
  OpenReporting = 'OpenReporting',
  CrowdsourcingDispute = 'CrowdsourcingDispute',
  AwaitingNextWindow = 'AwaitingNextWindow',
  Finalized = 'Finalized',
  Forking = 'Forking',
  AwaitingNoReportMigration = 'AwaitingNoReportMigration',
  AwaitingForkMigration = 'AwaitingForkMigration',
}

export enum GetMarketsSortBy {
  MarketOI = 'MarketOI',
  Liquidity = 'Liquidity', // @TODO: Make default sort
  Volume = 'Volume',
  Timestamp = 'Timestamp',
  EndTime = 'EndTime',
  LastTradedTimestamp = 'LastTradedTimestamp', // @TODO: Implement
  LastLiquidityDepleted = 'LastLiquidityDepleted', // @TODO: Implement
}

const getMarketsSortBy = t.keyof(GetMarketsSortBy);

const getMarketsParamsSpecific = t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    category: t.string,
    search: t.string,
    disputeWindow: t.string,
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    maxLiquiditySpread: t.string, // @TODO: Implement maxLiquiditySpread filter
    includeInvalidMarkets: t.boolean,
    categories: t.array(t.string),
    sortBy: getMarketsSortBy,
  }),
]);

export const SECONDS_IN_A_DAY = new BigNumber(86400, 10);

export interface MarketListMeta {
  // TODO
}

export interface MarketList {
  markets: MarketInfo[];
  meta: MarketListMeta;
  filteredOutCount: number;
  marketCount: number;
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
  category: string;
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
  numTicks: string;
  tickSize: string;
  consensus: string[] | null;
  outcomes: MarketInfoOutcome[];
  marketCreatorFeeRate: string;
  settlementFee: string;
  reportingFeeRate: string;
  disputeInfo: DisputeInfo;
}

export interface DisputeInfo {
  disputeWindow: {
    address: Address;
    startTime: Timestamp | null;
    endTime: Timestamp | null;
  };
  disputePacingOn: boolean;
  stakeCompletedTotal: string;
  bondSizeOfNewStake: string;
  stakes: StakeDetails[];
}

export interface StakeDetails {
  outcome: string;
  isInvalid: boolean;
  bondSizeCurrent: string;
  bondSizeTotal: string;
  stakeCurrent: string;
  stakeRemaining: string;
  stakeCompleted: string;
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

export interface OrderBook {
  price: string;
  shares: string;
  cumulativeShares: string;
  mySize: string;
}

export interface MarketOrderBook {
  marketId: string;
  orderBook: {
    [outcome: number]: {
      spread: string | null;
      bids: OrderBook[];
      asks: OrderBook[];
    };
  };
}

const outcomeIdType = t.union([OutcomeParam, t.number, t.null, t.undefined]);

export class Markets {
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
            startTimestamp: parseInt(startTimestamp, 10),
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
    if (!(await augur.contracts.augur.isKnownUniverse_(params.universe))) {
      throw new Error('Unknown universe: ' + params.universe);
    }
    const validLiquiditySpreads = ['10', '15', '20', '100'];
    if (params.maxLiquiditySpread && !validLiquiditySpreads.includes(params.maxLiquiditySpread)) {
      throw new Error('Invalid maxLiquiditySpread');
    }
    // Set sort defaults
    params.sortBy = typeof params.sortBy === 'undefined' ? getMarketsSortBy['MarketOI'] : params.sortBy;
    params.isSortDescending = typeof params.isSortDescending === 'undefined' ? true : params.isSortDescending;
    params.limit = typeof params.limit === 'undefined' ? 10 : params.limit;
    params.offset = typeof params.offset === 'undefined' ? 0 : params.offset;

    const request = {
      selector: {
        universe: params.universe,
        marketCreator: params.creator,
        designatedReporter: params.designatedReporter,
      },
    };
    if (params.maxEndTime) {
      request.selector = Object.assign(request.selector, {
        endTime: { $lt: `0x${params.maxEndTime.toString(16)}` },
      });
    }
    const marketCreatedLogs = await db.findMarketCreatedLogs(request);

    let marketCreatorFeeDivisor: BigNumber | undefined = undefined;
    if (params.maxFee) {
      const universe = augur.getUniverse(params.universe);
      const reportingFeeDivisor = new BigNumber(
        (await universe.getOrCacheReportingFeeDivisor_()).toNumber()
      );
      const reportingFee = new BigNumber(1).div(reportingFeeDivisor);
      const marketCreatorFee = new BigNumber(params.maxFee).minus(reportingFee);
      marketCreatorFeeDivisor = new BigNumber(10 ** 18).multipliedBy(
        marketCreatorFee
      );
    }

    const keyedMarketCreatedLogs: MarketCreatedLog[] = marketCreatedLogs.reduce(
      (previousValue: any, currentValue: MarketData) => {
        // Filter markets with fees > maxFee
        if (
          params.maxFee &&
          typeof marketCreatorFeeDivisor !== 'undefined' &&
          new BigNumber(currentValue.feeDivisor).gt(marketCreatorFeeDivisor)
        ) {
          return previousValue;
        }
        previousValue[currentValue.market] = currentValue;
        return previousValue;
      },
      []
    );

    let filteredKeyedMarketCreatedLogs = keyedMarketCreatedLogs;

    if (params.search || params.categories) {
      let keyedFullTextResults: any = {};
      let searchResults: any = [];
      if (params.search) {
        searchResults = await db.fullTextMarketSearch(params.search, null);
        keyedFullTextResults = _.keyBy(
          searchResults,
          (searchResult: MarketFields) =>  { return searchResult.market; }
        );
      }
      let keyedCategoryResults: any = {};
      if (params.categories) {
        const extendedSearchOptions: ExtendedSearchOptions[] = [];
        for (let i = 0; i < params.categories.length; i++) {
          extendedSearchOptions.push({
            field: ["category" + (i + 1)],
            query: params.categories[i],
            bool: "and",
          });
        }
        const categoryResults = await db.fullTextMarketSearch(null, extendedSearchOptions);
        keyedCategoryResults = _.keyBy(
          categoryResults,
          (searchResult: MarketFields) =>  { return searchResult.market; }
        );
        if (!_.isEmpty(keyedFullTextResults)) {
          // Reset keyedSearchResults to intersection of searchResults & categoryResults
          keyedFullTextResults = {};
          for (let i = 0; i < searchResults.length; i++) {
            if (categoryResults[searchResults[i].market]) {
              keyedFullTextResults[searchResults[i].market] = categoryResults[searchResults[i].market];
            }
          }
        } else {
          keyedFullTextResults = keyedCategoryResults;
        }
      }

      filteredKeyedMarketCreatedLogs = Object.values(
        keyedMarketCreatedLogs
      ).reduce((previousValue: any, currentValue: any) => {
        if (keyedFullTextResults[currentValue.market]) {
          previousValue[currentValue.market] = currentValue;
        }
        return previousValue;
      }, []);
    }

    let filteredMarketsDetails: any[] = [];
    for (const marketCreatedLogInfo of Object.values(filteredKeyedMarketCreatedLogs)) {
      let includeMarket = true;

      if (params.disputeWindow) {
        const market = await augur.contracts.marketFromAddress(
          marketCreatedLogInfo['market']
        );
        const disputeWindowAddress = await market.getDisputeWindow_();
        if (params.disputeWindow !== disputeWindowAddress) {
          includeMarket = false;
        }
      }

      marketCreatedLogInfo['timestamp'] = new BigNumber(marketCreatedLogInfo['timestamp']).toString();
      marketCreatedLogInfo['endTime'] = new BigNumber(marketCreatedLogInfo['endTime']).toString();

      let marketData: MarketData[];
      if (
        params.maxLiquiditySpread ||
        params.includeInvalidMarkets ||
        params.sortBy === getMarketsSortBy['Liquidity'] ||
        params.sortBy === getMarketsSortBy['MarketOI'] ||
        params.sortBy === getMarketsSortBy['Volume']
      ) {
        const request = {
          selector: {
            market: marketCreatedLogInfo['market'],
          },
        };
        marketData = await db.findMarkets(request);
        if (
          params.sortBy === getMarketsSortBy['Liquidity'] ||
          params.sortBy === getMarketsSortBy['MarketOI'] ||
          params.sortBy === getMarketsSortBy['Volume']
        ) {
          marketCreatedLogInfo[params.sortBy] = marketData[params.sortBy] ? new BigNumber(marketData[params.sortBy]).toString() : '0';
        }
        if (params.maxLiquiditySpread && marketData[0].liquidity[params.maxLiquiditySpread] === '0x00') {
          includeMarket = false;
        }
        if (
          typeof params.includeInvalidMarkets !== "undefined" &&
          params.includeInvalidMarkets === false &&
          marketData[0].invalidFilter === true
        ) {
          includeMarket = false;
        }
      }

      // Add any relevant sort information to marketCreatedLogInfo
      if (includeMarket) {
        filteredMarketsDetails.push(marketCreatedLogInfo);
      }
    }

    _.sortBy(filteredMarketsDetails, [(market: any) => market[params.sortBy]]);
    if (params.isSortDescending) {
      filteredMarketsDetails = filteredMarketsDetails.reverse();
    }
    filteredMarketsDetails = filteredMarketsDetails.slice(params.offset, params.offset + params.limit);

    const marketsInfo = await Markets.getMarketsInfo(
      augur,
      db,
      { marketIds: filteredMarketsDetails.map(marketInfo => marketInfo.market) }
    );
    // @TODO: Re-sort marketsInfo since Markets.getMarketsInfo doesn't always return the desired order
    const filteredMarketsDetailsOrder = {};
    for (let i = 0; i < filteredMarketsDetails.length; i++) {
      filteredMarketsDetailsOrder[filteredMarketsDetails[i].market] = i;
    }
    marketsInfo.sort(
      (a, b) => {
        return filteredMarketsDetailsOrder[a.id] - filteredMarketsDetailsOrder[b.id];
      }
    );

    // TODO Set `meta`, `filteredOutCount`, & `marketCount`
    return {
      markets: marketsInfo,
      meta: {},
      filteredOutCount: 0,
      marketCount: 0,
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
    ): OrderBook[] => {
      const sortedBuckets = bucketAndSortOrdersByPrice(unsortedOrders, isbids);
      const result: OrderBook[] = [];

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
    const marketCreatedLogs = await db.findMarketCreatedLogs({
      selector: { market: { $in: params.marketIds } },
    });

    return Promise.all(
      marketCreatedLogs.map(async marketCreatedLog => {
        const marketFinalizedLogs = (await db.findMarketFinalizedLogs({
          selector: { market: marketCreatedLog.market },
        })).reverse();
        const marketVolumeChangedLogs = (await db.findMarketVolumeChangedLogs({
          selector: { market: marketCreatedLog.market },
        })).reverse();
        const marketOIChangedLogs = (await db.findMarketOIChangedLogs({
          selector: { market: marketCreatedLog.market },
        })).reverse();

        const minPrice = new BigNumber(marketCreatedLog.prices[0]);
        const maxPrice = new BigNumber(marketCreatedLog.prices[1]);
        const numTicks = new BigNumber(marketCreatedLog.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const displayMinPrice = minPrice.dividedBy(QUINTILLION);
        const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);
        const cumulativeScale = displayMaxPrice.minus(displayMinPrice);

        const reportingState = await getMarketReportingState(
          db,
          marketCreatedLog,
          marketFinalizedLogs
        );
        const needsMigration =
          reportingState === MarketReportingState.AwaitingForkMigration
            ? true
            : false;

        let consensus = null;
        let finalizationBlockNumber = null;
        let finalizationTime = null;
        if (marketFinalizedLogs.length > 0) {
          consensus = [];
          for (
            let i = 0;
            i < marketFinalizedLogs[0].winningPayoutNumerators.length;
            i++
          ) {
            consensus[i] = new BigNumber(
              marketFinalizedLogs[0].winningPayoutNumerators[i]
            ).toString(10);
          }
          finalizationBlockNumber = marketFinalizedLogs[0].blockNumber;
          finalizationTime = new BigNumber(
            marketFinalizedLogs[0].timestamp
          ).toString(10);
        }

        let marketType: string;
        if (marketCreatedLog.marketType === MarketType.YesNo) {
          marketType = MarketTypeName.YesNo;
        } else if (marketCreatedLog.marketType === MarketType.Categorical) {
          marketType = MarketTypeName.Categorical;
        } else {
          marketType = MarketTypeName.Scalar;
        }

        let categories = [];
        let description = null;
        let details = null;
        let resolutionSource = null;
        let scalarDenomination = null;
        if (marketCreatedLog.extraInfo) {
          const extraInfo = JSON.parse(marketCreatedLog.extraInfo);
          categories = extraInfo.categories ? extraInfo.categories : [];
          description = extraInfo.description ? extraInfo.description : null;
          details = extraInfo.longDescription
            ? extraInfo.longDescription
            : null;
          resolutionSource = extraInfo.resolutionSource
            ? extraInfo.resolutionSource
            : null;
          scalarDenomination = extraInfo._scalarDenomination
            ? extraInfo._scalarDenomination
            : null;
        }
        const marketCreatorFeeRate = new BigNumber(
          marketCreatedLog.feeDivisor
        ).dividedBy(QUINTILLION);
        const reportingFeeRate = new BigNumber(
          await augur.contracts.universe.getOrCacheReportingFeeDivisor_()
        ).dividedBy(QUINTILLION);
        const settlementFee = marketCreatorFeeRate.plus(reportingFeeRate);

        return Object.assign({
          id: marketCreatedLog.market,
          universe: marketCreatedLog.universe,
          marketType,
          numOutcomes:
            marketCreatedLog.outcomes.length > 0
              ? marketCreatedLog.outcomes.length + 1
              : 3,
          minPrice: displayMinPrice.toString(10),
          maxPrice: displayMaxPrice.toString(10),
          cumulativeScale: cumulativeScale.toString(10),
          author: marketCreatedLog.marketCreator,
          creationBlock: marketCreatedLog.blockNumber,
          creationTime: marketCreatedLog.timestamp,
          categories,
          volume:
            marketVolumeChangedLogs.length > 0
              ? new BigNumber(marketVolumeChangedLogs[0].volume)
                  .dividedBy(QUINTILLION)
                  .toString()
              : '0',
          openInterest: marketOIChangedLogs.length > 0
          ? new BigNumber(marketOIChangedLogs[0].marketOI)
              .dividedBy(QUINTILLION)
              .toString()
          : '0',
          reportingState,
          needsMigration,
          endTime: new BigNumber(marketCreatedLog.endTime).toNumber(),
          finalizationBlockNumber,
          finalizationTime,
          description,
          scalarDenomination,
          marketCreatorFeeRate: marketCreatorFeeRate.toString(10),
          settlementFee: settlementFee.toString(10),
          reportingFeeRate: reportingFeeRate.toString(10),
          details,
          resolutionSource,
          numTicks: numTicks.toString(10),
          tickSize: tickSize.toString(10),
          consensus,
          outcomes: await getMarketOutcomes(
            db,
            marketCreatedLog,
            marketVolumeChangedLogs,
            scalarDenomination,
            tickSize,
            minPrice
          ),
          disputeInfo: await getMarketDisputeInfo(augur, db, marketCreatedLog.market),
        });
      })
    );
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

async function getMarketOutcomes(
  db: DB,
  marketCreatedLog: MarketCreatedLog,
  marketVolumeChangedLogs: MarketVolumeChangedLog[],
  scalarDenomination: string,
  tickSize: BigNumber,
  minPrice: BigNumber
): Promise<MarketInfoOutcome[]> {
  const outcomes: MarketInfoOutcome[] = [];
  const denomination = scalarDenomination ? scalarDenomination : 'N/A';
  if (marketCreatedLog.outcomes.length === 0) {
    const ordersFilled0 = (await db.findOrderFilledLogs({
      selector: { market: marketCreatedLog.market, outcome: '0x00' },
    })).reverse();
    const ordersFilled1 = (await db.findOrderFilledLogs({
      selector: { market: marketCreatedLog.market, outcome: '0x01' },
    })).reverse();
    const ordersFilled2 = (await db.findOrderFilledLogs({
      selector: { market: marketCreatedLog.market, outcome: '0x02' },
    })).reverse();
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
      volume:
        marketVolumeChangedLogs.length === 0 ||
        marketVolumeChangedLogs[0].outcomeVolumes[0] === '0x00'
          ? '0'
          : new BigNumber(
              marketVolumeChangedLogs[0].outcomeVolumes[0]
            ).toString(10),
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
      description: marketCreatedLog.marketType === 0 ? 'No' : denomination,
      volume:
        marketVolumeChangedLogs.length === 0 ||
        marketVolumeChangedLogs[0].outcomeVolumes[1] === '0x00'
          ? '0'
          : new BigNumber(
              marketVolumeChangedLogs[0].outcomeVolumes[1]
            ).toString(10),
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
      description: marketCreatedLog.marketType === 0 ? 'Yes' : denomination,
      volume:
        marketVolumeChangedLogs.length === 0 ||
        marketVolumeChangedLogs[0].outcomeVolumes[2] === '0x00'
          ? '0'
          : new BigNumber(
              marketVolumeChangedLogs[0].outcomeVolumes[2]
            ).toString(10),
    });
  } else {
    const ordersFilled = (await db.findOrderFilledLogs({
      selector: { market: marketCreatedLog.market, outcome: '0x00' },
    })).reverse();
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
      volume:
        marketVolumeChangedLogs.length === 0 ||
        marketVolumeChangedLogs[0].outcomeVolumes[0] === '0x00'
          ? '0'
          : new BigNumber(
              marketVolumeChangedLogs[0].outcomeVolumes[0]
            ).toString(10),
    });
    for (let i = 0; i < marketCreatedLog.outcomes.length; i++) {
      const ordersFilled = (await db.findOrderFilledLogs({
        selector: { market: marketCreatedLog.market, outcome: '0x0' + (i + 1) },
      })).reverse();
      const outcomeDescription = marketCreatedLog.outcomes[i].replace('0x', '');
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
        volume:
          marketVolumeChangedLogs.length === 0 ||
          marketVolumeChangedLogs[0].outcomeVolumes[i + 1] === '0x00'
            ? '0'
            : new BigNumber(
                marketVolumeChangedLogs[0].outcomeVolumes[i + 1]
              ).toString(10),
      });
    }
  }
  return outcomes;
}

export async function getMarketReportingState(
  db: DB,
  marketCreatedLog: MarketCreatedLog,
  marketFinalizedLogs: MarketFinalizedLog[]
): Promise<MarketReportingState> {
  const universeForkedLogs = (await db.findUniverseForkedLogs({
    selector: { universe: marketCreatedLog.universe },
  })).reverse();
  if (universeForkedLogs.length > 0) {
    if (universeForkedLogs[0].forkingMarket === marketCreatedLog.market) {
      return MarketReportingState.Forking;
    } else {
      if (marketFinalizedLogs.length > 0) {
        return  MarketReportingState.Finalized;
      } else {
        return  MarketReportingState.AwaitingForkMigration;
      }
    }
  } else {
    const timestampSetLogs = await db.findTimestampSetLogs({
      selector: { newTimestamp: { $type: 'string' } },
    });
    let currentTimestamp;
    if (timestampSetLogs.length > 0) {
      // Determine current timestamp since timestampSetLogs are not sorted by blockNumber
      currentTimestamp = new BigNumber(timestampSetLogs[0].newTimestamp);
      for (let i = 0; i < timestampSetLogs.length; i++) {
        if (
          new BigNumber(timestampSetLogs[i].newTimestamp).gt(currentTimestamp)
        ) {
          currentTimestamp = new BigNumber(timestampSetLogs[i].newTimestamp);
        }
      }
    } else {
      currentTimestamp = new BigNumber(Math.round(Date.now() / 1000));
    }
    if (new BigNumber(currentTimestamp).lt(marketCreatedLog.endTime)) {
      return  MarketReportingState.PreReporting;
    } else {
      const initialReportSubmittedLogs = (await db.findInitialReportSubmittedLogs(
        { selector: { market: marketCreatedLog.market } }
      )).reverse();
      const designatedReportingEndTime = new BigNumber(
        marketCreatedLog.endTime
      ).plus(SECONDS_IN_A_DAY);
      if (
        initialReportSubmittedLogs.length === 0 &&
        currentTimestamp.lte(designatedReportingEndTime)
      ) {
        return  MarketReportingState.DesignatedReporting;
      } else if (
        initialReportSubmittedLogs.length === 0 &&
        currentTimestamp.gt(designatedReportingEndTime)
      ) {
        return  MarketReportingState.OpenReporting;
      } else {
        if (marketFinalizedLogs.length > 0) {
          return  MarketReportingState.Finalized;
        } else {
          const disputeCrowdsourcerCompletedLogs = (await db.findDisputeCrowdsourcerCompletedLogs(
            { selector: { market: marketCreatedLog.market } }
          )).reverse();
          if (
            disputeCrowdsourcerCompletedLogs.length > 0 &&
            disputeCrowdsourcerCompletedLogs[0].pacingOn &&
            currentTimestamp.lt(
              disputeCrowdsourcerCompletedLogs[0].nextWindowStartTime
            )
          ) {
            return  MarketReportingState.AwaitingNextWindow;
          }
          return  MarketReportingState.CrowdsourcingDispute;
        }
      }
    }
  }
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

async function getMarketDisputeInfo(augur: Augur, db: DB, marketId: Address): Promise<DisputeInfo> {
  const stakeDetails = {};

  const market = augur.getMarket(marketId);
  const initialReportSubmittedLogs = await db.findInitialReportSubmittedLogs({
    selector: { market: marketId },
  });
  if (initialReportSubmittedLogs.length > 0) {
    const disputeCrowdsourcerCreatedLogs = await db.findDisputeCrowdsourcerCreatedLogs({
      selector: { market: marketId },
    });
    const stakeLogs: any[] = disputeCrowdsourcerCreatedLogs;
    if (initialReportSubmittedLogs[0]) stakeLogs.unshift(initialReportSubmittedLogs[0]);

    for (let i = 0; i < stakeLogs.length; i++) {
      let reportingParticipantId: Address;
      if (stakeLogs[i].hasOwnProperty("disputeCrowdsourcer")) {
        reportingParticipantId = stakeLogs[i].disputeCrowdsourcer;
      } else {
        reportingParticipantId = await market.getInitialReporter_();
      }
      const reportingParticipant = augur.contracts.getReportingParticipant(reportingParticipantId);
      const payoutDistributionHash = await reportingParticipant.getPayoutDistributionHash_();

      const disputeCrowdsourcerCompletedLogs = await db.findDisputeCrowdsourcerCompletedLogs({
        selector: { disputeCrowdsourcer: reportingParticipantId },
      });

      const stakeCurrent = await reportingParticipant.getStake_();
      const stakeRemaining = stakeLogs[i].hasOwnProperty("size") ? await reportingParticipant.getRemainingToFill_() : new BigNumber(0);
      const winningReportingParticipantId = await market.getWinningReportingParticipant_();
      const winningReportingParticipant = augur.contracts.getReportingParticipant(winningReportingParticipantId);
      if (!stakeDetails[payoutDistributionHash]) {
        // Create new StakeDetails for Payout Set
        const payout = await reportingParticipant.getPayoutNumerators_();
        let bondSizeCurrent: BigNumber;
        let stakeCompleted: BigNumber;
        if (stakeLogs[i].hasOwnProperty("amountStaked")) {
          bondSizeCurrent = new BigNumber(stakeLogs[i].amountStaked);
          stakeCompleted = bondSizeCurrent;
        } else {
          bondSizeCurrent = new BigNumber(stakeLogs[i].size);
          stakeCompleted = disputeCrowdsourcerCompletedLogs[0] ? new BigNumber(stakeLogs[i].size) : new BigNumber(0);
        }
        stakeDetails[payoutDistributionHash] =
          {
            payout,
            isInvalid: payout.length > 0 && payout[0].gt(0) ? true : false,
            bondSizeCurrent,
            bondSizeTotal: bondSizeCurrent,
            stakeCurrent,
            stakeRemaining,
            stakeCompleted,
            tentativeWinning: await winningReportingParticipant.getPayoutDistributionHash_() === payoutDistributionHash ? true : false,
          };
      } else {
        // Update existing StakeDetails for Payout Set
        if (disputeCrowdsourcerCompletedLogs[0]) {
          stakeDetails[payoutDistributionHash].stakeCompleted = new BigNumber(stakeDetails[payoutDistributionHash].stakeCompleted).plus(stakeLogs[i].size);
        } else {
          stakeDetails[payoutDistributionHash].bondSizeCurrent = new BigNumber(stakeLogs[i].size);
          stakeDetails[payoutDistributionHash].stakeCurrent = stakeCurrent;
        }
        if (new BigNumber(stakeLogs[i].size).gt(stakeDetails[payoutDistributionHash].bondSizeTotal)) {
          stakeDetails[payoutDistributionHash].bondSizeTotal = stakeDetails[payoutDistributionHash].bondSizeTotal.plus(stakeLogs[i].size);
        }
        if (stakeRemaining.gt(0)) {
          stakeDetails[payoutDistributionHash].stakeRemaining = new BigNumber(stakeRemaining);
        }
      }
    }
  }

  const disputeWindowAddress = await market.getDisputeWindow_();
  let disputeWindowStartTime: string | null = null;
  let disputeWindowEndTime: string | null = null;
  if (disputeWindowAddress !== NULL_ADDRESS) {
    const disputeWindow = augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
    disputeWindowStartTime = await disputeWindow.getStartTime_().toString();
    disputeWindowEndTime = await disputeWindow.getEndTime_().toString();
  }

  return {
    disputeWindow: {
      address: disputeWindowAddress,
      startTime: disputeWindowStartTime,
      endTime: disputeWindowEndTime,
    },
    disputePacingOn: await market.getDisputePacingOn_(),
    stakeCompletedTotal: (await market.getParticipantStake_()).toString(10),
    bondSizeOfNewStake: (await market.getParticipantStake_()).times(2).toString(10),
    stakes: await formatStakeDetails(db, marketId, Object.values(stakeDetails)),
  };
}

async function formatStakeDetails(db: DB, marketId: Address, stakeDetails: any[]): Promise<StakeDetails[]> {
  const formattedStakeDetails: StakeDetails[] = [];
  const marketCreatedLogs = await db.findMarketCreatedLogs({
    selector: { market: { $eq: marketId } },
  });

  const maxPrice = new BigNumber(marketCreatedLogs[0].prices[1]);
  const minPrice = new BigNumber(marketCreatedLogs[0].prices[0]);
  const numTicks = new BigNumber(marketCreatedLogs[0].numTicks);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  let marketType: string;
  if (marketCreatedLogs[0].marketType === MarketType.YesNo) {
    marketType = MarketTypeName.YesNo;
  } else if (marketCreatedLogs[0].marketType === MarketType.Categorical) {
    marketType = MarketTypeName.Categorical;
  } else {
    marketType = MarketTypeName.Scalar;
  }

  for (let i = 0; i < stakeDetails.length; i++) {
    formattedStakeDetails[i] = {
      outcome: calculatePayoutNumeratorsValue(
        convertOnChainPriceToDisplayPrice(maxPrice, minPrice, tickSize).toString(),
        convertOnChainPriceToDisplayPrice(minPrice, minPrice, tickSize).toString(),
        numTicks.toString(),
        marketType,
        stakeDetails[i].payout
      ),
      isInvalid: stakeDetails[i].isInvalid,
      bondSizeCurrent: stakeDetails[i].bondSizeCurrent.toString(10),
      bondSizeTotal: stakeDetails[i].bondSizeTotal.toString(10),
      stakeCurrent: stakeDetails[i].stakeCurrent.toString(10),
      stakeRemaining: stakeDetails[i].stakeRemaining.toString(10),
      stakeCompleted: stakeDetails[i].stakeCompleted.toString(10),
      tentativeWinning: stakeDetails[i].tentativeWinning,
    };
  }
  return formattedStakeDetails;
}
