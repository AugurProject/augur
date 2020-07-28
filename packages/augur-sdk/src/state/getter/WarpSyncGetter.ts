import { MarketReportingState, NullWarpSyncHash } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import { Augur } from '../../Augur';
import { DB } from '../db/DB';
import { WarpCheckpointDocument } from '../db/WarpSyncCheckpointsDB';
import { Markets } from './Markets';
import { Getter } from './Router';

export interface WarpSyncStatusResponse {
  // Unknown means uninitialized.
  state: MarketReportingState;
  hash: string;
}

export class WarpSyncGetter {
  static getMostRecentWarpSyncParams = t.undefined;
  static getWarpSyncStatusParams = t.undefined;

  @Getter('getMostRecentWarpSyncParams')
  static async getMostRecentWarpSync(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof WarpSyncGetter.getMostRecentWarpSyncParams>
  ): Promise<WarpCheckpointDocument> {
    return db.warpCheckpoints.getMostRecentWarpSync();
  }

  @Getter('getWarpSyncStatusParams')
  static async getWarpSyncStatus(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof WarpSyncGetter.getWarpSyncStatusParams>
  ): Promise<WarpSyncStatusResponse> {
    const mostRecentCheckpoint = await db.warpCheckpoints.getMostRecentCheckpoint();
    if (typeof mostRecentCheckpoint === 'undefined') {
      return {
        state: MarketReportingState.Unknown,
        hash: NullWarpSyncHash
      };
    }

    const [currentMarket] = await Markets.getMarketsInfo(augur, db, {
      marketIds: [mostRecentCheckpoint.market],
    });

    if (typeof currentMarket === 'undefined') {
      return {
        state: MarketReportingState.Unknown,
        hash: null
      }
    }

    switch (currentMarket.reportingState) {
      // Return previous reported hash.
      case MarketReportingState.PreReporting:
        const mostRecentWarpSync = await db.warpCheckpoints.getMostRecentWarpSync();
        // Only one warp sync market thus far.
        if(typeof mostRecentWarpSync === 'undefined') {
          return {
            state: MarketReportingState.Unknown,
            hash: NullWarpSyncHash
          };
        }

        return {
          state: MarketReportingState.PreReporting,
          hash: mostRecentWarpSync.hash
        };

      case MarketReportingState.DesignatedReporting:
        return {
          state: MarketReportingState.DesignatedReporting,
          hash: mostRecentCheckpoint.hash
        };

      case MarketReportingState.OpenReporting:
        return {
          state: MarketReportingState.OpenReporting,
          hash: mostRecentCheckpoint.hash
        };

      case MarketReportingState.CrowdsourcingDispute:
        const market = augur.getMarket(mostRecentCheckpoint.market);
        const payout = await market.getWinningPayoutNumerator_(new BigNumber(2));

        return {
          state: MarketReportingState.CrowdsourcingDispute,
          hash: augur.warpSync.getWarpSyncHashFromPayout(payout)
        };

      // Return hash for current market, we should know about new market shortly.
      case MarketReportingState.Finalized:

        break;
      // We shouldn't really end up here unl
      default:
        console.log('default_case', currentMarket.reportingState);
        return {
          state: MarketReportingState.Unknown,
          hash: NullWarpSyncHash
        };
    }


    console.log('currentMarket', JSON.stringify(currentMarket));

    return {
      state: currentMarket.reportingState as unknown as MarketReportingState,
      hash: NullWarpSyncHash
    };
  }
}
