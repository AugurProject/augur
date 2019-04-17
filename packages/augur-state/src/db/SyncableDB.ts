import { AbstractDB, BaseDocument } from "./AbstractDB";
import { Augur, Log, ParsedLog } from "@augurproject/api";
import { DB } from "./DB";
import { SyncStatus } from "./SyncStatus";
import * as _ from "lodash";

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB<TBigNumber> extends AbstractDB {
  protected eventName: string;
  protected contractName: string; // TODO Remove if unused
  private syncStatus: SyncStatus;
  private idFields: Array<string>;

  constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, dbName: string = dbController.getDatabaseName(eventName), idFields: Array<string> = []) {
    super(networkId, dbName, dbController.pouchDBFactory);
    this.eventName = eventName;
    this.syncStatus = dbController.syncStatus;
    this.idFields = idFields;
    // TODO Set other indexes as need be
    this.db.createIndex({
      index: {
        fields: ['blockNumber']
      }
    });
    dbController.notifySyncableDBAdded(this);
    dbController.registerEventListener(this.eventName, this.addNewBlock);
  }

  public async createIndex(indexOptions: PouchDB.Find.CreateIndexOptions): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    return this.db.createIndex(indexOptions);
  }

  public async getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>> {
    return this.db.getIndexes();
  }

  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockStreamDelay: number, highestAvailableBlockNumber: number): Promise<void> {
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
    while (highestSyncedBlockNumber < goalBlock) {
      const endBlockNumber = Math.min(highestSyncedBlockNumber + chunkSize, highestAvailableBlockNumber);
      const logs = await this.getLogs(augur, highestSyncedBlockNumber, endBlockNumber);
      highestSyncedBlockNumber = await this.addNewBlock(endBlockNumber, logs);
    }
    // TODO Make any external calls as needed (such as pushing user's balance to UI)
  }

  public async addNewBlock(blocknumber: number, logs: Array<ParsedLog>): Promise<number> {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);

    let success = true;
    let documents;
    if (logs.length > 0) {
      documents = _.map(logs, this.processLog.bind(this));
      // If this is a table which is keyed by fields (meaning we are doing updates to a value instead of pulling in a history of events) we only want the most recent document for any given id
      if (this.idFields.length > 0) {
        documents = _.values(_.mapValues(_.groupBy(documents, "_id"), (idDocuments) => {
          return _.reduce(idDocuments, (val, doc) => {
            if (val.blockNumber < doc.blockNumber) {
              val = doc;
            } else if (val.blockNumber === doc.blockNumber && val.logIndex < doc.logIndex) {
              val = doc;
            }
            return val;
          }, idDocuments[0]);
        }));
      }
      documents = _.sortBy(documents, "_id");
      success = await this.bulkUpsertDocuments(documents[0]._id, documents);
    }
    if (success) {
      await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber);
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  };

  public async rollback(blockNumber: number): Promise<void> {
    if (this.idFields.length > 0) {
      await this.revisionRollback(blockNumber);
    } else {
      await this.documentRollback(blockNumber);
    }
  }

  private async documentRollback(blockNumber: number): Promise<void> {
    // Remove each change from blockNumber onward
    try {
      let blocksToRemove = await this.db.find({
        selector: {blockNumber: {$gte: blockNumber}},
        fields: ['_id', 'blockNumber', '_rev'],
      });
      for (let doc of blocksToRemove.docs) {
        await this.db.remove(doc._id, doc._rev);
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber);
    } catch (err) {
        console.error(err);
    }
  }

  private async revisionRollback(blockNumber: number): Promise<void> {
    try {
      let blocksToRemove = await this.db.find({
        selector: {blockNumber: {$gte: blockNumber}},
        fields: ['_id'],
      });
      for (let doc of blocksToRemove.docs) {
        const revDocs = await this.db.get<Document>(doc._id, {
          open_revs: 'all',
          revs: true
        });
        // TODO Find latest revision with blocknumber below blockNumber and make that the latest
        for (let revDoc of revDocs) {
          console.log(revDoc.ok.blockNumber);
        }
        await this.db.remove(doc._id, doc._rev);
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber);
    } catch (err) {
        console.error(err);
    }
  }

  protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<ParsedLog>> {
    return await augur.events.getLogs(this.eventName, startBlock, endBlock);
  }

  protected processLog(log: Log): BaseDocument {
    if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
    let _id = "";
    if (this.idFields.length > 0) {
      // need to preserve order of fields in id
      for (let fieldName of this.idFields) {
        _id += _.get(log, fieldName);
      }
    } else {
      _id = `${log.blockNumber.toPrecision(21)}${log.logIndex}`;
    }
    return Object.assign(
      {_id},
      log
    );
  }
}
