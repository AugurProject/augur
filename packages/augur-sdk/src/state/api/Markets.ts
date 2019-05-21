import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import {
  Address,
  MarketType,
  MarketCreatedLog,
  MarketFinalizedLog,
  OrderEventLog,
  OrderEventType,
  OrderEventUint256Value,
  ORDER_EVENT_AMOUNT,
  ORDER_EVENT_OUTCOME
} from "../logs/types";
import { SortLimit } from "./types";
import { Augur, numTicksToTickSize } from "../../index";
import { ethers } from "ethers";
import { toAscii } from "../utils/utils";

import * as _ from "lodash";
import * as t from "io-ts";

const GetMarketsParamsSpecific = t.intersection([t.type({
  universe: t.string,
}), t.partial({
  creator: t.string,
  category: t.string,
  search: t.string,
  reportingState: t.union([t.string, t.array(t.string)]),
  disputeWindow: t.string,
  designatedReporter: t.string,
  maxFee: t.string,
  hasOrders: t.boolean,
})]);

const OutcomeParam = t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
});

export const SECONDS_IN_A_DAY = 86400;

export interface MarketInfoOutcome {
  id: number;
  price: string;
  description: string | null;
}

export enum MarketInfoReportingState {
  PRE_REPORTING = "PRE_REPORTING",
  DESIGNATED_REPORTING = "DESIGNATED_REPORTING",
  OPEN_REPORTING = "OPEN_REPORTING",
  CROWDSOURCING_DISPUTE = "CROWDSOURCING_DISPUTE",
  AWAITING_NEXT_WINDOW = "AWAITING_NEXT_WINDOW",
  AWAITING_FINALIZATION = "AWAITING_FINALIZATION",
  FINALIZED = "FINALIZED",
  FORKING = "FORKING",
  AWAITING_NO_REPORT_MIGRATION = "AWAITING_NO_REPORT_MIGRATION",
  AWAITING_FORK_MIGRATION = "AWAITING_FORK_MIGRATION"
}

export interface MarketInfo {
  id: string;
  universe: string;
  marketType: MarketType;
  numOutcomes: number;
  minPrice: string;
  maxPrice: string;
  cumulativeScale: string;
  author: string;
  creationBlock: number;
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
  consensus: Array<string> | null,
  outcomes: Array<MarketInfoOutcome>;
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
  [outcome: number]: Array<MarketPriceCandlestick>;
}

export interface TimestampedPriceAmount {
  price: string;
  amount: string;
  timestamp: string;
}

export interface MarketPriceHistory {
  [outcome: string]: Array<TimestampedPriceAmount>;
}

export class Markets {
  public static GetMarketPriceCandlestickParams = t.type({
    marketId: t.string,
    outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  });
  public static GetMarketPriceHistoryParams = t.type({ marketId: t.string });
  public static GetMarketsParams = t.intersection([GetMarketsParamsSpecific, SortLimit]);
  public static GetMarketsInfoParams = t.type({ marketIds: t.array(t.string) });
  public static GetTopics = t.type({ universe: t.string });

