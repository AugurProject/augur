import {AbstractDB, PouchDBFactoryType} from "./AbstractDB";
import {DB} from "./DB";
import {SyncStatus} from "./SyncStatus";

export interface SequenceIds {
  [dbName: string]: string
}

/**
 * Associates block numbers with event DB sequence IDs.
 * Used for doing syncing/rolling back of derived DBs.
 *
 * TODO Remove this class if derived DBs are not used.
 */
export class MetaDB extends AbstractDB {
  private syncStatus: SyncStatus;

  constructor(dbController: DB, networkId: number, dbFactory: PouchDBFactoryType) {
    super(networkId, networkId + "-BlockNumbersSequenceIds", dbFactory);
    this.syncStatus = dbController.syncStatus;
    this.db.createIndex({
      index: {
        fields: ['blockNumber']
      }
    });
  }

  public async addNewBlock(blockNumber: number, sequenceIds: SequenceIds) {
    await this.upsertDocument(
      this.networkId + "-" + blockNumber,
      {
        blockNumber,
        sequenceIds: JSON.stringify(sequenceIds),
      }
    );
    await this.syncStatus.setHighestSyncBlock(this.dbName, blockNumber);
  }

  public async rollback(blockNumber: number): Promise<void> {
    // Remove each change from blockNumber onward
    try {
      let highestSyncBlock = await this.syncStatus.getHighestSyncBlock(this.dbName);
      // Sort blocks so newest blocks are removed first
      const blocksToRemove = await this.db.find({
        selector: {blockNumber: {$gte: blockNumber}},
        fields: ['blockNumber', '_id', '_rev'],
        sort: [{blockNumber: 'desc'}],
      });
      if (blocksToRemove.docs.length > 0) {
        console.log("\n\nDeleting the following blocks from " + this.dbName);
        console.log(blocksToRemove.docs);
        for (let doc of blocksToRemove.docs) {
          // Remove block number from MetaDB
          await this.db.remove(doc._id, doc._rev);
          // Update highest sync block with decremented block number
          await this.syncStatus.setHighestSyncBlock(this.dbName, --highestSyncBlock);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}
