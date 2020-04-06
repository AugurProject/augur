import * as t from 'io-ts';
import { Augur } from '../../Augur';
import { DB } from '../db/DB';
import { WarpCheckpointDocument } from '../db/WarpSyncCheckpointsDB';
import { Getter } from './Router';

export class WarpSyncGetter {
  static getMostRecentWarpSyncParams = t.undefined;

  @Getter('getMostRecentWarpSyncParams')
  static async getMostRecentWarpSync(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof WarpSyncGetter.getMostRecentWarpSyncParams>
  ): Promise<WarpCheckpointDocument> {
    return db.warpCheckpoints.getMostRecentWarpSync();
  }
}