  @Getter("GetMarketPriceCandlestickParams")
  public static async getMarketPriceCandlesticks(augur: Augur, db: DB, params: t.TypeOf<typeof Markets.GetMarketPriceCandlestickParams>): Promise<MarketPriceCandlesticks> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {market: params.marketId}});
    if (marketCreatedLogs.length < 1) {
      throw new Error(`No marketId for getMarketPriceCandlesticks: ${params.marketId}`);
    }

    const orderFilledLogs = await db.findOrderFilledLogs({selector: {market: params.marketId, eventType: OrderEventType.Fill}});
    const filteredOrderFilledLogs = filterOrderFilledLogs(orderFilledLogs, params);
    const tradeRowsByOutcome = _.groupBy(filteredOrderFilledLogs, (orderFilledLog) => {return new BigNumber(orderFilledLog.uint256Data[OrderEventUint256Value.outcome]).toString(10);});

    return _.mapValues(tradeRowsByOutcome, (outcomeTradeRows) => {
      const outcomeTradeRowsByPeriod = _.groupBy(outcomeTradeRows, (tradeRow) => getPeriodStartTime(params.start || 0, new BigNumber(tradeRow.uint256Data[OrderEventUint256Value.timestamp]).toNumber(), params.period || 60));
        return _.map(outcomeTradeRowsByPeriod, (trades: Array<OrderEventLog>, startTimestamp): MarketPriceCandlestick => {
          // TODO remove this partialCandlestick stuff and just return
          // a Candlestick after the temporary Candlestick.tokenVolume
          // is removed (see note on Candlestick.tokenVolume).
          const partialCandlestick = {
            startTimestamp: parseInt(startTimestamp, 10),
            start: new BigNumber(_.minBy(trades, (tradeLog) => {return new BigNumber(tradeLog.uint256Data[OrderEventUint256Value.timestamp]).toNumber();})!.uint256Data[OrderEventUint256Value.price]).toString(10),
            end: new BigNumber(_.maxBy(trades, (tradeLog) => {return new BigNumber(tradeLog.uint256Data[OrderEventUint256Value.timestamp]).toNumber();})!.uint256Data[OrderEventUint256Value.price]).toString(10),
            min: new BigNumber(_.minBy(trades, (tradeLog) => {return new BigNumber(tradeLog.uint256Data[OrderEventUint256Value.price]).toNumber();})!.uint256Data[OrderEventUint256Value.price]).toString(10),
            max: new BigNumber(_.maxBy(trades, (tradeLog) => {return new BigNumber(tradeLog.uint256Data[OrderEventUint256Value.price]).toNumber();})!.uint256Data[OrderEventUint256Value.price]).toString(10),
            volume: _.reduce(trades, (totalVolume: BigNumber, tradeRow: OrderEventLog) => totalVolume.plus(new BigNumber(tradeRow.uint256Data[OrderEventUint256Value.amount]).times(tradeRow.uint256Data[OrderEventUint256Value.price])), new BigNumber(0)).toString(10),
            shareVolume: _.reduce(trades, (totalShareVolume: BigNumber, tradeRow: OrderEventLog) => totalShareVolume.plus(tradeRow.uint256Data[OrderEventUint256Value.amount]), new BigNumber(0)).toString(10), // the business definition of shareVolume should be the same as used with markets/outcomes.shareVolume (which currently is just summation of trades.amount)
          };
          return {
            tokenVolume: partialCandlestick.shareVolume, // tokenVolume is temporary, see note on Candlestick.tokenVolume
            ...partialCandlestick,
          };
        });
    });
  }

  @Getter("GetMarketPriceHistoryParams")
  public static async getMarketPriceHistory(augur: Augur, db: DB, params: t.TypeOf<typeof Markets.GetMarketPriceHistoryParams>): Promise<MarketPriceHistory> {
    let orderFilledLogs = await db.findOrderFilledLogs({selector: {market: params.marketId, eventType: OrderEventType.Fill}});
    orderFilledLogs.sort(
      (a: OrderEventLog, b: OrderEventLog) => {
        return (new BigNumber(a.uint256Data[OrderEventUint256Value.timestamp]).minus(b.uint256Data[OrderEventUint256Value.timestamp])).toNumber();
      }
    );

    return orderFilledLogs.reduce(
      (previousValue: MarketPriceHistory, currentValue: OrderEventLog): MarketPriceHistory => {
        const outcomeString = new BigNumber(currentValue.uint256Data[OrderEventUint256Value.outcome]).toString(10);
        if (!previousValue[outcomeString]) {
          previousValue[outcomeString] = [];
        }
        previousValue[outcomeString].push({
          price: new BigNumber(currentValue.uint256Data[OrderEventUint256Value.price]).toString(10),
          amount: new BigNumber(currentValue.uint256Data[OrderEventUint256Value.amount]).toString(10),
          timestamp: new BigNumber(currentValue.uint256Data[OrderEventUint256Value.timestamp]).toString(10),
        });
        return previousValue;
      },
      {}
    )
  }

  @Getter("GetMarketsParams")
  public static async getMarkets(augur: Augur, db: DB, params: t.TypeOf<typeof Markets.GetMarketsParams>): Promise<Array<Address>> {
    if (! await augur.contracts.augur.isKnownUniverse_(params.universe)) {
      throw new Error("Unknown universe: " + params.universe);
    }

    const marketCreatedLogs = await db.findMarketCreatedLogs(
      {
        selector: {
          universe: params.universe,
          marketCreator: params.creator,
          designatedReporter: params.designatedReporter,
        },
        sort: params.sortBy ? [params.sortBy] : undefined,
        limit: params.limit,
        skip: params.offset
      }
    );

    let marketCreatorFeeDivisor: BigNumber|undefined = undefined;
    if (params.maxFee) {
      const reportingFeeDivisor = new BigNumber((await augur.contracts.universe.getOrCacheReportingFeeDivisor_()).toNumber());
      const reportingFee = new BigNumber(1).div(reportingFeeDivisor);
      const marketCreatorFee = new BigNumber(params.maxFee).minus(reportingFee);
      marketCreatorFeeDivisor = new BigNumber(10 ** 18).multipliedBy(marketCreatorFee);
    }

    let keyedMarketCreatedLogs = marketCreatedLogs.reduce(
      (previousValue: any, currentValue: MarketCreatedLog) => {
        // Filter markets with fees > maxFee
        if (
          params.maxFee && typeof marketCreatorFeeDivisor !== "undefined" &&
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
      const fullTextSearchResults = await db.fullTextSearch("MarketCreated", params.search);

      const keyedFullTextMarketIds: any = fullTextSearchResults.reduce(
        (previousValue: any, fullTextSearchResult: any) => {
          previousValue[fullTextSearchResult.market] = fullTextSearchResult;
          return previousValue;
        },
        []
      );

      filteredKeyedMarketCreatedLogs = Object.entries(keyedMarketCreatedLogs).reduce(
        (previousValue: any, currentValue: any) => {
          if (keyedFullTextMarketIds[currentValue[0]]) {
            previousValue[currentValue[0]] = currentValue[1];
          }
          return previousValue;
        },
        []
      );
    }

    await Promise.all(
      Object.entries(filteredKeyedMarketCreatedLogs).map(async (marketCreatedLogInfo: any) => {
        let includeMarket = true;

        if (params.disputeWindow) {
          const market = await augur.contracts.marketFromAddress(marketCreatedLogInfo[0]);
          const disputeWindowAddress = await market.getDisputeWindow_();
          if (params.disputeWindow != disputeWindowAddress) {
            includeMarket = false;
          }
        }

        // TODO: when currentOrders event table exists just check that
        if (params.hasOrders) {
          const orderCreatedLogs = await db.findOrderCreatedLogs({selector: {market: marketCreatedLogInfo[0]}});
          const orderCanceledLogs = await db.findOrderCanceledLogs({selector: {market: marketCreatedLogInfo[0]}});
          const orderFilledLogs = await db.findOrderFilledLogs({selector: {market: marketCreatedLogInfo[0], [ORDER_EVENT_AMOUNT]: "0x00"}});
          if (orderCreatedLogs.length - orderCanceledLogs.length === orderFilledLogs.length) {
            includeMarket = false;
          }
        }

        if (params.reportingState) {
          const reportingStates = Array.isArray(params.reportingState) ? params.reportingState : [params.reportingState];
          const marketFinalizedLogs = await db.findMarketFinalizedLogs({selector: {market: marketCreatedLogInfo[0]}});
          const reportingState = await getMarketReportingState(db, marketCreatedLogInfo[1], marketFinalizedLogs);
          if (!reportingStates.includes(reportingState)) {
            includeMarket = false;
          }
        }

        if (includeMarket) {
          return marketCreatedLogInfo[0];
        }
        return null;
      })
    ).then(
      (marketIds: any) => {
        marketIds = marketIds.reduce(
          (previousValue: any, currentValue: string|null) => {
            if (currentValue) {
              previousValue[currentValue] = currentValue;
            }
            return previousValue;
          },
          []
        );

        filteredKeyedMarketCreatedLogs = Object.entries(filteredKeyedMarketCreatedLogs).reduce(
          (previousValue: any, currentValue: any) => {
            if (marketIds[currentValue[1].market]) {
              previousValue[currentValue[0]] = currentValue[1];
            }
            return previousValue;
          },
          []
        );
      }
    );

    return Object.keys(filteredKeyedMarketCreatedLogs);
  }

  @Getter("GetMarketsInfoParams")
  public static async getMarketsInfo(augur: Augur, db: DB, params: t.TypeOf<typeof Markets.GetMarketsInfoParams>): Promise<Array<MarketInfo>> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {market: {$in: params.marketIds}}});

    return Promise.all(marketCreatedLogs.map(async (marketCreatedLog) => {
      const marketFinalizedLogs = (await db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const marketVolumeChangedLogs = (await db.findMarketVolumeChangedLogs({selector: {market: marketCreatedLog.market}})).reverse();

      const minPrice = new BigNumber(marketCreatedLog.prices[0]);
      const maxPrice = new BigNumber(marketCreatedLog.prices[1]);
      const numTicks = new BigNumber(marketCreatedLog.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const cumulativeScale = maxPrice.minus(minPrice);

      const reportingState = await getMarketReportingState(db, marketCreatedLog, marketFinalizedLogs);
      const needsMigration = (reportingState === MarketInfoReportingState.AWAITING_FORK_MIGRATION) ? true : false;

      let consensus = null;
      let finalizationBlockNumber = null;
      let finalizationTime = null;
      if (marketFinalizedLogs.length > 0) {
        consensus = [];
        marketFinalizedLogs[0].winningPayoutNumerators;
        for (let i = 0; i < marketFinalizedLogs[0].winningPayoutNumerators.length; i++) {
          consensus[i] = new BigNumber(marketFinalizedLogs[0].winningPayoutNumerators[i]).toString(10);
        }
        finalizationBlockNumber = marketFinalizedLogs[0].blockNumber;
        finalizationTime = new BigNumber(marketFinalizedLogs[0].timestamp).toString(10);
      }

      let marketType: string;
      if (marketCreatedLog.marketType === MarketType.YesNo) {
        marketType = "yesNo";
      } else if (marketCreatedLog.marketType === MarketType.Categorical) {
        marketType = "categorical";
      } else {
        marketType = "scalar";
      }

      let description = null;
      let details = null;
      let resolutionSource = null;
      let scalarDenomination = null;
      if (marketCreatedLog.extraInfo) {
        const extraInfo = JSON.parse(marketCreatedLog.extraInfo);
        description = extraInfo.description ? extraInfo.longDescription : null;
        details = extraInfo.longDescription ? extraInfo.longDescription : null;
        resolutionSource = extraInfo.resolutionSource ? extraInfo.resolutionSource : null;
        scalarDenomination = extraInfo._scalarDenomination ? extraInfo._scalarDenomination : null;
      }

      return Object.assign({
        id: marketCreatedLog.market,
        universe: marketCreatedLog.universe,
        marketType,
        numOutcomes: (marketCreatedLog.outcomes.length > 0) ? marketCreatedLog.outcomes.length + 1 : 3,
        minPrice: minPrice.toString(10),
        maxPrice: maxPrice.toString(10),
        cumulativeScale: cumulativeScale.toString(10),
        author: marketCreatedLog.marketCreator,
        creationBlock: marketCreatedLog.blockNumber,
        category: Buffer.from(marketCreatedLog.topic.replace("0x", ""), "hex").toString(),
        volume: (marketVolumeChangedLogs.length > 0) ? new BigNumber(marketVolumeChangedLogs[0].volume).toString() : "0",
        openInterest: await getMarketOpenInterest(db, marketCreatedLog),
        reportingState,
        needsMigration,
        endTime: new BigNumber(marketCreatedLog.endTime).toNumber(),
        finalizationBlockNumber,
        finalizationTime,
        description,
        scalarDenomination,
        details,
        resolutionSource,
        numTicks: numTicks.toString(10),
        tickSize: tickSize.toString(10),
        consensus,
        outcomes: await getMarketOutcomes(db, marketCreatedLog)
      });
    }));
  }

  @Getter("GetTopics")
  public static async getTopics(augur: Augur, db: DB, params: t.TypeOf<typeof Markets.GetTopics>): Promise<Array<string>> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {universe: params.universe}});
    let topics: any = {};
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      if (!(topics[toAscii(marketCreatedLogs[i].topic)])) {
        topics[toAscii(marketCreatedLogs[i].topic)] = null;
      }
    }
    return Object.keys(topics);
  }
}

