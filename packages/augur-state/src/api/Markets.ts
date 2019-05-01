import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import { Address, MarketType, MarketCreatedLog, MarketFinalizedLog } from "../logs/types";
import { SortLimit } from "./types";
import { Augur, numTicksToTickSize } from "@augurproject/api";
import { ethers } from "ethers";

import * as _ from "lodash";
import * as t from "io-ts";

const GetMarketsParamsSpecific = t.intersection([t.type({
  universe: t.string,
}), t.partial({
  creator: t.string,
  category: t.string,
  search: t.string,
  reportingState: t.string,
  disputeWindow: t.string,
  designatedReporter: t.string,
  maxFee: t.number,
  hasOrders: t.boolean,
})]);

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
  consensus: Array<string>|null,
  outcomes: Array<MarketInfoOutcome>;
}

export class Markets<TBigNumber> {
  public static GetMarketsParams = t.intersection([GetMarketsParamsSpecific, SortLimit]);
  public static GetMarketsInfoParams = t.type({ marketIds: t.array(t.string) });

  @Getter("GetMarketsParams")
  public static async getMarkets<TBigNumber>(augur: Augur<ethers.utils.BigNumber>, db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.GetMarketsParams>): Promise<Array<Address>> {
    if (! await augur.contracts.augur.isKnownUniverse_(params.universe)) {
      throw new Error("Unknown universe: " + params.universe);
    }

    // TODO Calculate feeDivisor
    let feeDivisor = undefined;
    if (params.maxFee) {
      // console.log("MAXFEE");
      const reportingFeeDivisor = await augur.contracts.universe.getOrCacheReportingFeeDivisor_();
      // console.log("reportingFeeDivisor", reportingFeeDivisor);
      feeDivisor = new ethers.utils.BigNumber(params.maxFee).sub(reportingFeeDivisor);
      // console.log("feeDivisor", feeDivisor.toString());
    }

    const marketCreatedLogs = await db.findMarketCreatedLogs(
      {
        selector: {
          universe: params.universe,
          marketCreator: params.creator,
          designatedReporter: params.designatedReporter,
          feeDivisor: feeDivisor ? {$lte: feeDivisor} : undefined,
        },
        sort: params.sortBy ? [params.sortBy] : undefined,
        limit: params.limit,
        skip: params.offset
      }
    );

    // console.log("MARKET CREATED LOGS");
    // console.log(marketCreatedLogs);

    let keyedMarketCreatedLogs = marketCreatedLogs.reduce(
      (previousValue: any, currentValue: MarketCreatedLog) => {
        previousValue[currentValue.market] = currentValue
        return previousValue;
      },
      []
    );

    // console.log("KEYED MARKET CREATED LOGS");
    // console.log(keyedMarketCreatedLogs);

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

      // console.log("KEYED FULL TEXT MARKET IDS");
      // console.log(keyedFullTextMarketIds);

      filteredKeyedMarketCreatedLogs = Object.entries(keyedMarketCreatedLogs).reduce(
        (previousValue: any, currentValue: any) => {
          if (keyedFullTextMarketIds[currentValue[0]]) {
            previousValue[currentValue[0]] = currentValue[1];
          }
          return previousValue;
        },
        []
      );

      // console.log("FILTERED KEYED MARKET CREATED LOGS");
      // console.log(filteredKeyedMarketCreatedLogs);
    }

