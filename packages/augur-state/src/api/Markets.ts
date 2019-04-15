import { BigNumber } from "bignumber.js";
import * as _ from "lodash";
import { numTicksToTickSize } from "@augurproject/api";
import { DB } from "../db/DB";
import { CompleteSetsPurchasedLog, CompleteSetsSoldLog, MarketType, MarketCreatedLog, MarketFinalizedLog } from "../logs/types";
import { SortLimit } from "./types";

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
  consensus: Array<number>|null,
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

  private async getMarketOutcomes(marketCreatedLog: MarketCreatedLog): Promise<Array<MarketInfoOutcome>> {
    let outcomes: Array<MarketInfoOutcome> = [];
    // TODO Set outcome prices
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
    return outcomes;
  }

  private getMarketOpenInterest(completeSetsPurchasedLogs: Array<CompleteSetsPurchasedLog>, completeSetsSoldLogs: Array<CompleteSetsSoldLog>): string {
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

  private async getMarketReportingState(marketCreatedLog: MarketCreatedLog, marketFinalizedLogs: Array<MarketFinalizedLog>): Promise<MarketInfoReportingState> {
    const universeForkedLogs = await this.db.findUniverseForkedLogs({selector: {universe: marketCreatedLog.universe}});
    if (universeForkedLogs.length > 0) {
      if (universeForkedLogs[0].market === marketCreatedLog.market) {
        return MarketInfoReportingState.FORKING;
      } else {
        const marketFinalizedLogs = await this.db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}});
        if (marketFinalizedLogs.length > 0) {
          return MarketInfoReportingState.FINALIZED;
        } else {
          return MarketInfoReportingState.AWAITING_FORK_MIGRATION;
        }
      }
    } else {
      const timestampSetLogs = (await this.db.findTimestampSetLogs({selector: {newTimestamp: {$ne: null}}})).reverse();
      let currentTimestamp;
      if (timestampSetLogs.length > 0) {
        currentTimestamp = new BigNumber(timestampSetLogs[0].newTimestamp);
      } else {
        currentTimestamp = new BigNumber(Math.round(Date.now() / 1000));
      }
      console.log("current " + currentTimestamp.toString() + " end time " + new BigNumber(marketCreatedLog.endTime).toString());
      if (new BigNumber(currentTimestamp).lt(marketCreatedLog.endTime)) {
        return MarketInfoReportingState.PRE_REPORTING;
      } else {
        const initialReportSubmittedLogs = await this.db.findInitialReportSubmittedLogs({selector: {market: marketCreatedLog.market}});
        const SECONDS_IN_A_DAY = 86400;
        const designatedReportingEndTime = currentTimestamp.plus(SECONDS_IN_A_DAY);
        if (initialReportSubmittedLogs.length === 0 && currentTimestamp.lt(designatedReportingEndTime)) {
          return MarketInfoReportingState.DESIGNATED_REPORTING;
        } else if (initialReportSubmittedLogs.length === 0 && currentTimestamp.gte(designatedReportingEndTime)) {
          return MarketInfoReportingState.OPEN_REPORTING;
        } else {
          if (marketFinalizedLogs.length > 0) {
            return MarketInfoReportingState.FINALIZED;
          } else {
            const disputeCrowdsourcerCompletedLogs = (await this.db.findDisputeCrowdsourcerCompletedLogs({selector: {market: marketCreatedLog.market}})).reverse();
            // TODO Finish if statement below
            if (disputeCrowdsourcerCompletedLogs.length > 0 && disputeCrowdsourcerCompletedLogs[0].pacingOn) {
              return MarketInfoReportingState.AWAITING_NEXT_WINDOW;
            } else {
              return MarketInfoReportingState.CROWDSOURCING_DISPUTE;
            }
          }
        }
      }
    }
  }

  public async getMarketsInfo(params: GetMarketsInfoParams): Promise<Array<MarketInfo>> {
    const marketCreatedLogs = await this.db.findMarketCreatedLogs({selector: {market: {$in: params.marketIds}}});

    return await Promise.all(marketCreatedLogs.map(async (marketCreatedLog) => {
      const marketFinalizedLogs = await this.db.findMarketFinalizedLogs({selector: {market: marketCreatedLog.market}});
      const marketVolumeChangedLogs = (await this.db.findMarketVolumeChangedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const completeSetsPurchasedLogs = (await this.db.findCompleteSetsPurchasedLogs({selector: {market: marketCreatedLog.market}})).reverse();
      const completeSetsSoldLogs = (await this.db.findCompleteSetsSoldLogs({selector: {market: marketCreatedLog.market}})).reverse();

      const minPrice = new BigNumber(marketCreatedLog.minPrice);
      const maxPrice = new BigNumber(marketCreatedLog.maxPrice);
      const numTicks = new BigNumber(marketCreatedLog.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const cumulativeScale = maxPrice.minus(minPrice);

      const reportingState = await this.getMarketReportingState(marketCreatedLog, marketFinalizedLogs);
      const needsMigration = (reportingState === MarketInfoReportingState.AWAITING_FORK_MIGRATION) ? true : false;

      let consensus = null;
      let finalizationBlockNumber = null;
      let finalizationTime = null;
      if (marketFinalizedLogs.length > 0) {
        consensus = marketFinalizedLogs[0].winningPayoutNumerators;
        finalizationBlockNumber = marketFinalizedLogs[0].blockNumber;
        finalizationTime = marketFinalizedLogs[0].timestamp;
      }

      let marketType: string;
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

      return Object.assign({
        id: marketCreatedLog.market,
        universe: marketCreatedLog.universe,
        marketType,
        numOutcomes: marketCreatedLog.outcomes.length,
        minPrice: minPrice.toString(10),
        maxPrice: maxPrice.toString(10),
        cumulativeScale: cumulativeScale.toString(10),
        author: marketCreatedLog.marketCreator,
        creationBlock: marketCreatedLog.blockNumber,
        category: Buffer.from(marketCreatedLog.topic.replace("0x", ""), "hex").toString(),
        volume: (marketVolumeChangedLogs.length > 0) ? new BigNumber(marketVolumeChangedLogs[0].volume).toString() : "0",
        openInterest: this.getMarketOpenInterest(completeSetsPurchasedLogs, completeSetsSoldLogs),
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
        outcomes: await this.getMarketOutcomes(marketCreatedLog)
      });
    }));
  }
}