function filterOrderFilledLogs(orderFilledLogs: Array<OrderEventLog>, params: t.TypeOf<typeof Markets.GetMarketPriceCandlestickParams>): Array<OrderEventLog> {
  let filteredOrderFilledLogs = orderFilledLogs;
  if (params.outcome || params.start || params.end) {
    filteredOrderFilledLogs = orderFilledLogs.reduce(
      (previousValue: Array<OrderEventLog>, currentValue: OrderEventLog): Array<OrderEventLog> => {
        if (
          (params.outcome && new BigNumber(currentValue.uint256Data[OrderEventUint256Value.outcome]).toString(10) !== params.outcome.toString(10)) ||
          (params.start && new BigNumber(currentValue.uint256Data[OrderEventUint256Value.timestamp]).toNumber() <= params.start) ||
          (params.end && new BigNumber(currentValue.uint256Data[OrderEventUint256Value.timestamp]).toNumber() >= params.end)
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

async function getMarketOpenInterest(db: DB, marketCreatedLog: MarketCreatedLog): Promise<string> {
  const completeSetsPurchasedLogs = (await db.findCompleteSetsPurchasedLogs({selector: {market: marketCreatedLog.market}})).reverse();
  const completeSetsSoldLogs = (await db.findCompleteSetsSoldLogs({selector: {market: marketCreatedLog.market}})).reverse();
  if (completeSetsPurchasedLogs.length > 0 && completeSetsSoldLogs.length > 0) {
    if (completeSetsPurchasedLogs[0].blockNumber > completeSetsSoldLogs[0].blockNumber) {
      return new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
    } else if (completeSetsSoldLogs[0].blockNumber > completeSetsPurchasedLogs[0].blockNumber) {
      return new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
    } else if (completeSetsPurchasedLogs[0].transactionIndex > completeSetsSoldLogs[0].transactionIndex) {
      return new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
    } else {
      return new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
    }
  } else if (completeSetsPurchasedLogs.length > 0) {
    return new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
  } else  if (completeSetsSoldLogs.length > 0) {
    return new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
  }
  return "0";
}

async function getMarketOutcomes(db: DB, marketCreatedLog: MarketCreatedLog): Promise<Array<MarketInfoOutcome>> {
  let outcomes: Array<MarketInfoOutcome> = [];
  if (marketCreatedLog.outcomes.length === 0) {
    const ordersFilled0 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, [ORDER_EVENT_OUTCOME]: "0x00"}})).reverse();
    const ordersFilled1 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, [ORDER_EVENT_OUTCOME]: "0x01"}})).reverse();
    const ordersFilled2 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, [ORDER_EVENT_OUTCOME]: "0x02"}})).reverse();
    outcomes.push({
      id: 0,
      price: ordersFilled0.length > 0 ? new BigNumber(ordersFilled0[0].uint256Data[OrderEventUint256Value.price]).toString(10) : "0",
      description: "Invalid"
    });
    outcomes.push({
      id: 1,
      price: ordersFilled1.length > 0 ? new BigNumber(ordersFilled1[0].uint256Data[OrderEventUint256Value.price]).toString(10) : "0",
      description: (marketCreatedLog.marketType === 0) ? "No" : new BigNumber(marketCreatedLog.prices[0]).toString(10)
    });
    outcomes.push({
      id: 2,
      price: ordersFilled2.length > 0 ? new BigNumber(ordersFilled2[0].uint256Data[OrderEventUint256Value.price]).toString(10) : "0",
      description: (marketCreatedLog.marketType === 0) ? "Yes" : new BigNumber(marketCreatedLog.prices[1]).toString(10)
    });
  } else {
    const ordersFilled = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, [ORDER_EVENT_OUTCOME]: "0x00"}})).reverse();
    outcomes.push({
      id: 0,
      price: ordersFilled.length > 0 ? new BigNumber(ordersFilled[0].uint256Data[OrderEventUint256Value.price]).toString(10) : "0",
      description: "Invalid"
    });
    for (let i = 0; i < marketCreatedLog.outcomes.length; i++) {
      const ordersFilled = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, [ORDER_EVENT_OUTCOME]: "0x0" + (i + 1)}})).reverse();
      const outcomeDescription = marketCreatedLog.outcomes[i].replace("0x", "");
      outcomes.push({
        id: i + 1,
        price: ordersFilled.length > 0 ? new BigNumber(ordersFilled[0].uint256Data[OrderEventUint256Value.price]).toString(10) : "0",
        description: Buffer.from(outcomeDescription, "hex").toString()
      });
    }
  }
  return outcomes;
}

