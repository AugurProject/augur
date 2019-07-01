import * as t from "io-ts";
import {Augur} from "../../Augur";
import {DB} from "../db/DB";
import {Getter} from "./Router";

export interface SyncData {
  highestAvailableBlockNumber: number;
  lastSyncedBlockNumber: number;
  blocksBehindCurrent: number;
  percentBehindCurrent: string;
}

export class Status {
  public static getSyncDataParams = t.type({});

  @Getter("getSyncDataParams")
  public static async getSyncData(augur: Augur, db: DB, params: t.TypeOf<typeof Status.getSyncDataParams>): Promise<SyncData> {
    const dbName = db.getDatabaseName("MarketCreated");
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();
    const lastSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(dbName);
    const blocksBehindCurrent = (highestAvailableBlockNumber - lastSyncedBlockNumber);
    const percentBehindCurrent = (blocksBehindCurrent / highestAvailableBlockNumber * 100).toFixed(4);
    const timestamp = 10;

    return {
      highestAvailableBlockNumber,
      lastSyncedBlockNumber,
      blocksBehindCurrent,
      percentBehindCurrent,
    };
  }
}
