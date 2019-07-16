import * as _ from "lodash";
import { AbstractDB, BaseDocument } from "./AbstractDB";
import { SyncStatus } from "./SyncStatus";
import { Log, ParsedLog } from "@augurproject/types";
import { Augur } from '../../Augur';
import { DB } from "./DB";
import { sleep } from "../utils/utils";

export interface Document extends BaseDocument {
  blockNumber: number;
}

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

  public async rollback(blockNumber: number): Promise<void> {
    try {
      let blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id'],
      });
      for (let doc of blocksToRemove.docs) {
        const revDocs = await this.db.get<Document>(doc._id, {
          open_revs: 'all',
          revs: true
        });
        // If a revision exists before this blockNumber make that the new record, otherwise simply delete the doc.
        const replacementDoc = _.maxBy(_.remove(revDocs, (doc) => { return doc.ok.blockNumber > blockNumber; }), "ok.blockNumber");
        if (replacementDoc) {
          await this.db.put(replacementDoc.ok);
        } else {
          await this.db.remove(doc._id, doc._rev);
        }
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber, false);
    } catch (err) {
      console.error(err);
    }
  }

  // For a group of documents/logs for a particular event type get the latest per id and update the DB documents for the corresponding ids
  public handleMergeEvent = async (blocknumber: number, logs: Array<ParsedLog>, syncing: boolean = false): Promise<number> => {
    let success = true;
    let documents;
    if (logs.length > 0) {
      documents = _.map(logs, this.processLog.bind(this));
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].addressData) {
          documents[i].kycToken = documents[i].addressData[0];
          documents[i].orderCreator = documents[i].addressData[1];
          documents[i].orderFiller = documents[i].addressData[2];
          delete documents[i].addressData;
        }
        if (documents[i].uint256Data) {
          documents[i].price = documents[i].uint256Data[0];
          documents[i].amount = documents[i].uint256Data[1];
          documents[i].outcome = documents[i].uint256Data[2];
          documents[i].tokenRefund = documents[i].uint256Data[3];
          documents[i].sharesRefund = documents[i].uint256Data[4];
          documents[i].fees = documents[i].uint256Data[5];
          documents[i].amountFilled = documents[i].uint256Data[6];
          documents[i].timestamp = documents[i].uint256Data[7];
          documents[i].sharesEscrowed = documents[i].uint256Data[8];
          documents[i].tokensEscrowed = documents[i].uint256Data[9];
          delete documents[i].uint256Data;
        }
      }
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