async function getMarketReportingState(db: DB, marketCreatedLog: MarketCreatedLog, marketFinalizedLogs: Array<MarketFinalizedLog>): Promise<MarketInfoReportingState> {
  const universeForkedLogs = (await db.findUniverseForkedLogs({selector: {universe: marketCreatedLog.universe}})).reverse();
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
    const timestampSetLogs = await db.findTimestampSetLogs({selector: {newTimestamp: {$type: "string"}}});
    let currentTimestamp;
    if (timestampSetLogs.length > 0) {
      // Determine current timestamp since timestampSetLogs are not sorted by blockNumber
      currentTimestamp = new BigNumber(timestampSetLogs[0].newTimestamp);
      for (let i = 0; i < timestampSetLogs.length; i++) {
        if (new BigNumber(timestampSetLogs[i].newTimestamp).gt(currentTimestamp)) {
          currentTimestamp = new BigNumber(timestampSetLogs[i].newTimestamp);
        }
      }
    } else {
      currentTimestamp = new BigNumber(Math.round(Date.now() / 1000));
    }
    if (new BigNumber(currentTimestamp).lt(marketCreatedLog.endTime)) {
      return MarketInfoReportingState.PRE_REPORTING;
    } else {
      const initialReportSubmittedLogs = (await db.findInitialReportSubmittedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const designatedReportingEndTime = new BigNumber(marketCreatedLog.endTime).plus(SECONDS_IN_A_DAY);
      if (initialReportSubmittedLogs.length === 0 && currentTimestamp.lte(designatedReportingEndTime)) {
        return MarketInfoReportingState.DESIGNATED_REPORTING;
      } else if (initialReportSubmittedLogs.length === 0 && currentTimestamp.gt(designatedReportingEndTime)) {
        return MarketInfoReportingState.OPEN_REPORTING;
      } else {
        if (marketFinalizedLogs.length > 0) {
          return MarketInfoReportingState.FINALIZED;
        } else {
          const disputeCrowdsourcerCompletedLogs = (await db.findDisputeCrowdsourcerCompletedLogs({selector: {market: marketCreatedLog.market}})).reverse();
          if (
            disputeCrowdsourcerCompletedLogs.length > 0 &&
            disputeCrowdsourcerCompletedLogs[0].pacingOn &&
            currentTimestamp.lt(disputeCrowdsourcerCompletedLogs[0].nextWindowStartTime)
          ) {
            return MarketInfoReportingState.AWAITING_NEXT_WINDOW;
          }
          return MarketInfoReportingState.CROWDSOURCING_DISPUTE;
        }
      }
    }
  }
}

function getPeriodStartTime(globalStarttime: number, periodStartime: number, period: number): number {
  const secondsSinceGlobalStart = (periodStartime - globalStarttime);
  return (secondsSinceGlobalStart - secondsSinceGlobalStart % period) + globalStarttime;
}
