import * as t from 'io-ts';
import { Augur } from '../../Augur';
import { DB } from '../db/DB';
import { WarpSyncDocument } from '../db/WarpSyncDB';
import { Getter } from './Router';

export class WarpSyncGetter {
  static getMostRecentWarpSyncParams = t.undefined;

  @Getter('getMostRecentWarpSyncParams')
  static async getMostRecentWarpSync(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof WarpSyncGetter.getMostRecentWarpSyncParams>
  ): Promise<WarpSyncDocument> {
    console.log(
      'await this.db.warpSync.createCheckpoint(beginBlock, endBlock, d.toString())'
    );

    return db.warpSync.getMostRecentWarpSync();
  }
}
