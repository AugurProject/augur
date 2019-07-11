import * as _ from "lodash";
import { AbstractDB, BaseDocument } from "./AbstractDB";
import { SyncStatus } from "./SyncStatus";
import { Log, ParsedLog } from "@augurproject/types";
import { Augur } from '../../Augur';
import { DB } from "./DB";
import { sleep } from "../utils/utils";

/**
 * Stores derived data from multiple logs and post-log processing
 */
export class DerivedDB extends AbstractDB {
  private syncStatus: SyncStatus;
  private idFields: Array<string>;
  private mergeEventNames: Array<string>;
  private stateDB: DB;
  private updatingHighestSyncBlock: boolean = false;

  constructor(db: DB, networkId: number, name: string, mergeEventNames: Array<string>, idFields: Array<string>) {
    super(networkId, db.getDatabaseName(name), db.pouchDBFactory);
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    this.mergeEventNames = mergeEventNames;
    this.stateDB = db;
    this.db.createIndex({
      index: {
        fields: idFields
      }
    });

    for (const eventName of mergeEventNames) {
        db.registerEventListener(eventName, this.handleMergeEvent);
    }

    db.notifyDerivedDBAdded(this);
  }

  // For all mergable event types get any new documents we haven't pulled in and pull them in
  public async sync(highestAvailableBlockNumber: number): Promise<void> {
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    for (const eventName of this.mergeEventNames) {
      const request = {
        selector: {
          blockNumber: { $gte: highestSyncedBlockNumber }
        }
      };
      const result = await this.stateDB.findInSyncableDB(this.stateDB.getDatabaseName(eventName), request);
      await this.handleMergeEvent(highestAvailableBlockNumber, result.docs as Array<unknown> as Array<ParsedLog>, true);
    }

    await this.syncStatus.setHighestSyncBlock(this.dbName, highestAvailableBlockNumber, true);
  }

  // For a group of documents/logs for a particular event type get the latest per id and update the DB documents for the corresponding ids
  public handleMergeEvent = async (blocknumber: number, logs: Array<ParsedLog>, syncing: boolean = false): Promise<number> => {
    let success = true;
    let documents;
    if (logs.length > 0) {
      documents = _.map(logs, this.processLog.bind(this));
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

      success = await this.bulkUpsertUnorderedDocuments(documents);
    }

    if (success) {
      if (!syncing) {
        // The mutex behavior here is needed since a derived DB may be responding to multiple updates in parallel
        while (this.updatingHighestSyncBlock) {
          await sleep(10);
        }
        this.updatingHighestSyncBlock = true;
        await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber, syncing);
        this.updatingHighestSyncBlock = false;
      }
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  }

  protected processLog(log: Log): BaseDocument {
    let _id = "";
    delete log["_id"];
    delete log["_rev"];
    for (let fieldName of this.idFields) {
      _id += _.get(log, fieldName);
    }
    return Object.assign(
      { _id },
      log
    );
  }
}