    await Promise.all(
      Object.entries(filteredKeyedMarketCreatedLogs).map(async (marketCreatedLogInfo: any) => {
        let includeMarket = true;

        // TODO
        if (params.disputeWindow) {
        }

        if (params.hasOrders) {
          const orderCreatedLogs = await db.findOrderCreatedLogs({selector: {market: marketCreatedLogInfo[0]}});
          const orderCanceledLogs = await db.findOrderCanceledLogs({selector: {market: marketCreatedLogInfo[0]}});
          const orderFilledLogs = await db.findOrderFilledLogs({selector: {market: marketCreatedLogInfo[0], orderIsCompletelyFilled: true}});
          if (orderCreatedLogs.length - orderCanceledLogs.length === orderFilledLogs.length) {
            includeMarket = false;
          }
        }

        if (params.reportingState) {
          const marketFinalizedLogs = await db.findMarketFinalizedLogs({selector: {market: marketCreatedLogInfo[0]}});
          const reportingState = await Markets.getMarketReportingState(db, marketCreatedLogInfo[1], marketFinalizedLogs);
          // console.log("REPORTING_STATE");
          // console.log("GOTTEN: ", reportingState);
          // console.log("DESIRED: ", params.reportingState);
          if (reportingState !== params.reportingState) {
            includeMarket = false;
          }
        }

        if (includeMarket) {
          // console.log("INCLUDE");
          // console.log(marketCreatedLogInfo);
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
        // console.log("MARKET IDS");
        // console.log(marketIds);

        filteredKeyedMarketCreatedLogs = Object.entries(filteredKeyedMarketCreatedLogs).reduce(
          (previousValue: any, currentValue: any) => {
            if (marketIds[currentValue[1].market]) {
              previousValue[currentValue[0]] = currentValue[1];
            }
            return previousValue;
          },
          []
        );
        // console.log("filteredKeyedMarketCreatedLogs");
        // console.log(filteredKeyedMarketCreatedLogs);
      }
    );

    return Object.keys(filteredKeyedMarketCreatedLogs);
  }

  private static async getMarketOutcomes<TBigNumber>(db: DB<TBigNumber>, marketCreatedLog: MarketCreatedLog): Promise<Array<MarketInfoOutcome>> {
    let outcomes: Array<MarketInfoOutcome> = [];
    if (marketCreatedLog.outcomes.length === 0) {
      const ordersFilled0 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, outcome: "0x00"}})).reverse();
      const ordersFilled1 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, outcome: "0x01"}})).reverse();
      const ordersFilled2 = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, outcome: "0x02"}})).reverse();
      outcomes.push({
        id: 0,
        price: ordersFilled0.length > 0 ? new BigNumber(ordersFilled0[0].price).toString(10) : "0",
        description: "Invalid"
      });
      outcomes.push({
        id: 1,
        price: ordersFilled1.length > 0 ? new BigNumber(ordersFilled1[0].price).toString(10) : "0",
        description: (marketCreatedLog.marketType === 0) ? "No" : new BigNumber(marketCreatedLog.prices[0]._hex).toString(10)
      });
      outcomes.push({
        id: 2,
        price: ordersFilled2.length > 0 ? new BigNumber(ordersFilled2[0].price).toString(10) : "0",
        description: (marketCreatedLog.marketType === 0) ? "Yes" : new BigNumber(marketCreatedLog.prices[1]._hex).toString(10)
      });
    } else {
      const ordersFilled = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, outcome: "0x00"}})).reverse();
      outcomes.push({
        id: 0,
        price: ordersFilled.length > 0 ? new BigNumber(ordersFilled[0].price).toString(10) : "0",
        description: "Invalid"
      });
      for (let i = 0; i < marketCreatedLog.outcomes.length; i++) {
        const ordersFilled = (await db.findOrderFilledLogs({selector: {market: marketCreatedLog.market, outcome: "0x0" + (i + 1)}})).reverse();
        const outcomeDescription = marketCreatedLog.outcomes[i].replace("0x", "");
        outcomes.push({
          id: i + 1,
          price: ordersFilled.length > 0 ? new BigNumber(ordersFilled[0].price).toString(10) : "0",
          description: Buffer.from(outcomeDescription, "hex").toString()
        });
      }
    }
    return outcomes;
  }

  private static async getMarketOpenInterest<TBigNumber>(db: DB<TBigNumber>, marketCreatedLog: MarketCreatedLog): Promise<string> {
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

  private static async getMarketReportingState<TBigNumber>(db: DB<TBigNumber>, marketCreatedLog: MarketCreatedLog, marketFinalizedLogs: Array<MarketFinalizedLog>): Promise<MarketInfoReportingState> {
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
      const timestampSetLogs = (await db.findTimestampSetLogs({selector: {newTimestamp: {$type: "string"}}}));
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

  @Getter("GetMarketsInfoParams")
  public static async getMarketsInfo<TBigNumber>(augur: Augur<ethers.utils.BigNumber>, db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.GetMarketsInfoParams>): Promise<Array<MarketInfo>> {
    const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {market: {$in: params.marketIds}}});

    return Promise.all(marketCreatedLogs.map(async (marketCreatedLog) => {
      const marketFinalizedLogs = (await db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const marketVolumeChangedLogs = (await db.findMarketVolumeChangedLogs({selector: {market: marketCreatedLog.market}})).reverse();

      const minPrice = new BigNumber(marketCreatedLog.prices[0]._hex);
      const maxPrice = new BigNumber(marketCreatedLog.prices[1]._hex);
      const numTicks = new BigNumber(marketCreatedLog.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const cumulativeScale = maxPrice.minus(minPrice);

      const reportingState = await Markets.getMarketReportingState(db, marketCreatedLog, marketFinalizedLogs);
      const needsMigration = (reportingState === MarketInfoReportingState.AWAITING_FORK_MIGRATION) ? true : false;

      let consensus = null;
      let finalizationBlockNumber = null;
      let finalizationTime = null;
      if (marketFinalizedLogs.length > 0) {
        consensus = [];
        marketFinalizedLogs[0].winningPayoutNumerators;
        for (let i = 0; i < marketFinalizedLogs[0].winningPayoutNumerators.length; i++) {
          consensus[i] = new BigNumber(marketFinalizedLogs[0].winningPayoutNumerators[i]._hex).toString(10);
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
        openInterest: await Markets.getMarketOpenInterest(db, marketCreatedLog),
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
        outcomes: await Markets.getMarketOutcomes(db, marketCreatedLog)
      });
    }));
  }
}
