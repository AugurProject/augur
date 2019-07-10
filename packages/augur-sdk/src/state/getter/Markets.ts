import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import {
  MarketType,
  MarketCreatedLog,
  MarketFinalizedLog,
  MarketVolumeChangedLog,
  OrderEventType,
  OrderType,
  ParsedOrderEventLog,
} from '../logs/types';
import { SortLimit } from './types';
import {
  Augur,
  numTicksToTickSize,
  QUINTILLION,
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
} from '../../index';
import { toAscii } from '../utils/utils';

import * as _ from 'lodash';
import * as t from 'io-ts';
import { Order, Orders, OutcomeParam, Trading, OrderState } from './Trading';

const getMarketsParamsSpecific = t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    category: t.string,
    search: t.string,
    reportingState: t.union([t.string, t.array(t.string)]),
    disputeWindow: t.string,
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    hasOrders: t.boolean,
  }),
]);

export const SECONDS_IN_A_DAY = new BigNumber(86400, 10);

export interface MarketInfoOutcome {
  id: number;
  price: string | null;
  description: string;
  volume: string;
}

export enum MarketInfoReportingState {
  PRE_REPORTING = 'PRE_REPORTING',
  DESIGNATED_REPORTING = 'DESIGNATED_REPORTING',
  OPEN_REPORTING = 'OPEN_REPORTING',
  CROWDSOURCING_DISPUTE = 'CROWDSOURCING_DISPUTE',
  AWAITING_NEXT_WINDOW = 'AWAITING_NEXT_WINDOW',
  FINALIZED = 'FINALIZED',
  FORKING = 'FORKING',
  AWAITING_NO_REPORT_MIGRATION = 'AWAITING_NO_REPORT_MIGRATION',
  AWAITING_FORK_MIGRATION = 'AWAITING_FORK_MIGRATION',
}

export interface MarketInfo {
  id: string;
  universe: string;
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
  reportingState: MarketInfoReportingState;
  needsMigration: boolean;
  endTime: number;
  finalizationBlockNumber: number | null;
  finalizationTime: number | null;
  description: string;
  scalarDenomination: string | null;
  details: string | null;
  resolutionSource: string | null;
  numTicks: string;
  tags: string[];
  tickSize: string;
  consensus: string[] | null;
  outcomes: MarketInfoOutcome[];
  marketCreatorFeeRate: string;
  settlementFee: string;
  reportingFeeRate: string;
  disputeInfo: any;
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
    SortLimit,
  ]);
  static getMarketsInfoParams = t.type({ marketIds: t.array(t.string) });
  static getMarketOrderBookParams = t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
    }),
  ]);

  static getTopicsParams = t.type({ universe: t.string });

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
  ): Promise<string[]> {
    if (!(await augur.contracts.augur.isKnownUniverse_(params.universe))) {
      throw new Error('Unknown universe: ' + params.universe);
    }

    const request = {
      selector: {
        universe: params.universe,
        marketCreator: params.creator,
        designatedReporter: params.designatedReporter,
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
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

    const keyedMarketCreatedLogs = marketCreatedLogs.reduce(
      (previousValue: any, currentValue: MarketCreatedLog) => {
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
    if (params.search) {
      const fullTextSearchResults = await db.fullTextSearch(
        'MarketCreated',
        params.search
      );

      const keyedFullTextMarketIds: any = fullTextSearchResults.reduce(
        (previousValue: any, fullTextSearchResult: any) => {
          previousValue[fullTextSearchResult.market] = fullTextSearchResult;
          return previousValue;
        },
        []
      );

      filteredKeyedMarketCreatedLogs = Object.entries(
        keyedMarketCreatedLogs
      ).reduce((previousValue: any, currentValue: any) => {
        if (keyedFullTextMarketIds[currentValue[0]]) {
          previousValue[currentValue[0]] = currentValue[1];
        }
        return previousValue;
      }, []);
    }

    await Promise.all(
      Object.entries(filteredKeyedMarketCreatedLogs).map(
        async (marketCreatedLogInfo: any) => {
          let includeMarket = true;

          if (params.disputeWindow) {
            const market = await augur.contracts.marketFromAddress(
              marketCreatedLogInfo[0]
            );
            const disputeWindowAddress = await market.getDisputeWindow_();
            if (params.disputeWindow !== disputeWindowAddress) {
              includeMarket = false;
            }
          }

          // TODO: when currentOrders event table exists just check that
          if (params.hasOrders) {
            const orderCreatedLogs = await db.findOrderCreatedLogs({
              selector: { market: marketCreatedLogInfo[0] },
            });
            const orderCanceledLogs = await db.findOrderCanceledLogs({
              selector: { market: marketCreatedLogInfo[0] },
            });
            const orderFilledLogs = await db.findOrderFilledLogs({
              selector: { market: marketCreatedLogInfo[0], amount: '0x00' },
            });
            if (
              orderCreatedLogs.length - orderCanceledLogs.length ===
              orderFilledLogs.length
            ) {
              includeMarket = false;
            }
          }

          if (params.reportingState) {
            const reportingStates = Array.isArray(params.reportingState)
              ? params.reportingState
              : [params.reportingState];
            const marketFinalizedLogs = await db.findMarketFinalizedLogs({
              selector: { market: marketCreatedLogInfo[0] },
            });
            const reportingState = await getMarketReportingState(
              db,
              marketCreatedLogInfo[1],
              marketFinalizedLogs
            );
            if (!reportingStates.includes(reportingState)) {
              includeMarket = false;
            }
          }

          if (includeMarket) {
            return marketCreatedLogInfo[0];
          }
          return null;
        }
      )
    ).then((marketIds: any) => {
      marketIds = marketIds.reduce(
        (previousValue: any, currentValue: string | null) => {
          if (currentValue) {
            previousValue[currentValue] = currentValue;
          }
          return previousValue;
        },
        []
      );

      filteredKeyedMarketCreatedLogs = Object.entries(
        filteredKeyedMarketCreatedLogs
      ).reduce((previousValue: any, currentValue: any) => {
        if (marketIds[currentValue[1].market]) {
          previousValue[currentValue[0]] = currentValue[1];
        }
        return previousValue;
      }, []);
    });

    return Object.keys(filteredKeyedMarketCreatedLogs);
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
      isbids: boolean = false
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

    const bucketAndSortOrdersByPrice = (
      unsortedOrders: {
        [orderId: string]: Order;
      },
      sortDescending: boolean = true
    ) => {
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
          reportingState === MarketInfoReportingState.AWAITING_FORK_MIGRATION
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
          marketType = 'yesNo';
        } else if (marketCreatedLog.marketType === MarketType.Categorical) {
          marketType = 'categorical';
        } else {
          marketType = 'scalar';
        }

        let description = null;
        let details = null;
        let resolutionSource = null;
        let scalarDenomination = null;
        let tags = [];
        if (marketCreatedLog.extraInfo) {
          const extraInfo = JSON.parse(marketCreatedLog.extraInfo);
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
          tags = extraInfo.tags ? extraInfo.tags : [];
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
          category: Buffer.from(
            marketCreatedLog.topic.replace('0x', ''),
            'hex'
          ).toString(),
          volume:
            marketVolumeChangedLogs.length > 0
              ? new BigNumber(marketVolumeChangedLogs[0].volume)
                  .dividedBy(QUINTILLION)
                  .toString()
              : '0',
          openInterest: await getMarketOpenInterest(db, marketCreatedLog),
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
          tags,
          outcomes: await getMarketOutcomes(
            db,
            marketCreatedLog,
            marketVolumeChangedLogs,
            scalarDenomination,
            tickSize,
            minPrice
          ),
        });
      })
    );
  }

  @Getter('getTopicsParams')
  static async getTopics(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Markets.getTopicsParams>
  ): Promise<string[]> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({
      selector: { universe: params.universe },
    });
    const topics: any = {};
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      if (!topics[toAscii(marketCreatedLogs[i].topic)]) {
        topics[toAscii(marketCreatedLogs[i].topic)] = null;
      }
    }
    return Object.keys(topics);
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

