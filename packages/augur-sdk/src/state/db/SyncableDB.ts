import * as _ from "lodash";
import { AbstractDB, BaseDocument } from "./AbstractDB";
import { Augur } from "../../Augur";
import { DB } from "./DB";
import { Log, ParsedLog } from "@augurproject/types";
import { SyncStatus } from "./SyncStatus";
import { augurEmitter } from "../../events";

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB extends AbstractDB {
  protected augur: Augur;
  protected eventName: string;
  private syncStatus: SyncStatus;
  private idFields: string[];
  private syncing: boolean;
  private rollingBack: boolean;

  constructor(
    augur: Augur,
    db: DB,
    networkId: number,
    eventName: string,
    dbName: string = db.getDatabaseName(eventName),
    idFields: string[] = []
  ) {
    super(networkId, dbName, db.pouchDBFactory);
    this.augur = augur;
    this.eventName = eventName;
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    this.db.createIndex({
      index: {
        fields: ['blockNumber'],
      },
    });
    if (this.idFields.length > 0) {
      this.db.createIndex({
        index: {
          fields: this.idFields,
        },
      });
    }
    db.notifySyncableDBAdded(this);
    db.registerEventListener(this.eventName, this.addNewBlock);

    this.syncing = false;
    this.rollingBack = false;
  }

  async sync(augur: Augur, chunkSize: number, blockStreamDelay: number, highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;

    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);

    const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
    while (highestSyncedBlockNumber < goalBlock) {
      const endBlockNumber = Math.min(highestSyncedBlockNumber + chunkSize, highestAvailableBlockNumber);
      const logs = await this.getLogs(augur, highestSyncedBlockNumber, endBlockNumber);
      highestSyncedBlockNumber = await this.addNewBlock(endBlockNumber, logs);
    }

    this.syncing = false;
    await this.syncStatus.updateSyncingToFalse(this.dbName);

    // TODO Make any external calls as needed (such as pushing user's balance to UI)
  }

  private parseLogArrays(logs: ParsedLog[]): void {
    for (let i = 0; i < logs.length; i++) {
      logs[i].kycToken = logs[i].addressData[0];
      logs[i].orderCreator = logs[i].addressData[1];
      logs[i].orderFiller = logs[i].addressData[2];

      logs[i].price = logs[i].uint256Data[0];
      logs[i].amount = logs[i].uint256Data[1];
      logs[i].outcome = logs[i].uint256Data[2];
      logs[i].tokenRefund = logs[i].uint256Data[3];
      logs[i].sharesRefund = logs[i].uint256Data[4];
      logs[i].fees = logs[i].uint256Data[5];
      logs[i].amountFilled = logs[i].uint256Data[6];
      logs[i].timestamp = logs[i].uint256Data[7];
      logs[i].sharesEscrowed = logs[i].uint256Data[8];
      logs[i].tokensEscrowed = logs[i].uint256Data[9];

      delete logs[i].addressData;
      delete logs[i].uint256Data;
    }
  }


  addNewBlock = async (blocknumber: number, logs: ParsedLog[]): Promise<number> => {
    // don't do anything until rollback is complete. We'll sync back to this block later
    if (this.rollingBack) {
      return -1;
    }

    if (this.eventName === "OrderEvent") {
      this.parseLogArrays(logs);
    }

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

      success = await this.bulkUpsertOrderedDocuments(documents[0]._id, documents);
    }
    if (success) {
      if (documents && (documents as any[]).length) {
        _.each(documents, (document: any) => {
          augurEmitter.emit(this.eventName, {
            eventName: this.eventName,
            ...document,
          });
        });
      }

      await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber, this.syncing);

      // let the controller know a new block was added so it can update the UI
      augurEmitter.emit("controller:new:block", {});
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  }

  async rollback(blockNumber: number): Promise<void> {
    // Remove each change from blockNumber onward
    this.rollingBack = true;

    try {
      const blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id', 'blockNumber', '_rev'],
      });
      for (const doc of blocksToRemove.docs) {
        await this.db.remove(doc._id, doc._rev);
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber, this.syncing, true);
    } catch (err) {
      console.error(err);
    }

    this.rollingBack = false;
  }

  protected async getLogs(augur: Augur, startBlock: number, endBlock: number): Promise<ParsedLog[]> {
    return augur.events.getLogs(this.eventName, startBlock, endBlock);
  }

  protected processLog(log: Log): BaseDocument {
    if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
    let _id = "";
    // TODO: This works in bulk sync currently because we process logs chronologically. When we switch to reverse chrono for bulk sync we'll need to add more logic
    if (this.idFields.length > 0) {
      // need to preserve order of fields in id
      for (const fieldName of this.idFields) {
        _id += _.get(log, fieldName);
      }
    } else {
      _id = `${(log.blockNumber + 10000000000).toPrecision(21)}${log.logIndex}`;
    }
    return Object.assign(
      { _id },
      log
    );
  }

  getFullEventName(): string {
    return this.eventName;
  }
}
