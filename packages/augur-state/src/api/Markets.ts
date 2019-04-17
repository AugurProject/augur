import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import { MarketType } from "../logs/types";
import { SortLimit } from "./types";
import { numTicksToTickSize } from "@augurproject/api";

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
  consensus: null, // TODO Update once consensus has been added to MarketFinalized Event
  outcomes: Array<MarketInfoOutcome>;
}

export class Markets<TBigNumber> {
  public static GetMarketsParams = t.intersection([GetMarketsParamsSpecific, SortLimit]);
  public static GetMarketsInfoParams = t.type({ marketIds: t.array(t.string) });

  @Getter("GetMarketsParams")
  public static async getMarkets<TBigNumber>(db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.GetMarketsParams>): Promise<void> {
    // TODO
  }

  @Getter("GetMarketsInfoParams")
  public static async getMarketsInfo<TBigNumber>(db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.GetMarketsInfoParams>): Promise<Array<MarketInfo>> {
    // TODO Improve performance by using Promise.all for DB queries
    const marketCreatedLogs = await db.findMarketCreatedLogs({ selector: { market: { $in: params.marketIds } } });

    return await Promise.all(marketCreatedLogs.map(async (marketCreatedLog) => {
      let finalizationBlockNumber = null;
      let finalizationTime = null;
      const marketFinalizedLogs = await db.findMarketFinalizedLogs({ selector: { market: marketCreatedLog.market } });
      if (marketFinalizedLogs.length > 0) {
        finalizationBlockNumber = marketFinalizedLogs[0].blockNumber;
        // TODO Update finalizationTime once finalizationTime has been added to MarketFinalized event
      }

      let volume = "0";
      const marketVolumeChangedLogs = (await db.findMarketVolumeChangedLogs({ selector: { market: marketCreatedLog.market } })).reverse();
      if (marketVolumeChangedLogs.length > 0) {
        volume = new BigNumber(marketVolumeChangedLogs[0].volume).toString();
      }

      const minPrice = new BigNumber(marketCreatedLog.minPrice);
      const maxPrice = new BigNumber(marketCreatedLog.maxPrice);
      const numTicks = new BigNumber(marketCreatedLog.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
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
      const completeSetsPurchasedLogs = (await db.findCompleteSetsPurchasedLogs({ selector: { market: marketCreatedLog.market } })).reverse();
      const completeSetsSoldLogs = (await db.findCompleteSetsSoldLogs({ selector: { market: marketCreatedLog.market } })).reverse();
      if (completeSetsPurchasedLogs.length > 0 && completeSetsSoldLogs.length > 0) {
        if (completeSetsPurchasedLogs[0].blockNumber > completeSetsSoldLogs[0].blockNumber) {
          openInterest = new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
        } else if (completeSetsSoldLogs[0].blockNumber > completeSetsPurchasedLogs[0].blockNumber) {
          openInterest = new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
        } else if (completeSetsPurchasedLogs[0].transactionIndex > completeSetsSoldLogs[0].transactionIndex) {
          openInterest = new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
        } else {
          openInterest = new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
        }
      } else if (completeSetsPurchasedLogs.length > 0) {
        openInterest = new BigNumber(completeSetsPurchasedLogs[0].marketOI).toString();
      } else if (completeSetsSoldLogs.length > 0) {
        openInterest = new BigNumber(completeSetsSoldLogs[0].marketOI).toString();
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