async function getMarketOpenInterest(
  db: DB,
  marketCreatedLog: MarketCreatedLog
): Promise<string> {
  const completeSetsPurchasedLogs = (await db.findCompleteSetsPurchasedLogs({
    selector: { market: marketCreatedLog.market },
  })).reverse();
  const completeSetsSoldLogs = (await db.findCompleteSetsSoldLogs({
    selector: { market: marketCreatedLog.market },
  })).reverse();
  if (completeSetsPurchasedLogs.length > 0 && completeSetsSoldLogs.length > 0) {
    if (
      completeSetsPurchasedLogs[0].blockNumber >
      completeSetsSoldLogs[0].blockNumber
    ) {
      return new BigNumber(completeSetsPurchasedLogs[0].marketOI)
        .dividedBy(QUINTILLION)
        .toString();
    } else if (
      completeSetsSoldLogs[0].blockNumber >
      completeSetsPurchasedLogs[0].blockNumber
    ) {
      return new BigNumber(completeSetsSoldLogs[0].marketOI)
        .dividedBy(QUINTILLION)
        .toString();
    } else if (
      completeSetsPurchasedLogs[0].transactionIndex >
      completeSetsSoldLogs[0].transactionIndex
    ) {
      return new BigNumber(completeSetsPurchasedLogs[0].marketOI)
        .dividedBy(QUINTILLION)
        .toString();
    } else {
      return new BigNumber(completeSetsSoldLogs[0].marketOI)
        .dividedBy(QUINTILLION)
        .toString();
    }
  } else if (completeSetsPurchasedLogs.length > 0) {
    return new BigNumber(completeSetsPurchasedLogs[0].marketOI)
      .dividedBy(QUINTILLION)
      .toString();
  } else if (completeSetsSoldLogs.length > 0) {
    return new BigNumber(completeSetsSoldLogs[0].marketOI)
      .dividedBy(QUINTILLION)
      .toString();
  }
  return '0';
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
): Promise<MarketInfoReportingState> {
  const universeForkedLogs = (await db.findUniverseForkedLogs({
    selector: { universe: marketCreatedLog.universe },
  })).reverse();
  if (universeForkedLogs.length > 0) {
    if (universeForkedLogs[0].forkingMarket === marketCreatedLog.market) {
      return MarketInfoReportingState.FORKING;
    } else {
      if (marketFinalizedLogs.length > 0) {
        return MarketInfoReportingState.FINALIZED;
      } else {
        return MarketInfoReportingState.AWAITING_FORK_MIGRATION;
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
      return MarketInfoReportingState.PRE_REPORTING;
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
        return MarketInfoReportingState.DESIGNATED_REPORTING;
      } else if (
        initialReportSubmittedLogs.length === 0 &&
        currentTimestamp.gt(designatedReportingEndTime)
      ) {
        return MarketInfoReportingState.OPEN_REPORTING;
      } else {
        if (marketFinalizedLogs.length > 0) {
          return MarketInfoReportingState.FINALIZED;
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
            return MarketInfoReportingState.AWAITING_NEXT_WINDOW;
          }
          return MarketInfoReportingState.CROWDSOURCING_DISPUTE;
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
