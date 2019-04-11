import { BigNumber } from "bignumber.js";
import * as _ from "lodash";
import { numTicksToTickSize } from "@augurproject/api";
import { DB } from "../db/DB";
import { MarketType, SortLimit } from "./types";

export interface GetMarketsParamsSpecific {
  universe: string;
  creator?: string;
  category?: string;
  search?: string;
  reportingState?: string;
  disputeWindow?: string;
  designatedReporter?: string;
  maxFee?: number;
  hasOrders?: boolean;
}

export interface GetMarketsParams extends GetMarketsParamsSpecific, SortLimit {
}

export interface GetMarketsInfoParams {
  marketIds: Array<string>;
}

export interface MarketInfoOutcome {
  id: number;
  price: string;
  description: string|null;
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
  creationTime: number;
  creationBlock: number;
  category:string;
  volume: string;
  openInterest: string;
  reportingState: string;
  needsMigration: boolean;
  endTime: number;
  finalizationBlockNumber: number|null;
  finalizationTime: number|null;
  description: string;
  scalarDenomination: string|null;
  details: string|null;
  resolutionSource: string|null;
  numTicks: string;
  tickSize: string;
  consensus: null, // TODO Update once consensus has been added to MarketFinalized Event
  outcomes: Array<MarketInfoOutcome>;
}

export class Markets<TBigNumber> {
  private readonly db: DB<TBigNumber>;

  constructor(db: DB<TBigNumber>) {
    this.db = db;
  }

  public async getMarkets(params: GetMarketsParams): Promise<void> {
    // TODO
  }

