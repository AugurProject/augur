import * as t from "io-ts";
import { Augur } from "../../Augur";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import { SyncStatus } from "../db/SyncStatus";

export interface SyncData {
  highestAvailableBlockNumber: number;
  lastSyncedBlockNumber: number;
  blocksBehindCurrent: number;
  percentBehindCurrent: string;
}

export class SyncData {
  public static SyncDataParams = t.type({});

  @Getter()
  public static async getSyncData(augur: Augur, db: DB, params: t.TypeOf<typeof SyncData.SyncDataParams>): Promise<SyncData> {
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();
    const lastSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock("MarketCreated");
    const blocksBehindCurrent = (highestAvailableBlockNumber - lastSyncedBlockNumber);
    const percentBehindCurrent = (blocksBehindCurrent / highestAvailableBlockNumber * 100).toFixed(4);

    return {
      highestAvailableBlockNumber,
      lastSyncedBlockNumber,
      blocksBehindCurrent,
      percentBehindCurrent,
    };
  }
}