  // TODO Add decorator code
  // TODO Improve performance by using Promise.all for DB queries
  public async getMarketsInfo(params: GetMarketsInfoParams): Promise<Array<MarketInfo>> {
    const marketCreatedLogs = await this.db.findMarketCreatedLogs({selector: {market: {$in: params.marketIds}}});

    return await Promise.all(marketCreatedLogs.map(async (marketCreatedLog) => {
      let finalizationBlockNumber = null;
      let finalizationTime = null;
      const marketFinalizedLogs = await this.db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}});
      if (marketFinalizedLogs.length > 0) {
        finalizationBlockNumber = marketFinalizedLogs[0].blockNumber;
        // TODO Update line below once finalizationTime has been added to MarketFinalized event
        finalizationTime = marketFinalizedLogs[0].timestamp;
      }

      let volume = "0";
      const marketVolumeChangedLogs = (await this.db.findMarketVolumeChangedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      if (marketVolumeChangedLogs.length > 0) {
        volume = marketVolumeChangedLogs[0].volume;
      }

      const minPrice = new BigNumber(marketCreatedLog.minPrice);
      const maxPrice = new BigNumber(marketCreatedLog.maxPrice);
      const numTicks = new BigNumber(marketCreatedLog.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      console.log("tickSize");
      console.log(tickSize);
      const cumulativeScale = maxPrice.minus(minPrice);
      const category = marketCreatedLog.topic.replace("0x", "");
      const consensus = null; // TODO Set once consensus has been added to MarketFinalized event

      let marketType;
      if (marketCreatedLog.marketType === MarketType.YesNo) {
        marketType = "yesNo";
      } else if (marketCreatedLog.marketType === MarketType.Categorical) {
        marketType = "categorical";
      } else {
        marketType = "scalar";
      }

      let details = null;
      let resolutionSource = null;
      let scalarDenomination = null;
      if (marketCreatedLog.extraInfo) {
        const extraInfo = JSON.parse(marketCreatedLog.extraInfo);
        details = extraInfo.longDescription ? extraInfo.longDescription : null;
        resolutionSource = extraInfo.resolutionSource ? extraInfo.resolutionSource : null;
        scalarDenomination = extraInfo._scalarDenomination ? extraInfo._scalarDenomination : null;
      }

      let outcomes: Array<MarketInfoOutcome> = [];
      // TODO Set outcome prices once price has been added to OrderFilled event
      if (marketCreatedLog.outcomes.length === 0) {
        outcomes.push({
          id: 0,
          price: "0",
          description: null
        });
        outcomes.push({
          id: 1,
          price: "0",
          description: null
        });
      } else {
        for (let i = 0; i < marketCreatedLog.outcomes.length; i++) {
          const outcomeDescription = marketCreatedLog.outcomes[i].replace("0x", "");
          outcomes.push({
            id: i,
            price: "0",
            description: Buffer.from(outcomeDescription, "hex").toString()
          });
        }
      }

      let openInterest = "0";
      const completeSetsPurchasedLogs = (await this.db.findCompleteSetsPurchasedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const completeSetsSoldLogs = (await this.db.findCompleteSetsSoldLogs({selector: {market: marketCreatedLog.market}})).reverse();
      if (completeSetsPurchasedLogs.length > 0 && completeSetsSoldLogs.length > 0) {
        if (completeSetsPurchasedLogs[0].blockNumber > completeSetsSoldLogs[0].blockNumber) {
          openInterest = completeSetsPurchasedLogs[0].marketOI;
        } else if (completeSetsSoldLogs[0].blockNumber > completeSetsPurchasedLogs[0].blockNumber) {
          openInterest = completeSetsSoldLogs[0].marketOI;
        } else if (completeSetsPurchasedLogs[0].transactionIndex > completeSetsSoldLogs[0].transactionIndex) {
          openInterest = completeSetsPurchasedLogs[0].marketOI;
        } else {
          openInterest = completeSetsSoldLogs[0].marketOI;
        }
      } else if (completeSetsPurchasedLogs.length > 0) {
        openInterest = completeSetsPurchasedLogs[0].marketOI;
      } else  if (completeSetsSoldLogs.length > 0) {
        openInterest = completeSetsSoldLogs[0].marketOI;
      }

      let reportingState: MarketInfoReportingState = MarketInfoReportingState.PRE_REPORTING;
      let needsMigration: boolean = false;
      // TODO Set reportingState once more logging has been added
      // const universeForkedLogs = await this.db.findUniverseForkedLogs({selector: {universe: marketCreatedLog.universe}});
      // if (universeForkedLogs.length > 0) {
      //   if (universeForkedLogs[0].market === marketCreatedLog.market) {
      //     reportingState = MarketInfoReportingState.FORKING;
      //   } else {
      //     const marketFinalizedLogs = await this.db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}});
      //     if (marketFinalizedLogs.length > 0) {
      //       reportingState = MarketInfoReportingState.FINALIZED;
      //     } else {
      //       reportingState = MarketInfoReportingState.AWAITING_FORK_MIGRATION;
      //       needsMigration = true;
      //     }
      //   }
      // } else {
      //   if (new BigNumber(marketCreatedLog.endTime).lt(new BigNumber((Date.now() * 1000)))) {
      //     reportingState = MarketInfoReportingState.PRE_REPORTING;
      //   } else if (new BigNumber(marketCreatedLog.endTime).lt(new BigNumber((Date.now() * 1000) + 86400))) {
      //     reportingState = MarketInfoReportingState.DESIGNATED_REPORTING;
      //   } else {
      //     const initialReportSubmittedLogs = await this.db.findInitialReportSubmittedLogs({selector: {market: marketCreatedLog.market}});
      //     if (initialReportSubmittedLogs.length > 0) {
      //       reportingState = MarketInfoReportingState.OPEN_REPORTING;
      //     } else {
      //       if (normal dispute pacing has begun && crowdsourcer is not completed) {
      //         reportingState = MarketInfoReportingState.AWAITING_NEXT_WINDOW;
      //       } else {
      //         if (marketFinalizedLogs.length > 0) {
      //           reportingState = MarketInfoReportingState.FINALIZED;
      //         } else {
      //           reportingState = MarketInfoReportingState.CROWDSOURCING_DISPUTE;
      //         }
      //       }
      //     }
      //   }
      // }

      return Object.assign({
        id: marketCreatedLog.market,
        universe: marketCreatedLog.universe,
        marketType,
        numOutcomes: marketCreatedLog.outcomes.length,
        minPrice: minPrice.toString(10),
        maxPrice: maxPrice.toString(10),
        cumulativeScale: cumulativeScale.toString(10),
        author: marketCreatedLog.marketCreator,
        creationTime: marketCreatedLog.timestamp, // TODO Need to save block timestamp in DBs
        creationBlock: marketCreatedLog.blockNumber,
        category: Buffer.from(category, "hex").toString(),
        volume,
        openInterest,
        reportingState,
        needsMigration,
        endTime: new BigNumber(marketCreatedLog.endTime).toNumber(),
        finalizationBlockNumber,
        finalizationTime,
        description: marketCreatedLog.description,
        scalarDenomination,
        details,
        resolutionSource,
        numTicks: numTicks.toString(10),
        tickSize: tickSize.toString(10),
        consensus,
        outcomes
      });
    }));
  }
}
